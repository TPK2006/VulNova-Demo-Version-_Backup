document.addEventListener('DOMContentLoaded', function() {
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
  displayRecentThreats();
  displayCVEAlerts();
  displayThreatActors();
  displayIOCs();
});

// Sample threat intelligence data
const recentThreats = [
  {
    id: 1,
    title: 'New Ransomware Campaign Targets Healthcare',
    description: 'BlackCat ransomware group launching targeted attacks against healthcare organizations',
    severity: 'Critical',
    affectedAssets: 14,
    timestamp: '2024-07-04 15:30',
    source: 'CISA Alert'
  },
  {
    id: 2,
    title: 'Zero-Day in Major Firewall Detected',
    description: 'Critical vulnerability in FortiGate firewalls being actively exploited',
    severity: 'Critical',
    affectedAssets: 7,
    timestamp: '2024-07-04 12:45',
    source: 'Fortinet Advisory'
  },
  {
    id: 3,
    title: 'Phishing Campaign Using AI-Generated Content',
    description: 'Sophisticated phishing emails using deepfake technology to impersonate executives',
    severity: 'High',
    affectedAssets: 0,
    timestamp: '2024-07-04 09:20',
    source: 'Threat Intel Feed'
  },
  {
    id: 4,
    title: 'Supply Chain Attack on Software Library',
    description: 'Malicious code injected into popular JavaScript library affecting thousands of applications',
    severity: 'High',
    affectedAssets: 3,
    timestamp: '2024-07-03 16:15',
    source: 'GitHub Security'
  }
];

const cveAlerts = [
  {
    id: 1,
    cve: 'CVE-2024-3400',
    title: 'PAN-OS Command Injection Vulnerability',
    cvssScore: 10.0,
    severity: 'Critical',
    affectedAssets: 22,
    published: '2024-07-04 14:00'
  },
  {
    id: 2,
    cve: 'CVE-2024-4577',
    title: 'PHP CGI Argument Injection Vulnerability',
    cvssScore: 9.8,
    severity: 'Critical',
    affectedAssets: 8,
    published: '2024-07-03 11:30'
  },
  {
    id: 3,
    cve: 'CVE-2024-5910',
    title: 'Windows MSHTML Platform Spoofing Vulnerability',
    cvssScore: 8.8,
    severity: 'High',
    affectedAssets: 156,
    published: '2024-07-02 16:45'
  },
  {
    id: 4,
    cve: 'CVE-2024-6387',
    title: 'OpenSSH Remote Code Execution',
    cvssScore: 8.1,
    severity: 'High',
    affectedAssets: 45,
    published: '2024-07-01 09:20'
  }
];

const threatActors = [
  {
    id: 1,
    name: 'APT29 (Cozy Bear)',
    origin: 'Russia',
    targets: 'Government, Healthcare',
    lastActivity: '2024-07-02',
    threatLevel: 'Critical',
    techniques: ['Spear Phishing', 'Supply Chain', 'Living off the Land']
  },
  {
    id: 2,
    name: 'Lazarus Group',
    origin: 'North Korea',
    targets: 'Financial, Cryptocurrency',
    lastActivity: '2024-06-28',
    threatLevel: 'High',
    techniques: ['Social Engineering', 'Custom Malware', 'Cryptocurrency Theft']
  },
  {
    id: 3,
    name: 'BlackCat (ALPHV)',
    origin: 'Unknown',
    targets: 'Healthcare, Manufacturing',
    lastActivity: '2024-07-04',
    threatLevel: 'Critical',
    techniques: ['Ransomware', 'Double Extortion', 'RaaS']
  }
];

const iocs = [
  {
    id: 1,
    value: '192.168.100.45',
    type: 'IP',
    threat: 'BlackCat C2 Server',
    severity: 'Critical',
    firstSeen: '2024-07-04 10:30',
    source: 'Internal Detection'
  },
  {
    id: 2,
    value: 'malicious-domain.com',
    type: 'Domain',
    threat: 'Phishing Campaign',
    severity: 'High',
    firstSeen: '2024-07-03 14:20',
    source: 'Threat Intel Feed'
  },
  {
    id: 3,
    value: 'a1b2c3d4e5f6789...',
    type: 'Hash',
    threat: 'Ransomware Payload',
    severity: 'Critical',
    firstSeen: '2024-07-02 09:15',
    source: 'VirusTotal'
  },
  {
    id: 4,
    value: 'http://evil-site.net/payload',
    type: 'URL',
    threat: 'Malware Download',
    severity: 'High',
    firstSeen: '2024-07-01 16:45',
    source: 'Web Filter'
  },
  {
    id: 5,
    value: '10.0.0.123',
    type: 'IP',
    threat: 'Botnet Communication',
    severity: 'Medium',
    firstSeen: '2024-06-30 11:30',
    source: 'Network Monitor'
  }
];

let filteredIOCs = [...iocs];

// Function to display recent threats
function displayRecentThreats() {
  const container = document.getElementById('recentThreats');
  if (!container) return;

  const severityColors = {
    'Critical': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  container.innerHTML = recentThreats.map(threat => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="viewThreatDetails(${threat.id})">
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-semibold text-gray-900 text-sm">${threat.title}</h3>
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[threat.severity]}">${threat.severity}</span>
      </div>
      <p class="text-sm text-gray-600 mb-3">${threat.description}</p>
      <div class="flex items-center justify-between text-xs text-gray-500">
        <span>${threat.source}</span>
        <div class="flex items-center space-x-4">
          <span>Affected: ${threat.affectedAssets} assets</span>
          <span>${threat.timestamp}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Function to display CVE alerts
function displayCVEAlerts() {
  const container = document.getElementById('cveAlerts');
  if (!container) return;

  const severityColors = {
    'Critical': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  container.innerHTML = cveAlerts.map(cve => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="viewCVEDetails('${cve.cve}')">
      <div class="flex items-start justify-between mb-2">
        <div>
          <h3 class="font-semibold text-gray-900 text-sm">${cve.cve}</h3>
          <p class="text-sm text-gray-600">${cve.title}</p>
        </div>
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[cve.severity]}">${cve.severity}</span>
      </div>
      <div class="flex items-center justify-between text-xs text-gray-500 mt-3">
        <span>CVSS: ${cve.cvssScore}</span>
        <div class="flex items-center space-x-4">
          <span>Affected: ${cve.affectedAssets} assets</span>
          <span>${cve.published}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Function to display threat actors
function displayThreatActors() {
  const container = document.getElementById('threatActors');
  if (!container) return;

  const threatLevelColors = {
    'Critical': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  container.innerHTML = threatActors.map(actor => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="viewThreatActorProfile(${actor.id})">
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-semibold text-gray-900">${actor.name}</h3>
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${threatLevelColors[actor.threatLevel]}">${actor.threatLevel}</span>
      </div>
      <div class="space-y-2 text-sm text-gray-600">
        <div><strong>Origin:</strong> ${actor.origin}</div>
        <div><strong>Targets:</strong> ${actor.targets}</div>
        <div><strong>Last Activity:</strong> ${actor.lastActivity}</div>
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

// Function to display IOCs
function displayIOCs(iocList = filteredIOCs) {
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

  tbody.innerHTML = iocList.map(ioc => `
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
        <div class="text-sm text-gray-900">${ioc.firstSeen}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${ioc.source}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button class="text-primary-600 hover:text-primary-900" onclick="blockIOC(${ioc.id})">Block</button>
          <button class="text-blue-600 hover:text-blue-900" onclick="investigateIOC(${ioc.id})">Investigate</button>
          <button class="text-gray-600 hover:text-gray-900" onclick="addToWatchlist(${ioc.id})">Watch</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Function to filter IOCs
function filterIOCs() {
  const searchInput = document.getElementById('searchIOCs');
  const typeSelect = document.getElementById('iocTypeFilter');
  
  if (!searchInput || !typeSelect) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const typeFilter = typeSelect.value;
  
  filteredIOCs = iocs.filter(ioc => {
    const matchesSearch = !searchTerm || 
      ioc.value.toLowerCase().includes(searchTerm) ||
      ioc.threat.toLowerCase().includes(searchTerm) ||
      ioc.source.toLowerCase().includes(searchTerm);
    
    const matchesType = !typeFilter || ioc.type === typeFilter;
    
    return matchesSearch && matchesType;
  });
  
  displayIOCs(filteredIOCs);
}

// Placeholder functions for actions
function configureFeed() {
  alert('Configure Threat Intelligence Feeds\n\nManage your threat intelligence sources:\n• Commercial feeds\n• Open source feeds\n• Custom feeds\n• API integrations');
}

function exportIntelligence() {
  alert('Export Threat Intelligence\n\nChoose export format:\n• STIX/TAXII\n• JSON\n• CSV\n• XML');
}

function viewAllThreats() {
  alert('Navigate to comprehensive threat intelligence dashboard');
}

function viewAllCVEs() {
  alert('Navigate to CVE database and vulnerability tracker');
}

function viewThreatActorDatabase() {
  alert('Navigate to threat actor profiles and attribution database');
}

function viewThreatDetails(id) {
  const threat = recentThreats.find(t => t.id === id);
  if (threat) {
    alert(`Threat Details: ${threat.title}\n\n${threat.description}\n\nSeverity: ${threat.severity}\nAffected Assets: ${threat.affectedAssets}\nSource: ${threat.source}\nTimestamp: ${threat.timestamp}`);
  }
}

function viewCVEDetails(cve) {
  const cveData = cveAlerts.find(c => c.cve === cve);
  if (cveData) {
    alert(`CVE Details: ${cveData.cve}\n\n${cveData.title}\n\nCVSS Score: ${cveData.cvssScore}\nSeverity: ${cveData.severity}\nAffected Assets: ${cveData.affectedAssets}\nPublished: ${cveData.published}`);
  }
}

function viewThreatActorProfile(id) {
  const actor = threatActors.find(a => a.id === id);
  if (actor) {
    alert(`Threat Actor Profile: ${actor.name}\n\nOrigin: ${actor.origin}\nTargets: ${actor.targets}\nThreat Level: ${actor.threatLevel}\nLast Activity: ${actor.lastActivity}\n\nCommon Techniques:\n${actor.techniques.join(', ')}`);
  }
}

function blockIOC(id) {
  const ioc = iocs.find(i => i.id === id);
  if (ioc) {
    alert(`Blocking IOC: ${ioc.value}\n\nThis IOC will be added to your security controls and blocked across all integrated systems.`);
  }
}

function investigateIOC(id) {
  const ioc = iocs.find(i => i.id === id);
  if (ioc) {
    alert(`Investigating IOC: ${ioc.value}\n\nLaunching investigation workflow:\n• Check internal logs\n• Query threat intelligence\n• Analyze related indicators\n• Generate investigation report`);
  }
}

function addToWatchlist(id) {
  const ioc = iocs.find(i => i.id === id);
  if (ioc) {
    alert(`Added to watchlist: ${ioc.value}\n\nThis IOC will be monitored for future activity and you'll receive alerts if detected.`);
  }
}