// Initialize variables
let vulnerability = []
let filteredVulnerability = []
const currentSort = { field: "priorityScore", direction: "desc" }
let currentPage = 1
const itemsPerPage = 50
let totalVulnerabilities = 0
let isAISearchActive = false

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Wait for Lucide to load, then initialize icons
  setTimeout(() => {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons()
    }
  }, 100)

  // Initialize the page
  fetchVulnerability()

  // Handle URL hash for direct severity filtering
  const hash = window.location.hash.substring(1)
  if (["critical", "high", "medium", "low"].includes(hash)) {
    const severity = hash.charAt(0).toUpperCase() + hash.slice(1)
    setTimeout(() => filterBySeverity(severity), 500)
  }
})

// Helper function to safely create icons
function safeCreateIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons()
  }
}

// Sidebar toggle logic
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  if (sidebar) {
    sidebar.classList.toggle("sidebar-expanded")
    sidebar.classList.toggle("sidebar-collapsed")
    document.querySelectorAll(".sidebar-label").forEach((el) => el.classList.toggle("hidden"))
  }
}

// AI Search Functions - Modified to only update filters
async function performAISearch() {
  const searchInput = document.getElementById("aiSearchInput")
  const searchButton = document.getElementById("aiSearchButton")
  const statusDiv = document.getElementById("aiSearchStatus")
  const statusText = document.getElementById("aiSearchStatusText")

  const query = searchInput.value.trim()
  if (!query) {
    alert("Please enter a search query")
    return
  }

  // Show loading state
  searchButton.disabled = true
  searchButton.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 ai-search-loading"></i>'
  safeCreateIcons()

  statusDiv.classList.remove("hidden")
  statusText.textContent = "AI is analyzing your query..."

  try {
    // Parse the query locally to extract filter criteria
    const filters = parseQueryWithGeminiLogic(query)
    
    // Apply the filters to the advanced filter dropdowns
    applyFiltersToUI(filters)
    
    // Show the advanced filters section
    showAdvancedFilters()
    
    // Update status
    statusText.textContent = `AI interpreted your query and updated the filters`
    isAISearchActive = true
    
    // Apply the filters to actually filter the data - WITHOUT clearing AI search
    setTimeout(() => {
      applyAdvancedFiltersFromAI()
    }, 500)

  } catch (error) {
    console.error("AI Search Error:", error)
    statusText.textContent = "Error processing your query. Please try again."
  } finally {
    // Reset button state
    searchButton.disabled = false
    searchButton.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i>'
    safeCreateIcons()
  }
}

function parseQueryWithGeminiLogic(query) {
  const filters = {}
  const lowerQuery = query.toLowerCase()

  // Parse severity
  if (lowerQuery.includes("critical")) {
    filters.severity = "Critical"
  } else if (lowerQuery.includes("high")) {
    filters.severity = "High"
  } else if (lowerQuery.includes("medium")) {
    filters.severity = "Medium"
  } else if (lowerQuery.includes("low")) {
    filters.severity = "Low"
  }

  // Parse exploit status
  if (lowerQuery.includes("exploit") && 
      (lowerQuery.includes("available") || lowerQuery.includes("active") || lowerQuery.includes("known"))) {
    filters.exploitStatus = "Known Exploits"
  }

  // Parse vulnerability types for traditional search
  const vulnTypes = [
    "sql injection", "remote code execution", "rce", "privilege escalation", 
    "authentication bypass", "command injection", "buffer overflow", 
    "cross-site scripting", "xss", "memory corruption"
  ]
  
  for (const type of vulnTypes) {
    if (lowerQuery.includes(type)) {
      filters.search = type.replace(/\b\w/g, l => l.toUpperCase())
      break
    }
  }

  // Parse asset types for asset name filter
  if (lowerQuery.includes("web server") || lowerQuery.includes("webserver")) {
    filters.assetName = "WebServer"
  } else if (lowerQuery.includes("database") || lowerQuery.includes("db server")) {
    filters.assetName = "Database"
  } else if (lowerQuery.includes("server")) {
    filters.assetName = "Server"
  } else if (lowerQuery.includes("windows")) {
    filters.assetName = "Windows"
  }

  // Parse sources
  if (lowerQuery.includes("tenable")) {
    filters.adapterSource = "Tenable"
  } else if (lowerQuery.includes("qualys")) {
    filters.adapterSource = "Qualys"
  } else if (lowerQuery.includes("sonarqube")) {
    filters.adapterSource = "SonarQube"
  } else if (lowerQuery.includes("orca")) {
    filters.adapterSource = "Orca Security"
  } else if (lowerQuery.includes("wiz")) {
    filters.adapterSource = "Wiz"
  } else if (lowerQuery.includes("bitsight")) {
    filters.adapterSource = "Bitsight"
  }

  // Parse MITRE tactics
  const mitreTactics = [
    { keywords: ["initial access", "initial"], value: "Initial Access" },
    { keywords: ["execution", "execute"], value: "Execution" },
    { keywords: ["persistence", "persistent"], value: "Persistence" },
    { keywords: ["privilege escalation", "escalation"], value: "Privilege Escalation" },
    { keywords: ["defense evasion", "evasion"], value: "Defense Evasion" },
    { keywords: ["credential access", "credentials"], value: "Credential Access" },
    { keywords: ["discovery"], value: "Discovery" },
    { keywords: ["lateral movement", "lateral"], value: "Lateral Movement" },
    { keywords: ["collection"], value: "Collection" },
    { keywords: ["command and control", "c2"], value: "Command and Control" },
    { keywords: ["exfiltration"], value: "Exfiltration" },
    { keywords: ["impact"], value: "Impact" }
  ]

  for (const tactic of mitreTactics) {
    if (tactic.keywords.some(keyword => lowerQuery.includes(keyword))) {
      filters.mitre = tactic.value
      break
    }
  }

  // Parse IP addresses
  const ipMatch = query.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/)
  if (ipMatch) {
    filters.ipAddress = ipMatch[0]
  }

  return filters
}

function applyFiltersToUI(filters) {
  // Apply severity filter
  if (filters.severity) {
    const severityFilter = document.getElementById("severityFilter")
    if (severityFilter) {
      severityFilter.value = filters.severity
    }
  }

  // Apply traditional search
  if (filters.search) {
    const searchInput = document.getElementById("searchVulns")
    if (searchInput) {
      searchInput.value = filters.search
    }
  }

  // Apply asset name filter
  if (filters.assetName) {
    const assetNameFilter = document.getElementById("assetNameFilter")
    if (assetNameFilter) {
      assetNameFilter.value = filters.assetName
    }
  }

  // Apply IP address filter
  if (filters.ipAddress) {
    const ipAddressFilter = document.getElementById("ipAddressFilter")
    if (ipAddressFilter) {
      ipAddressFilter.value = filters.ipAddress
    }
  }

  // Apply exploit status filter
  if (filters.exploitStatus) {
    const exploitStatusFilter = document.getElementById("exploitStatusFilter")
    if (exploitStatusFilter) {
      exploitStatusFilter.value = filters.exploitStatus
    }
  }

  // Apply adapter source filter
  if (filters.adapterSource) {
    const adapterSourceFilter = document.getElementById("adapterSourceFilter")
    if (adapterSourceFilter) {
      adapterSourceFilter.value = filters.adapterSource
    }
  }

  // Apply MITRE filter
  if (filters.mitre) {
    const mitreFilter = document.getElementById("mitreFilter")
    if (mitreFilter) {
      mitreFilter.value = filters.mitre
    }
  }
}

function showAdvancedFilters() {
  const filtersDiv = document.getElementById("advancedFilters")
  const toggleText = document.getElementById("filterToggleText")
  const toggleIcon = document.getElementById("filterToggleIcon")

  if (filtersDiv && filtersDiv.classList.contains("hidden")) {
    filtersDiv.classList.remove("hidden")
    if (toggleText) toggleText.textContent = "Hide Filters"
    if (toggleIcon) toggleIcon.style.transform = "rotate(180deg)"
  }
}

// NEW FUNCTION: Apply filters from AI search without clearing AI state
function applyAdvancedFiltersFromAI() {
  currentPage = 1
  fetchVulnerability(currentPage)
}

function clearAISearch() {
  const searchInput = document.getElementById("aiSearchInput")
  const statusDiv = document.getElementById("aiSearchStatus")

  if (searchInput) searchInput.value = ""
  if (statusDiv) statusDiv.classList.add("hidden")
  isAISearchActive = false

  // Clear all filters
  clearTraditionalFilters()
  
  // Reload data without filters
  fetchVulnerability(1)
}

function clearTraditionalFilters() {
  // Clear all traditional filter inputs
  const filterInputs = [
    "searchVulns",
    "severityFilter", 
    "assetNameFilter",
    "ipAddressFilter",
    "assetGroupFilter",
    "exploitStatusFilter",
    "adapterSourceFilter",
    "mitreFilter",
    "threatActorFilter",
  ]

  filterInputs.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      element.value = ""
    }
  })
}

function handleAISearchKeyPress(event) {
  if (event.key === "Enter") {
    performAISearch()
  }
}

function setAISearchExample(example) {
  const searchInput = document.getElementById("aiSearchInput")
  if (searchInput) {
    searchInput.value = example
    searchInput.focus()
  }
}

function toggleAdvancedFilters() {
  const filtersDiv = document.getElementById("advancedFilters")
  const toggleText = document.getElementById("filterToggleText")
  const toggleIcon = document.getElementById("filterToggleIcon")

  if (filtersDiv && toggleText && toggleIcon) {
    if (filtersDiv.classList.contains("hidden")) {
      filtersDiv.classList.remove("hidden")
      toggleText.textContent = "Hide Filters"
      toggleIcon.style.transform = "rotate(180deg)"
    } else {
      filtersDiv.classList.add("hidden")
      toggleText.textContent = "Show Filters"
      toggleIcon.style.transform = "rotate(0deg)"
    }
  }
}

async function fetchVulnerability(page = 1) {
  try {
    currentPage = page
    const searchInput = document.getElementById("searchVulns")
    const severitySelect = document.getElementById("severityFilter")
    const assetNameInput = document.getElementById("assetNameFilter")
    const ipAddressInput = document.getElementById("ipAddressFilter")
    const exploitStatusSelect = document.getElementById("exploitStatusFilter")
    const adapterSourceSelect = document.getElementById("adapterSourceFilter")
    const mitreSelect = document.getElementById("mitreFilter")

    const searchTerm = searchInput ? searchInput.value : ""
    const severityFilter = severitySelect ? severitySelect.value : ""
    const assetNameFilter = assetNameInput ? assetNameInput.value : ""
    const ipAddressFilter = ipAddressInput ? ipAddressInput.value : ""
    const exploitStatusFilter = exploitStatusSelect ? exploitStatusSelect.value : ""
    const adapterSourceFilter = adapterSourceSelect ? adapterSourceSelect.value : ""
    const mitreFilter = mitreSelect ? mitreSelect.value : ""

    let url = `/api/vulnerability?page=${page}&limit=${itemsPerPage}&sortField=${currentSort.field}&sortOrder=${currentSort.direction}`

    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`
    if (severityFilter) url += `&severity=${encodeURIComponent(severityFilter)}`
    if (assetNameFilter) url += `&assetName=${encodeURIComponent(assetNameFilter)}`
    if (ipAddressFilter) url += `&ipAddress=${encodeURIComponent(ipAddressFilter)}`
    if (exploitStatusFilter) url += `&exploitStatus=${encodeURIComponent(exploitStatusFilter)}`
    if (adapterSourceFilter) url += `&source=${encodeURIComponent(adapterSourceFilter)}`
    if (mitreFilter) url += `&mitreTactic=${encodeURIComponent(mitreFilter)}`

    await fetchVulnerabilityWithURL(url)
  } catch (error) {
    console.error("Error fetching vulnerability:", error)
    loadSampleData()
  }
}

async function fetchVulnerabilityWithURL(url) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    vulnerability = data.vulnerability || []
    filteredVulnerability = [...vulnerability]
    totalVulnerabilities = data.pagination ? data.pagination.total : vulnerability.length

    displayVulnerability(filteredVulnerability)
    if (data.pagination) {
      updatePagination(data.pagination)
    }
    updateVulnerabilityCount()
  } catch (error) {
    console.error("Error fetching vulnerability with URL:", error)
    console.log("Falling back to sample data...")
    loadSampleData()
  }
}

function updatePagination(pagination) {
  const paginationContainer = document.querySelector(".pagination-container")
  if (!paginationContainer) return

  const { page, pages } = pagination

  let paginationHTML = `
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing <span class="font-medium">${(page - 1) * itemsPerPage + 1}</span> to 
          <span class="font-medium">${Math.min(page * itemsPerPage, totalVulnerabilities)}</span> of 
          <span class="font-medium">${totalVulnerabilities}</span> results
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button onclick="changePage(${page > 1 ? page - 1 : 1})" 
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}">
            <i data-lucide="chevron-left" class="w-5 h-5"></i>
          </button>`

  // Show page numbers
  const maxVisiblePages = 5
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(pages, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  if (startPage > 1) {
    paginationHTML += `
      <button onclick="changePage(1)" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
        1
      </button>`
    if (startPage > 2) {
      paginationHTML += `
        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          ...
        </span>`
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button onclick="changePage(${i})" 
              class="${i === page ? "bg-primary-50 border-primary-500 text-primary-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"} relative inline-flex items-center px-4 py-2 border text-sm font-medium">
        ${i}
      </button>`
  }

  if (endPage < pages) {
    if (endPage < pages - 1) {
      paginationHTML += `
        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          ...
        </span>`
    }
    paginationHTML += `
      <button onclick="changePage(${pages})" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
        ${pages}
      </button>`
  }

  paginationHTML += `
          <button onclick="changePage(${page < pages ? page + 1 : pages})" 
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === pages ? "opacity-50 cursor-not-allowed" : ""}">
            <i data-lucide="chevron-right" class="w-5 h-5"></i>
          </button>
        </nav>
      </div>
    </div>`

  paginationContainer.innerHTML = paginationHTML
  safeCreateIcons()
}

function changePage(page) {
  currentPage = page
  fetchVulnerability(page)
}

function loadSampleData() {
  console.log("Loading sample vulnerability data...")

  // Generate sample data if needed
  if (vulnerability.length === 0) {
    const assetTypes = [
      "Server",
      "WebServer",
      "Database",
      "Firewall",
      "Laptop",
      "Router",
      "Switch",
      "Mobile",
      "Workstation",
      "IoT-Device",
    ]
    const vulnTypes = [
      "Remote Code Execution",
      "SQL Injection",
      "Authentication Bypass",
      "Privilege Escalation",
      "Command Injection",
      "Buffer Overflow",
      "Cross-Site Scripting",
      "Memory Corruption",
      "Integer Overflow",
      "Use After Free",
      "Directory Traversal",
      "XML External Entity",
      "Insecure Deserialization",
      "Server-Side Request Forgery",
      "Weak Encryption",
      "Information Disclosure",
    ]
    const sources = ["Orca Security", "Tenable", "SonarQube", "Qualys", "Wiz", "Bitsight"]
    const statuses = ["Open", "In Progress", "Resurfaced", "False Positive"]
    const severities = ["Critical", "High", "Medium", "Low"]
    const mitreTactics = [
      "Initial Access (T1078)",
      "Execution (T1203)",
      "Persistence (T1098)",
      "Privilege Escalation (T1068)",
      "Defense Evasion (T1027)",
      "Credential Access (T1110)",
      "Discovery (T1016)",
      "Lateral Movement (T1021)",
      "Collection (T1119)",
      "Command and Control (T1071)",
      "Exfiltration (T1048)",
      "Impact (T1489)",
    ]

    // Generate more diverse sample data
    for (let i = 1; i <= 200; i++) {
      const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)]
      const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)]
      const severity = severities[Math.floor(Math.random() * severities.length)]
      const source = sources[Math.floor(Math.random() * sources.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const tactic = mitreTactics[Math.floor(Math.random() * mitreTactics.length)]

      let cvssScore
      switch (severity) {
        case "Critical":
          cvssScore = (9.0 + Math.random() * 1.0).toFixed(1)
          break
        case "High":
          cvssScore = (7.0 + Math.random() * 2.0).toFixed(1)
          break
        case "Medium":
          cvssScore = (4.0 + Math.random() * 3.0).toFixed(1)
          break
        case "Low":
          cvssScore = (0.1 + Math.random() * 3.9).toFixed(1)
          break
      }

      vulnerability.push({
        id: i,
        assetName: `${assetType}-${String(i).padStart(3, "0")}`,
        ipAddress: `192.168.${Math.floor(i / 254) + 1}.${(i % 254) + 1}`,
        vulnerability: vulnType,
        cve: `CVE-2023-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`,
        severity: severity,
        cvssScore: Number.parseFloat(cvssScore),
        status: status,
        source: source,
        description: `${severity} severity ${vulnType.toLowerCase()} vulnerability requiring attention.`,
        firstDetected: `2024-0${Math.floor(Math.random() * 6) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
        lastSeen: `2024-07-0${Math.floor(Math.random() * 4) + 1}`,
        epssScore: Number.parseFloat((Math.random() * 1).toFixed(2)),
        exploitAvailable: Math.random() > 0.6, // 40% chance of exploit being available
        affectedAssets: Math.floor(Math.random() * 100) + 1,
        mitreTactic: tactic,
        priorityScore: Math.floor(Math.random() * 100) + 1,
      })
    }
  }

  filteredVulnerability = [...vulnerability]
  totalVulnerabilities = vulnerability.length
  displayVulnerability(filteredVulnerability.slice(0, itemsPerPage))
  updatePagination({
    page: 1,
    pages: Math.ceil(vulnerability.length / itemsPerPage),
    total: vulnerability.length,
  })
  calculateLocalStats()
}

function updateVulnerabilityCount() {
  const showingCount = document.getElementById("showingVulnsCount")
  const totalCount = document.getElementById("totalVulnsCount")
  if (showingCount) showingCount.textContent = filteredVulnerability.length.toLocaleString()
  if (totalCount) totalCount.textContent = totalVulnerabilities.toLocaleString()
}

function calculateLocalStats() {
  const stats = {
    critical: vulnerability.filter((v) => v.severity === "Critical").length,
    high: vulnerability.filter((v) => v.severity === "High").length,
    medium: vulnerability.filter((v) => v.severity === "Medium").length,
    low: vulnerability.filter((v) => v.severity === "Low").length,
  }

  const criticalSpan = document.querySelector(".bg-red-50 span")
  const highSpan = document.querySelector(".bg-orange-50 span")
  const mediumSpan = document.querySelector(".bg-yellow-50 span")
  const lowSpan = document.querySelector(".bg-green-50 span")

  if (criticalSpan) criticalSpan.textContent = stats.critical
  if (highSpan) highSpan.textContent = stats.high
  if (mediumSpan) mediumSpan.textContent = stats.medium
  if (lowSpan) lowSpan.textContent = stats.low

  updateVulnerabilityCount()
}

function displayVulnerability(vulns) {
  const tbody = document.getElementById("allVulnsTableBody")
  if (!tbody) return

  const severityColors = {
    Critical: "bg-red-100 text-red-800",
    High: "bg-orange-100 text-orange-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  }

  const exploitColors = {
    true: "bg-red-100 text-red-800",
    false: "bg-green-100 text-green-800",
  }

  tbody.innerHTML = vulns
    .map(
      (vuln) => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <input type="checkbox" class="vuln-checkbox" value="${vuln.id}">
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${vuln.assetName}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-500">${vuln.ipAddress}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-blue-600 hover:underline cursor-pointer" onclick="showCVEDetails('${vuln.cve}')">${vuln.cve}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[vuln.severity]}">${vuln.severity}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${vuln.vulnerability}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900 font-medium">${vuln.cvssScore}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${vuln.source}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${vuln.status}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${vuln.epssScore}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${exploitColors[vuln.exploitAvailable]}">
          ${vuln.exploitAvailable ? "Yes" : "No"}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${vuln.affectedAssets}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${vuln.mitreTactic}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900 font-bold">${vuln.priorityScore}</div>
      </td>
    </tr>
  `,
    )
    .join("")

  updateVulnerabilityCount()
  safeCreateIcons()
}

function filterVulnerabilities() {
  // Only clear AI search if user manually changes traditional filters
  // Don't clear if this is called from AI search
  if (isAISearchActive && !event.target.closest('#advancedFilters')) {
    clearAISearch()
  }
  currentPage = 1
  fetchVulnerability(currentPage)
}

function filterBySeverity(severity) {
  // Clear AI search when using severity cards
  if (isAISearchActive) {
    clearAISearch()
  }
  const severityFilter = document.getElementById("severityFilter")
  if (severityFilter) {
    severityFilter.value = severity
  }
  filterVulnerabilities()
}

function sortTable(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc"
  } else {
    currentSort.field = field
    currentSort.direction = "asc"
  }

  fetchVulnerability(currentPage)
}

function toggleSelectAll() {
  const selectAll = document.getElementById("selectAll")
  const checkboxes = document.querySelectorAll(".vuln-checkbox")
  if (selectAll) {
    checkboxes.forEach((cb) => (cb.checked = selectAll.checked))
  }
}

function exportVulnerabilitiesReport() {
  const csvContent = [
    [
      "Asset",
      "IP Address",
      "CVE ID",
      "Severity",
      "Title",
      "CVSS",
      "Source",
      "Status",
      "EPSS",
      "Exploit",
      "Assets Affected",
      "MITRE Tactic",
      "Priority Score",
    ],
    ...filteredVulnerability.map((vuln) => [
      vuln.assetName,
      vuln.ipAddress,
      vuln.cve,
      vuln.severity,
      vuln.vulnerability,
      vuln.cvssScore,
      vuln.source,
      vuln.status,
      vuln.epssScore,
      vuln.exploitAvailable ? "Yes" : "No",
      vuln.affectedAssets,
      vuln.mitreTactic,
      vuln.priorityScore,
    ]),
  ]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `vulnerability_report_${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)

  alert(`Exported ${filteredVulnerability.length} vulnerabilities to CSV file.`)
}

function bulkActions() {
  const selectedCheckboxes = document.querySelectorAll(".vuln-checkbox:checked")
  if (selectedCheckboxes.length === 0) {
    alert("Please select vulnerabilities to perform bulk actions.")
    return
  }

  const action = prompt(
    `Selected ${selectedCheckboxes.length} vulnerabilities. Choose action:\n1. Mark as Resolved\n2. Mark as False Positive\n3. Assign to Team\n4. Change Priority\n\nEnter number (1-4):`,
  )

  if (action) {
    alert(`Bulk action ${action} applied to ${selectedCheckboxes.length} vulnerabilities.`)
  }
}

// MODIFIED: Only clear AI search if not triggered by AI search itself
function applyAdvancedFilters() {
  // Only clear AI search if user manually changes traditional filters
  // Check if this was triggered by user interaction vs AI search
  if (isAISearchActive && event && event.target && !event.target.closest('.ai-search-container')) {
    clearAISearch()
  }
  currentPage = 1
  fetchVulnerability(currentPage)
}

function markFixed(id) {
  const vuln = vulnerability.find((v) => v.id === id)
  if (vuln) {
    vuln.status = "Resolved"
    displayVulnerability(filteredVulnerability)
    alert(`Vulnerability ${vuln.cve} marked as Resolved.`)
  }
}

function assignVulnerability(id) {
  const assignee = prompt("Assign to team member:")
  if (assignee) {
    alert(`Vulnerability assigned to ${assignee}.`)
  }
}

function showCVEDetails(cve) {
  alert(`Showing details for ${cve}\n\nThis would typically open a detailed view or external CVE database information.`)
}

function refreshVulnerabilities() {
  if (isAISearchActive) {
    clearAISearch()
  }
  fetchVulnerability(currentPage)
}

function toggleTableView() {
  alert("Toggle between table and card view (feature coming soon)")
}

// Initialize sidebar functionality
function initializeSidebar() {
  const sidebar = document.getElementById("sidebar")
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebarHamburger = document.getElementById("sidebarHamburger")
  const mainContent = document.getElementById("mainContent")
  const topHeader = document.getElementById("topHeader")

  function toggleSidebar() {
    if (!sidebar) return

    const isCollapsed = sidebar.classList.contains("w-16")

    if (isCollapsed) {
      sidebar.classList.remove("w-16")
      sidebar.classList.add("w-56")
      if (mainContent) {
        mainContent.classList.remove("ml-16")
        mainContent.classList.add("ml-56")
      }
      if (topHeader) {
        topHeader.classList.remove("left-16")
        topHeader.classList.add("left-56")
      }
    } else {
      sidebar.classList.remove("w-56")
      sidebar.classList.add("w-16")
      if (mainContent) {
        mainContent.classList.remove("ml-56")
        mainContent.classList.add("ml-16")
      }
      if (topHeader) {
        topHeader.classList.remove("left-56")
        topHeader.classList.add("left-16")
      }
    }

    document.querySelectorAll(".sidebar-label").forEach((el) => el.classList.toggle("hidden"))
    const sidebarLogo = document.querySelector(".sidebar-logo")
    if (sidebarLogo) sidebarLogo.classList.toggle("hidden")

    // Store the state in localStorage
    localStorage.setItem("sidebar-collapsed", !isCollapsed)
  }

  // Check localStorage for sidebar state on load
  const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true"
  if (isCollapsed && sidebar) {
    sidebar.classList.add("w-16")
    sidebar.classList.remove("w-56")
    if (mainContent) {
      mainContent.classList.add("ml-16")
      mainContent.classList.remove("ml-56")
    }
    if (topHeader) {
      topHeader.classList.add("left-16")
      topHeader.classList.remove("left-56")
    }
    document.querySelectorAll(".sidebar-label").forEach((el) => el.classList.add("hidden"))
    const sidebarLogo = document.querySelector(".sidebar-logo")
    if (sidebarLogo) sidebarLogo.classList.add("hidden")
  }

  if (sidebarToggle) sidebarToggle.onclick = toggleSidebar
  if (sidebarHamburger) sidebarHamburger.onclick = toggleSidebar

  // Mobile sidebar toggle
  if (sidebarHamburger) {
    sidebarHamburger.onclick = () => {
      if (sidebar) sidebar.classList.toggle("mobile-open")
    }
  }
}