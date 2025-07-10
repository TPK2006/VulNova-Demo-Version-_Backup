// Initialize Lucide icons when available
function safeCreateIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons()
  }
}

// Sidebar toggle logic
const sidebar = document.getElementById("sidebar")
const sidebarToggle = document.getElementById("sidebarToggle")
const sidebarHamburger = document.getElementById("sidebarHamburger")

function toggleSidebar() {
  const isCollapsed = sidebar.classList.contains("w-16")

  sidebar.classList.toggle("w-56")
  sidebar.classList.toggle("w-16")
  document.getElementById("mainContent").classList.toggle("ml-56")
  document.getElementById("mainContent").classList.toggle("ml-16")
  document.getElementById("topHeader").classList.toggle("left-56")
  document.getElementById("topHeader").classList.toggle("left-16")
  document.querySelectorAll(".sidebar-label").forEach((el) => el.classList.toggle("hidden"))
}

if (sidebarToggle) sidebarToggle.onclick = toggleSidebar
if (sidebarHamburger) sidebarHamburger.onclick = toggleSidebar

// Check localStorage for sidebar state on load
document.addEventListener("DOMContentLoaded", () => {
  const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true"
  if (isCollapsed) {
    sidebar.classList.add("w-16")
    document.getElementById("mainContent").classList.add("ml-16")
    document.getElementById("topHeader").classList.add("left-16")
    document.querySelectorAll(".sidebar-label").forEach((el) => el.classList.add("hidden"))
  }

  // Initialize icons with delay
  setTimeout(() => {
    safeCreateIcons()
  }, 100)
})

// Color mapping for risk levels
const riskColors = {
  Critical: "bg-red-100 text-red-800",
  High: "bg-orange-100 text-orange-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Low: "bg-green-100 text-green-800",
}

const statusColors = {
  Online: "bg-green-100 text-green-800",
  Offline: "bg-red-100 text-red-800",
}

let currentPage = 1
let currentFilters = {}
let totalAssets = 0
let isAISearchActive = false

// AI Search Functions
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
    const filters = parseAssetQueryWithAILogic(query)

    // Apply the filters to the filter dropdowns
    applyFiltersToUI(filters)

    // Show the advanced filters section
    showAdvancedFilters()

    // Update status
    statusText.textContent = `AI interpreted your query and updated the filters`
    isAISearchActive = true

    // Apply the filters to actually filter the data
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

function parseAssetQueryWithAILogic(query) {
  const filters = {}
  const lowerQuery = query.toLowerCase()

  // Parse risk levels
  if (lowerQuery.includes("critical")) {
    filters.riskLevel = "Critical"
  } else if (lowerQuery.includes("high risk")) {
    filters.riskLevel = "High"
  } else if (lowerQuery.includes("medium risk")) {
    filters.riskLevel = "Medium"
  } else if (lowerQuery.includes("low risk")) {
    filters.riskLevel = "Low"
  }

  // Parse operating systems
  if (lowerQuery.includes("windows")) {
    filters.os = "Windows"
  } else if (lowerQuery.includes("linux")) {
    filters.os = "Linux"
  } else if (lowerQuery.includes("macos") || lowerQuery.includes("mac")) {
    filters.os = "macOS"
  } else if (lowerQuery.includes("android")) {
    filters.os = "Android"
  }

  // Parse asset categories
  if (lowerQuery.includes("server")) {
    filters.category = "Server"
  } else if (lowerQuery.includes("workstation")) {
    filters.category = "Workstation"
  } else if (lowerQuery.includes("mobile")) {
    filters.category = "Mobile"
  } else if (lowerQuery.includes("network")) {
    filters.category = "Network"
  } else if (lowerQuery.includes("iot")) {
    filters.category = "IoT"
  }

  // Parse status
  if (lowerQuery.includes("offline")) {
    filters.status = "Offline"
  } else if (lowerQuery.includes("online")) {
    filters.status = "Online"
  }

  // Parse vulnerability levels
  if (lowerQuery.includes("critical vulnerabilities") || lowerQuery.includes("critical vulns")) {
    filters.vulnFilter = "critical"
  } else if (lowerQuery.includes("high vulnerabilities") || lowerQuery.includes("high vulns")) {
    filters.vulnFilter = "high"
  } else if (lowerQuery.includes("no vulnerabilities") || lowerQuery.includes("clean assets")) {
    filters.vulnFilter = "none"
  }

  // Parse date ranges
  if (lowerQuery.includes("last week") || lowerQuery.includes("recent")) {
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)
    filters.lastSeenAfter = lastWeek.toISOString().split("T")[0]
  } else if (lowerQuery.includes("last month")) {
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    filters.lastSeenAfter = lastMonth.toISOString().split("T")[0]
  }

  // Parse general search terms for names/IPs
  const ipMatch = query.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/)
  if (ipMatch) {
    filters.search = ipMatch[0]
  } else if (lowerQuery.includes("web") || lowerQuery.includes("db") || lowerQuery.includes("app")) {
    filters.search = query
      .split(" ")
      .find(
        (word) =>
          word.toLowerCase().includes("web") || word.toLowerCase().includes("db") || word.toLowerCase().includes("app"),
      )
  }

  return filters
}

function applyFiltersToUI(filters) {
  // Apply risk level filter
  if (filters.riskLevel) {
    const riskFilter = document.getElementById("riskFilter")
    if (riskFilter) {
      riskFilter.value = filters.riskLevel
    }
  }

  // Apply OS filter
  if (filters.os) {
    const osFilter = document.getElementById("osFilter")
    if (osFilter) {
      osFilter.value = filters.os
    }
  }

  // Apply category filter
  if (filters.category) {
    const categoryFilter = document.getElementById("categoryFilter")
    if (categoryFilter) {
      categoryFilter.value = filters.category
    }
  }

  // Apply status filter
  if (filters.status) {
    const statusFilter = document.getElementById("statusFilter")
    if (statusFilter) {
      statusFilter.value = filters.status
    }
  }

  // Apply vulnerability filter
  if (filters.vulnFilter) {
    const vulnFilter = document.getElementById("vulnFilter")
    if (vulnFilter) {
      vulnFilter.value = filters.vulnFilter
    }
  }

  // Apply last seen filter
  if (filters.lastSeenAfter) {
    const lastSeenFilter = document.getElementById("lastSeenFilter")
    if (lastSeenFilter) {
      lastSeenFilter.value = filters.lastSeenAfter
    }
  }

  // Apply search filter
  if (filters.search) {
    const searchInput = document.getElementById("searchAssets")
    if (searchInput) {
      searchInput.value = filters.search
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

function applyAdvancedFiltersFromAI() {
  currentPage = 1
  // Get the current filter values from the UI after AI has updated them
  const filters = getCurrentFiltersFromUI()
  displayAssets(currentPage, filters)
}

// Add this new function to get current filters from UI
function getCurrentFiltersFromUI() {
  const filters = {}

  const searchInput = document.getElementById("searchAssets")
  const categorySelect = document.getElementById("categoryFilter")
  const osSelect = document.getElementById("osFilter")
  const riskSelect = document.getElementById("riskFilter")
  const statusSelect = document.getElementById("statusFilter")
  const vulnSelect = document.getElementById("vulnFilter")
  const lastSeenInput = document.getElementById("lastSeenFilter")

  if (searchInput && searchInput.value) filters.search = searchInput.value
  if (categorySelect && categorySelect.value) filters.category = categorySelect.value
  if (osSelect && osSelect.value) filters.os = osSelect.value
  if (riskSelect && riskSelect.value) filters.riskLevel = riskSelect.value
  if (statusSelect && statusSelect.value) filters.status = statusSelect.value
  if (vulnSelect && vulnSelect.value) filters.vulnFilter = vulnSelect.value
  if (lastSeenInput && lastSeenInput.value) filters.lastSeenAfter = lastSeenInput.value

  return filters
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
  displayAssets(1, {})
}

function clearTraditionalFilters() {
  const filterInputs = [
    "searchAssets",
    "categoryFilter",
    "osFilter",
    "riskFilter",
    "statusFilter",
    "vulnFilter",
    "lastSeenFilter",
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

// Fetch assets from API
async function fetchAssets(page = 1, filters = {}) {
  try {
    const params = new URLSearchParams({
      page,
      limit: 50,
      ...filters,
    })

    const response = await fetch(`/api/asset?${params}`)
    if (!response.ok) throw new Error("Failed to fetch assets")

    return await response.json()
  } catch (error) {
    console.error("Error fetching assets:", error)
    return { assets: [], pagination: { total: 0 } }
  }
}

// Fetch asset summary from API
async function fetchAssetSummary() {
  try {
    const response = await fetch("/api/asset/summary")
    if (!response.ok) throw new Error("Failed to fetch asset summary")
    return await response.json()
  } catch (error) {
    console.error("Error fetching asset summary:", error)
    return {}
  }
}

// Display assets in the table
async function displayAssets(page = 1, filters = {}) {
  const tbody = document.getElementById("assetsTableBody")
  if (!tbody) return

  tbody.innerHTML = '<tr><td colspan="9" class="py-4 text-center">Loading assets...</td></tr>'

  const data = await fetchAssets(page, filters)
  const { assets, pagination } = data

  currentPage = page
  currentFilters = filters
  totalAssets = pagination.total

  if (assets.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="py-4 text-center">No assets found</td></tr>'
    return
  }

  tbody.innerHTML = assets
    .map((asset) => {
      // Ensure vulnerabilities object exists with default values
      const vulnerabilities = asset.vulnerabilities || {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      }

      return `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <input type="checkbox" class="asset-checkbox" value="${asset._id}">
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div>
            <div class="text-sm font-medium text-gray-900">${asset.name}</div>
            <div class="text-sm text-gray-500">${asset.hostname}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${asset.ipAddress}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${asset.category}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${asset.os}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${riskColors[asset.riskLevel]}">${asset.riskLevel}</span>
          <span class="ml-2 text-sm text-gray-900">${asset.riskScore}</span>
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex space-x-1">
          ${vulnerabilities.critical > 0 ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">${vulnerabilities.critical}C</span>` : ""}
          ${vulnerabilities.high > 0 ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">${vulnerabilities.high}H</span>` : ""}
          ${vulnerabilities.medium > 0 ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">${vulnerabilities.medium}M</span>` : ""}
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${new Date(asset.lastSeen).toLocaleString()}</div>
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[asset.status]}">${asset.status}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button class="text-primary-600 hover:text-primary-900" onclick="viewAsset('${asset._id}')">View</button>
          <button class="text-blue-600 hover:text-blue-900" onclick="scanAsset('${asset._id}')">Scan</button>
          <button class="text-gray-600 hover:text-gray-900" onclick="editAsset('${asset._id}')">Edit</button>
        </div>
      </td>
    </tr>
    `
    })
    .join("")

  updatePagination(pagination)
  updateCountDisplay(pagination)
  safeCreateIcons()
}

// Update pagination controls
function updatePagination(pagination) {
  const paginationContainer = document.querySelector(".relative.z-0.inline-flex")
  if (!paginationContainer) return

  const totalPages = Math.ceil(pagination.total / pagination.limit)

  let paginationHTML = `
    <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            ${currentPage === 1 ? "disabled" : ""}
            onclick="changePage(${currentPage - 1})">
      <i data-lucide="chevron-left" class="w-5 h-5"></i>
    </button>`

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      paginationHTML += `
        <button class="bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
          ${i}
        </button>`
    } else if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      paginationHTML += `
        <button class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                onclick="changePage(${i})">
          ${i}
        </button>`
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      paginationHTML += `
        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          ...
        </span>`
    }
  }

  paginationHTML += `
    <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            ${currentPage === totalPages ? "disabled" : ""}
            onclick="changePage(${currentPage + 1})">
      <i data-lucide="chevron-right" class="w-5 h-5"></i>
    </button>`

  paginationContainer.innerHTML = paginationHTML
}

// Change page
function changePage(page) {
  if (page < 1 || page > Math.ceil(totalAssets / 50)) return
  displayAssets(page, currentFilters)
}

// Update count display
function updateCountDisplay(pagination) {
  const showingCount = document.getElementById("showingAssetsCount")
  const totalCount = document.getElementById("totalAssetsCount")

  if (showingCount) {
    const start = (pagination.page - 1) * pagination.limit + 1
    const end = Math.min(start + pagination.limit - 1, pagination.total)
    showingCount.textContent = `${start}-${end}`
  }

  if (totalCount) {
    totalCount.textContent = pagination.total.toLocaleString()
  }
}

// Filter assets
async function filterAssets() {
  // Only clear AI search if user manually changes traditional filters
  if (isAISearchActive && !event.target.closest("#advancedFilters")) {
    clearAISearch()
  }

  const filters = getCurrentFiltersFromUI()
  await displayAssets(1, filters)
}

// Update summary cards
async function updateSummaryCards() {
  const summary = await fetchAssetSummary()

  if (!summary) return

  // Update total assets card
  const totalCard = document.querySelector(".grid-cols-4 > div:nth-child(1)")
  if (totalCard) {
    totalCard.querySelector("span").textContent = summary.totalAssets.toLocaleString()
  }

  // Update active assets card
  const activeCard = document.querySelector(".grid-cols-4 > div:nth-child(2)")
  if (activeCard) {
    activeCard.querySelector("span").textContent = summary.activeAssets.toLocaleString()
    const uptimePercent =
      summary.totalAssets > 0 ? Math.round((summary.activeAssets / summary.totalAssets) * 1000) / 10 : 0
    activeCard.querySelector("div:last-child").textContent = `${uptimePercent}% uptime`
  }

  // Update high risk assets card
  const highRiskCard = document.querySelector(".grid-cols-4 > div:nth-child(3)")
  if (highRiskCard) {
    highRiskCard.querySelector("span").textContent = summary.highRiskAssets.toLocaleString()
  }

  // Update unprotected assets card
  const unprotectedCard = document.querySelector(".grid-cols-4 > div:nth-child(4)")
  if (unprotectedCard) {
    unprotectedCard.querySelector("span").textContent = summary.unprotectedAssets.toLocaleString()
  }
}

// View asset details
async function viewAsset(id) {
  try {
    const response = await fetch(`/api/asset/${id}`)
    if (!response.ok) throw new Error("Failed to fetch asset")

    const asset = await response.json()
    const vulnerabilities = asset.vulnerabilities || {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    }

    alert(
      `Viewing details for ${asset.name}\n\n` +
        `IP: ${asset.ipAddress}\n` +
        `Hostname: ${asset.hostname}\n` +
        `Category: ${asset.category}\n` +
        `OS: ${asset.os}\n` +
        `Risk Score: ${asset.riskScore} (${asset.riskLevel})\n` +
        `Vulnerabilities: C${vulnerabilities.critical} H${vulnerabilities.high} M${vulnerabilities.medium}\n` +
        `Status: ${asset.status}\n` +
        `Location: ${asset.location}\n` +
        `Owner: ${asset.owner}\n` +
        `EDR Installed: ${asset.edrInstalled ? "Yes" : "No"}\n` +
        `Last Seen: ${new Date(asset.lastSeen).toLocaleString()}`,
    )
  } catch (error) {
    console.error("Error viewing asset:", error)
    alert("Failed to load asset details")
  }
}

// Scan asset
async function scanAsset(id) {
  try {
    const response = await fetch(`/api/asset/${id}/scan`, {
      method: "POST",
    })

    if (!response.ok) throw new Error("Failed to scan asset")

    const result = await response.json()
    alert(
      `Scan completed for asset\n\n` +
        `New Risk Score: ${result.scanResults.riskScore}\n` +
        `New Risk Level: ${result.scanResults.riskLevel}\n` +
        `Vulnerabilities Found:\n` +
        `- Critical: ${result.scanResults.vulnerabilities.critical}\n` +
        `- High: ${result.scanResults.vulnerabilities.high}\n` +
        `- Medium: ${result.scanResults.vulnerabilities.medium}`,
    )

    // Refresh the asset list
    displayAssets(currentPage, currentFilters)
  } catch (error) {
    console.error("Error scanning asset:", error)
    alert("Failed to scan asset")
  }
}

// Edit asset
async function editAsset(id) {
  try {
    const response = await fetch(`/api/asset/${id}`)
    if (!response.ok) throw new Error("Failed to fetch asset")

    const asset = await response.json()

    // In a real implementation, this would open a modal with a form
    const newOwner = prompt("Enter new owner:", asset.owner)
    if (newOwner === null) return

    const updateResponse = await fetch(`/api/asset/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ owner: newOwner }),
    })

    if (!updateResponse.ok) throw new Error("Failed to update asset")

    alert("Asset updated successfully")
    displayAssets(currentPage, currentFilters)
  } catch (error) {
    console.error("Error editing asset:", error)
    alert("Failed to edit asset")
  }
}

// Add new asset
async function addAsset() {
  // In a real implementation, this would open a modal with a form
  const name = prompt("Enter asset name:")
  if (!name) return

  const ipAddress = prompt("Enter IP address:")
  if (!ipAddress) return

  const hostname = prompt("Enter hostname:")
  if (!hostname) return

  const category = prompt("Enter category (Server/Workstation/Mobile/Network/IoT):")
  if (!category) return

  const os = prompt("Enter operating system:")
  if (!os) return

  try {
    const response = await fetch("/api/asset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, ipAddress, hostname, category, os }),
    })

    if (!response.ok) throw new Error("Failed to create asset")

    const result = await response.json()
    alert(`Asset created successfully with ID: ${result.id}`)
    displayAssets(currentPage, currentFilters)
  } catch (error) {
    console.error("Error adding asset:", error)
    alert("Failed to create asset")
  }
}

// Scan selected assets
async function scanAssets() {
  const selected = Array.from(document.querySelectorAll(".asset-checkbox:checked")).map((checkbox) => checkbox.value)

  if (selected.length === 0) {
    alert("Please select at least one asset to scan")
    return
  }

  if (!confirm(`Scan ${selected.length} selected assets?`)) return

  try {
    // In a real implementation, you might batch these or use a different endpoint
    for (const id of selected) {
      await fetch(`/api/asset/${id}/scan`, {
        method: "POST",
      })
    }

    alert(`Scan initiated for ${selected.length} assets`)
    displayAssets(currentPage, currentFilters)
  } catch (error) {
    console.error("Error scanning assets:", error)
    alert("Failed to scan some assets")
  }
}

// Export assets to CSV
async function exportAssets() {
  try {
    const response = await fetch("/api/assets?limit=1000")
    if (!response.ok) throw new Error("Failed to fetch assets for export")

    const data = await response.json()
    const assets = data.assets

    const csvContent = [
      [
        "Asset Name",
        "IP Address",
        "Hostname",
        "Category",
        "OS",
        "Risk Score",
        "Risk Level",
        "Critical Vulns",
        "High Vulns",
        "Medium Vulns",
        "Low Vulns",
        "Status",
        "Location",
        "Owner",
        "EDR Installed",
        "Last Seen",
      ],
      ...assets.map((asset) => {
        const vulnerabilities = asset.vulnerabilities || {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        }

        return [
          asset.name,
          asset.ipAddress,
          asset.hostname,
          asset.category,
          asset.os,
          asset.riskScore,
          asset.riskLevel,
          vulnerabilities.critical,
          vulnerabilities.high,
          vulnerabilities.medium,
          vulnerabilities.low,
          asset.status,
          asset.location,
          asset.owner,
          asset.edrInstalled ? "Yes" : "No",
          new Date(asset.lastSeen).toLocaleString(),
        ]
      }),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `assets_export_${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error exporting assets:", error)
    alert("Failed to export assets")
  }
}

// Refresh assets
function refreshAssets() {
  if (isAISearchActive) {
    clearAISearch()
  }
  displayAssets(currentPage, currentFilters)
  updateSummaryCards()
}

// Toggle select all assets
function toggleSelectAllAssets() {
  const selectAll = document.getElementById("selectAllAssets")
  const checkboxes = document.querySelectorAll(".asset-checkbox")
  checkboxes.forEach((cb) => (cb.checked = selectAll.checked))
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  await displayAssets()
  await updateSummaryCards()

  // Check for hash in URL to highlight specific assets
  const hash = window.location.hash.substring(1)
  if (hash) {
    const searchInput = document.getElementById("searchAssets")
    if (searchInput) {
      searchInput.value = hash
      filterAssets()
    }
  }
})
