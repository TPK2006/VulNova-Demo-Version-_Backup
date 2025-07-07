// Lucide icons are already loaded via CDN in the HTML file
// No import needed - lucide is available globally
const lucide = window.lucide // Declare the lucide variable

// Initialize Lucide icons
lucide.createIcons()

// API base URL - automatically detects current host
const API_BASE_URL = `${window.location.protocol}//${window.location.host}/api`

// Fetch and display dashboard data
async function loadDashboardData() {
  try {
    // Load dashboard summary
    const summaryResponse = await fetch(`${API_BASE_URL}/dashboard-summary`)
    const summaryData = await summaryResponse.json()

    // Update risk score
    document.getElementById("risk-score-text").textContent = summaryData.riskScore
    document.getElementById("risk-status").textContent = summaryData.riskStatus

    // Update risk status color
    const riskStatusElement = document.getElementById("risk-status")
    const riskScoreTextElement = document.getElementById("risk-score-text")

    if (summaryData.riskScore > 700) {
      riskStatusElement.className = "text-lg font-semibold text-red-600 mt-1 mb-1"
      riskScoreTextElement.style.color = "#ef4444"
    } else if (summaryData.riskScore > 300) {
      riskStatusElement.className = "text-lg font-semibold text-yellow-600 mt-1 mb-1"
      riskScoreTextElement.style.color = "#eab308"
    } else {
      riskStatusElement.className = "text-lg font-semibold text-green-600 mt-1 mb-1"
      riskScoreTextElement.style.color = "#22c55e"
    }

    // Update vulnerability counts
    const vulnCounts = summaryData.vulnerabilities
    document.querySelector(".bg-red-50 .text-lg").textContent = vulnCounts.critical
    document.querySelector(".bg-orange-50 .text-lg").textContent = vulnCounts.high
    document.querySelector(".bg-yellow-50 .text-lg").textContent = vulnCounts.medium
    document.querySelector(".bg-green-50 .text-lg").textContent = vulnCounts.low

    // Load riskiest assets
    const assetsResponse = await fetch(`${API_BASE_URL}/riskiest-assets`)
    const assetsData = await assetsResponse.json()

    document.getElementById("riskiest-assets-tbody").innerHTML = assetsData
      .map(
        (asset) =>
          `<tr class='hover:bg-primary-50 cursor-pointer' onclick="window.location.href='assets.html#${asset.name}'">
        <td class='py-1 px-3 border-b'>${asset.name}</td>
        <td class='py-1 px-3 border-b'>${asset.riskScore}</td>
        <td class='py-1 px-3 border-b'>${asset.criticalVulns}</td>
        <td class='py-1 px-3 border-b'>${asset.lastSeen}</td>
      </tr>`,
      )
      .join("")

    // Load threat intelligence
    const threatResponse = await fetch(`${API_BASE_URL}/threat-intelligence`)
    const threatData = await threatResponse.json()

    document.getElementById("threat-news-list").innerHTML = threatData
      .map(
        (threat) =>
          `<li class='bg-primary-50 rounded p-3 flex flex-col cursor-pointer hover:bg-primary-100 transition-colors' onclick="window.location.href='threat-intelligence.html#${threat._id}'">
        <span class='font-semibold text-primary-800'>${threat.headline}</span>
        <span class='text-sm text-gray-600'>Affected assets: <span class='font-bold text-primary-700'>${threat.affectedAssets}</span></span>
        <span class='text-xs text-primary-600 mt-1'>Read more →</span>
      </li>`,
      )
      .join("")

    // Load assets missing EDR
    const edrResponse = await fetch(`${API_BASE_URL}/assets-missing-edr`)
    const edrData = await edrResponse.json()

    document.getElementById("missing-edr-count").textContent = edrData.count
    document.getElementById("missing-edr-list").innerHTML = edrData.assets
      .slice(0, 5)
      .map((asset) => `<li>${asset}</li>`)
      .join("")

    // Load assets not scanned
    const scanResponse = await fetch(`${API_BASE_URL}/assets-not-scanned`)
    const scanData = await scanResponse.json()

    document.getElementById("not-scanned-count").textContent = scanData.count
    document.getElementById("not-scanned-list").innerHTML = scanData.assets
      .slice(0, 5)
      .map((asset) => `<li>${asset}</li>`)
      .join("")
  } catch (error) {
    console.error("Error loading dashboard data:", error)
    // Fallback to show error message or default values
    document.getElementById("risk-score-text").textContent = "Error"
    document.getElementById("risk-status").textContent = "Unable to load data"
  }
}

// Initialize dashboard when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadDashboardData()
})

// Refresh data every 5 minutes
setInterval(loadDashboardData, 5 * 60 * 1000)