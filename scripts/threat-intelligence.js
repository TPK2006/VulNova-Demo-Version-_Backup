// Initialize Lucide icons
lucide.createIcons();

// Sidebar toggle logic
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarHamburger = document.getElementById('sidebarHamburger');

function toggleSidebar() {
  sidebar.classList.toggle('sidebar-expanded');
  sidebar.classList.toggle('sidebar-collapsed');
  document.querySelectorAll('.sidebar-label').forEach(el => el.classList.toggle('hidden'));
}

if (sidebarToggle) sidebarToggle.onclick = toggleSidebar;
if (sidebarHamburger) sidebarHamburger.onclick = toggleSidebar;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  loadThreatIntelligence();
  setInterval(loadThreatIntelligence, 30000); // Refresh every 30 seconds
});

// Load all threat intelligence data
async function loadThreatIntelligence() {
  try {
    await Promise.all([
      loadThreatStats(),
      loadRecentThreats(),
      loadCVEAlerts(),
      loadThreatActors(),
      loadIOCs()
    ]);
  } catch (error) {
    console.error('Error loading threat intelligence:', error);
  }
}

// Load threat stats
async function loadThreatStats() {
  try {
    const response = await fetch('/api/threat-intelligence/stats');
    if (!response.ok) throw new Error('Failed to fetch threat stats');
    const stats = await response.json();
    
    document.getElementById('threatLevel').textContent = stats.threat_level;
    document.getElementById('iocsTracked').textContent = stats.iocs_tracked;
    document.getElementById('newIOCs').textContent = `+${stats.new_iocs} new IOCs`;
    document.getElementById('activeFeeds').textContent = stats.active_feeds;
    document.getElementById('blockedThreats').textContent = stats.blocked_threats;
    document.getElementById('blockSuccessRate').textContent = `${stats.block_success_rate}% success rate`;
    
    // Update threat level card color
    const threatLevelCard = document.querySelector('.threat-level-card');
    if (threatLevelCard) {
      threatLevelCard.className = `threat-level-card bg-${stats.threat_level.toLowerCase()}-50 rounded-xl p-6 border border-${stats.threat_level.toLowerCase()}-200`;
      threatLevelCard.querySelector('i').className = `w-8 h-8 text-${stats.threat_level.toLowerCase()}-600`;
      threatLevelCard.querySelector('span').className = `text-2xl font-bold text-${stats.threat_level.toLowerCase()}-600`;
    }
  } catch (error) {
    console.error('Error loading threat stats:', error);
  }
}

// Load recent threats
async function loadRecentThreats() {
  try {
    const response = await fetch('/api/threat-intelligence/recent');
    if (!response.ok) throw new Error('Failed to fetch recent threats');
    const threats = await response.json();
    displayRecentThreats(threats);
  } catch (error) {
    console.error('Error loading recent threats:', error);
  }
}

// Load CVE alerts
async function loadCVEAlerts() {
  try {
    const response = await fetch('/api/threat-intelligence/cves');
    if (!response.ok) throw new Error('Failed to fetch CVE alerts');
    const cves = await response.json();
    displayCVEAlerts(cves);
  } catch (error) {
    console.error('Error loading CVE alerts:', error);
  }
}

// Load threat actors
async function loadThreatActors() {
  try {
    const response = await fetch('/api/threat-intelligence/actors');
    if (!response.ok) throw new Error('Failed to fetch threat actors');
    const actors = await response.json();
    displayThreatActors(actors);
  } catch (error) {
    console.error('Error loading threat actors:', error);
  }
}

// Load IOCs
async function loadIOCs() {
  try {
    const response = await fetch('/api/threat-intelligence/iocs');
    if (!response.ok) throw new Error('Failed to fetch IOCs');
    const iocs = await response.json();
    displayIOCs(iocs);
  } catch (error) {
    console.error('Error loading IOCs:', error);
  }
}

// Display recent threats
function displayRecentThreats(threats) {
  const container = document.getElementById('recentThreats');
  if (!container) return;

  const severityColors = {
    'Critical': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  container.innerHTML = threats.map(threat => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="viewThreatDetails('${threat._id}')">
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-semibold text-gray-900 text-sm">${threat.title}</h3>
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[threat.severity]}">${threat.severity}</span>
      </div>
      <p class="text-sm text-gray-600 mb-3">${threat.description}</p>
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>${threat.source}</span>
        <div class="flex items-center space-x-4">
          <span>Affected: ${threat.affected_assets} assets</span>
          <span>${new Date(threat.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Display CVE alerts
function displayCVEAlerts(cves) {
  const container = document.getElementById('cveAlerts');
  if (!container) return;

  const severityColors = {
    'Critical': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  container.innerHTML = cves.map(cve => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="viewCVEDetails('${cve.cve}')">
      <div class="flex items-start justify-between mb-2">
        <div>
          <h3 class="font-semibold text-gray-900 text-sm">${cve.cve}</h3>
          <p class="text-sm text-gray-600">${cve.title}</p>
        </div>
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[cve.severity]}">${cve.severity}</span>
      </div>
      <div class="flex items-center justify-between text-xs text-gray-500 mt-3">
        <span>CVSS: ${cve.cvss_score}</span>
        <div class="flex items-center space-x-4">
          <span>Affected: ${cve.affected_assets} assets</span>
          <span>${new Date(cve.published).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Display threat actors
function displayThreatActors(actors) {
  const container = document.getElementById('threatActors');
  if (!container) return;

  const threatLevelColors = {
    'Critical': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  container.innerHTML = actors.map(actor => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="viewThreatActorProfile('${actor._id}')">
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-semibold text-gray-900">${actor.name}</h3>
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${threatLevelColors[actor.threat_level]}">${actor.threat_level}</span>
      </div>
      <div class="space-y-2 text-sm text-gray-600">
        <div><strong>Origin:</strong> ${actor.origin}</div>
        <div><strong>Targets:</strong> ${actor.targets}</div>
        <div><strong>Last Activity:</strong> ${new Date(actor.last_activity).toLocaleDateString()}</div>
      </div>
      <div class="mt-3">
        <div class="text-xs text-gray-500 mb-1">Common Techniques:</div>
        <div class="flex flex-wrap gap-1">
          ${actor.techniques.map(technique => `<span class="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">${technique}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

// Display IOCs
function displayIOCs(iocs) {
  const tbody = document.getElementById('iocTableBody');
  if (!tbody) return;

  const severityColors = {
    'Critical': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  const typeColors = {
    'IP': 'bg-blue-100 text-blue-800',
    'Domain': 'bg-green-100 text-green-800',
    'Hash': 'bg-purple-100 text-purple-800',
    'URL': 'bg-orange-100 text-orange-800'
  };

  tbody.innerHTML = iocs.map(ioc => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${ioc.value.length > 30 ? ioc.value.substring(0, 30) + '...' : ioc.value}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[ioc.type]}">${ioc.type}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${ioc.threat}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[ioc.severity]}">${ioc.severity}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${new Date(ioc.first_seen).toLocaleString()}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${ioc.source}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button class="text-primary-600 hover:text-primary-900" onclick="blockIOC('${ioc._id}')">${ioc.blocked ? 'Blocked' : 'Block'}</button>
          <button class="text-blue-600 hover:text-blue-900" onclick="investigateIOC('${ioc._id}')">Investigate</button>
          <button class="text-gray-600 hover:text-gray-900" onclick="addToWatchlist('${ioc._id}')">Watch</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Filter IOCs
async function filterIOCs() {
  const searchInput = document.getElementById('searchIOCs');
  const typeSelect = document.getElementById('iocTypeFilter');
  const severitySelect = document.getElementById('iocSeverityFilter');
  
  if (!searchInput || !typeSelect || !severitySelect) return;
  
  const searchTerm = searchInput.value;
  const typeFilter = typeSelect.value;
  const severityFilter = severitySelect.value;
  
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (typeFilter) params.append('type', typeFilter);
    if (severityFilter) params.append('severity', severityFilter);
    
    const response = await fetch(`/api/threat-intelligence/iocs?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to filter IOCs');
    const iocs = await response.json();
    
    displayIOCs(iocs);
  } catch (error) {
    console.error('Error filtering IOCs:', error);
  }
}

// Block an IOC
async function blockIOC(id) {
  try {
    const response = await fetch(`/api/threat-intelligence/iocs/${id}/block`, {
      method: 'POST'
    });
    
    if (!response.ok) throw new Error('Failed to block IOC');
    const result = await response.json();
    
    if (result.success) {
      alert('IOC blocked successfully');
      loadIOCs(); // Refresh the IOCs list
    }
  } catch (error) {
    console.error('Error blocking IOC:', error);
    alert('Failed to block IOC');
  }
}

// View threat details
async function viewThreatDetails(id) {
  try {
    const response = await fetch(`/api/threat-intelligence/recent/${id}`);
    if (!response.ok) throw new Error('Failed to fetch threat details');
    const threat = await response.json();
    
    alert(`Threat Details: ${threat.title}\n\n${threat.description}\n\nSeverity: ${threat.severity}\nAffected Assets: ${threat.affected_assets}\nSource: ${threat.source}\nTimestamp: ${new Date(threat.timestamp).toLocaleString()}`);
  } catch (error) {
    console.error('Error viewing threat details:', error);
    alert('Failed to load threat details');
  }
}

// View CVE details
async function viewCVEDetails(cve) {
  try {
    const response = await fetch(`/api/threat-intelligence/cves/${cve}`);
    if (!response.ok) throw new Error('Failed to fetch CVE details');
    const cveData = await response.json();
    
    alert(`CVE Details: ${cveData.cve}\n\n${cveData.title}\n\nCVSS Score: ${cveData.cvss_score}\nSeverity: ${cveData.severity}\nAffected Assets: ${cveData.affected_assets}\nPublished: ${new Date(cveData.published).toLocaleString()}`);
  } catch (error) {
    console.error('Error viewing CVE details:', error);
    alert('Failed to load CVE details');
  }
}

// View threat actor profile
async function viewThreatActorProfile(id) {
  try {
    const response = await fetch(`/api/threat-intelligence/actors/${id}`);
    if (!response.ok) throw new Error('Failed to fetch threat actor profile');
    const actor = await response.json();
    
    alert(`Threat Actor Profile: ${actor.name}\n\nOrigin: ${actor.origin}\nTargets: ${actor.targets}\nThreat Level: ${actor.threat_level}\nLast Activity: ${new Date(actor.last_activity).toLocaleDateString()}\n\nCommon Techniques:\n${actor.techniques.join(', ')}`);
  } catch (error) {
    console.error('Error viewing threat actor profile:', error);
    alert('Failed to load threat actor profile');
  }
}

// Investigate IOC
async function investigateIOC(id) {
  try {
    const response = await fetch(`/api/threat-intelligence/iocs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch IOC details');
    const ioc = await response.json();
    
    alert(`Investigating IOC: ${ioc.value}\n\nLaunching investigation workflow:\n• Check internal logs\n• Query threat intelligence\n• Analyze related indicators\n• Generate investigation report`);
  } catch (error) {
    console.error('Error investigating IOC:', error);
    alert('Failed to investigate IOC');
  }
}

// Add to watchlist
async function addToWatchlist(id) {
  try {
    const response = await fetch(`/api/threat-intelligence/iocs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch IOC details');
    const ioc = await response.json();
    
    alert(`Added to watchlist: ${ioc.value}\n\nThis IOC will be monitored for future activity and you'll receive alerts if detected.`);
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    alert('Failed to add to watchlist');
  }
}

// Configure threat feeds
function configureFeed() {
  alert('Configure Threat Intelligence Feeds\n\nManage your threat intelligence sources:\n• Commercial feeds\n• Open source feeds\n• Custom feeds\n• API integrations');
}

// Export intelligence
function exportIntelligence() {
  alert('Export Threat Intelligence\n\nChoose export format:\n• STIX/TAXII\n• JSON\n• CSV\n• XML');
}

// View all threats
function viewAllThreats() {
  window.location.href = '/threats.html';
}

// View all CVEs
function viewAllCVEs() {
  window.location.href = '/cves.html';
}

// View threat actor database
function viewThreatActorDatabase() {
  window.location.href = '/threat-actors.html';
}