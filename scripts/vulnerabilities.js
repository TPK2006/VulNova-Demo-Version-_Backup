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

// Sample vulnerability data
const vulnerabilities = [
  {
    id: 1,
    assetName: 'Server-001',
    ipAddress: '192.168.1.100',
    vulnerability: 'Log4j Remote Code Execution',
    cve: 'CVE-2021-44228',
    severity: 'Critical',
    cvssScore: 10.0,
    status: 'Open',
    source: 'Orca Security',
    description: 'Apache Log4j2 contains a remote code execution vulnerability via the JNDI LDAP endpoint.',
    firstDetected: '2024-01-15',
    lastSeen: '2024-07-01',
    epssScore: 0.92,
    exploitAvailable: true,
    affectedAssets: 86,
    mitreTactic: 'Initial Access (T1078)',
    priorityScore: 96
  },
  // ... (rest of the sample data remains the same)
];

// Generate more sample data
const assetTypes = ['Server', 'WebServer', 'Database', 'Firewall', 'Laptop', 'Router', 'Switch', 'Mobile', 'Workstation', 'IoT-Device'];
const vulnTypes = [
  'Remote Code Execution', 'SQL Injection', 'Authentication Bypass', 'Privilege Escalation',
  'Command Injection', 'Buffer Overflow', 'Cross-Site Scripting', 'Memory Corruption',
  'Integer Overflow', 'Use After Free', 'Directory Traversal', 'XML External Entity',
  'Insecure Deserialization', 'Server-Side Request Forgery', 'Weak Encryption', 'Information Disclosure'
];
const sources = ['Orca Security', 'Tenable', 'SonarQube', 'Qualys'];
const statuses = ['Open', 'In Progress', 'Fixed', 'False Positive'];
const severities = ['Critical', 'High', 'Medium', 'Low'];
const mitreTactics = [
  'Initial Access (T1078)', 
  'Execution (T1203)', 
  'Persistence (T1098)', 
  'Privilege Escalation (T1068)',
  'Defense Evasion (T1027)',
  'Credential Access (T1110)',
  'Discovery (T1016)',
  'Lateral Movement (T1021)',
  'Collection (T1119)',
  'Command and Control (T1071)',
  'Exfiltration (T1048)',
  'Impact (T1489)'
];

// Generate additional vulnerabilities
for (let i = 6; i <= 100; i++) {
  const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
  const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const tactic = mitreTactics[Math.floor(Math.random() * mitreTactics.length)];
  
  let cvssScore;
  switch(severity) {
    case 'Critical': cvssScore = (9.0 + Math.random() * 1.0).toFixed(1); break;
    case 'High': cvssScore = (7.0 + Math.random() * 2.0).toFixed(1); break;
    case 'Medium': cvssScore = (4.0 + Math.random() * 3.0).toFixed(1); break;
    case 'Low': cvssScore = (0.1 + Math.random() * 3.9).toFixed(1); break;
  }
  
  vulnerabilities.push({
    id: i,
    assetName: `${assetType}-${String(i).padStart(3, '0')}`,
    ipAddress: `192.168.${Math.floor(i/254) + 1}.${(i % 254) + 1}`,
    vulnerability: vulnType,
    cve: `CVE-2023-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
    severity: severity,
    cvssScore: parseFloat(cvssScore),
    status: status,
    source: source,
    description: `${severity} severity ${vulnType.toLowerCase()} vulnerability requiring attention.`,
    firstDetected: `2024-0${Math.floor(Math.random() * 6) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    lastSeen: `2024-07-0${Math.floor(Math.random() * 4) + 1}`,
    epssScore: parseFloat((Math.random() * 1).toFixed(2)),
    exploitAvailable: Math.random() > 0.5,
    affectedAssets: Math.floor(Math.random() * 100) + 1,
    mitreTactic: tactic,
    priorityScore: Math.floor(Math.random() * 100) + 1
  });
}

let filteredVulnerabilities = [...vulnerabilities];
let currentSort = { field: null, direction: 'asc' };

// Function to display vulnerabilities in the table
function displayVulnerabilities(vulns) {
  const tbody = document.getElementById('allVulnsTableBody');
  if (!tbody) return;
  
  const severityColors = {
    'Critical': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  const exploitColors = {
    true: 'bg-red-100 text-red-800',
    false: 'bg-green-100 text-green-800'
  };
  
  tbody.innerHTML = vulns.slice(0, 50).map(vuln => `
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
          ${vuln.exploitAvailable ? 'Yes' : 'No'}
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
  `).join('');
  
  // Update count display
  const showingCount = document.getElementById('showingVulnsCount');
  const totalCount = document.getElementById('totalVulnsCount');
  if (showingCount) showingCount.textContent = Math.min(vulns.length, 50).toLocaleString();
  if (totalCount) totalCount.textContent = vulns.length.toLocaleString();
}



// Function to filter vulnerabilities
function filterVulnerabilities() {
  const searchInput = document.getElementById('searchVulns');
  const severitySelect = document.getElementById('severityFilter');
  const statusSelect = document.getElementById('statusFilter');
  const sourceSelect = document.getElementById('sourceFilter');
  
  if (!searchInput || !severitySelect || !statusSelect || !sourceSelect) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const severityFilter = severitySelect.value;
  const statusFilter = statusSelect.value;
  const sourceFilter = sourceSelect.value;
  
  filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSearch = !searchTerm || 
      vuln.assetName.toLowerCase().includes(searchTerm) ||
      vuln.ipAddress.toLowerCase().includes(searchTerm) ||
      vuln.vulnerability.toLowerCase().includes(searchTerm) ||
      vuln.cve.toLowerCase().includes(searchTerm) ||
      vuln.description.toLowerCase().includes(searchTerm);
    
    const matchesSeverity = !severityFilter || vuln.severity === severityFilter;
    const matchesStatus = !statusFilter || vuln.status === statusFilter;
    const matchesSource = !sourceFilter || vuln.source === sourceFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus && matchesSource;
  });
  
  displayVulnerabilities(filteredVulnerabilities);
}

// Function to filter by severity (called from cards)
function filterBySeverity(severity) {
  document.getElementById('severityFilter').value = severity;
  filterVulnerabilities();
}

// Function to sort table
function sortTable(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'asc';
  }

  filteredVulnerabilities.sort((a, b) => {
    let aVal, bVal;
    
    switch(field) {
      case 'severity':
        const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        aVal = severityOrder[a.severity];
        bVal = severityOrder[b.severity];
        break;
      case 'cvss':
        aVal = a.cvssScore;
        bVal = b.cvssScore;
        break;
      case 'epss':
        aVal = a.epssScore;
        bVal = b.epssScore;
        break;
      case 'priority':
        aVal = a.priorityScore;
        bVal = b.priorityScore;
        break;
      case 'assets':
        aVal = a.affectedAssets;
        bVal = b.affectedAssets;
        break;
      default:
        return 0;
    }
    
    if (currentSort.direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  displayVulnerabilities(filteredVulnerabilities);
}

// Function to toggle select all
function toggleSelectAll() {
  const selectAll = document.getElementById('selectAll');
  const checkboxes = document.querySelectorAll('.vuln-checkbox');
  checkboxes.forEach(cb => cb.checked = selectAll.checked);
}

// Function to export vulnerabilities report
function exportVulnerabilitiesReport() {
  const csvContent = [
    ['Affected', 'CVE ID', 'Title', 'CVSS', 'EPSS', 'Exploit', 'Assets', 'MITRE Tactic', 'Priority Score', 'Description', 'First Detected', 'Last Seen'],
    ...filteredVulnerabilities.map(vuln => [
      vuln.severity,
      vuln.cve,
      vuln.vulnerability,
      vuln.cvssScore,
      vuln.epssScore,
      vuln.exploitAvailable ? 'Yes' : 'No',
      vuln.affectedAssets,
      vuln.mitreTactic,
      vuln.priorityScore,
      vuln.description,
      vuln.firstDetected,
      vuln.lastSeen
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vulnerabilities_report_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  alert(`Exported ${filteredVulnerabilities.length} vulnerabilities to CSV file.`);
}

// Function to handle bulk actions
function bulkActions() {
  const selectedCheckboxes = document.querySelectorAll('.vuln-checkbox:checked');
  if (selectedCheckboxes.length === 0) {
    alert('Please select vulnerabilities to perform bulk actions.');
    return;
  }
  
  const action = prompt(`Selected ${selectedCheckboxes.length} vulnerabilities. Choose action:\n1. Mark as Fixed\n2. Mark as False Positive\n3. Assign to Team\n4. Change Priority\n\nEnter number (1-4):`);
  
  if (action) {
    alert(`Bulk action ${action} applied to ${selectedCheckboxes.length} vulnerabilities.`);
  }
}

// Placeholder functions for actions
function viewVulnerability(id) {
  const vuln = vulnerabilities.find(v => v.id === id);
  if (vuln) {
    alert(`Viewing vulnerability details:\n\nCVE: ${vuln.cve}\nTitle: ${vuln.vulnerability}\nSeverity: ${vuln.severity}\nCVSS: ${vuln.cvssScore}\nEPSS: ${vuln.epssScore}\nExploit: ${vuln.exploitAvailable ? 'Yes' : 'No'}\nAssets: ${vuln.affectedAssets}\nMITRE: ${vuln.mitreTactic}\nPriority: ${vuln.priorityScore}\n\n${vuln.description}`);
  }
}

function markFixed(id) {
  const vuln = vulnerabilities.find(v => v.id === id);
  if (vuln) {
    vuln.status = 'Fixed';
    displayVulnerabilities(filteredVulnerabilities);
    alert(`Vulnerability ${vuln.cve} marked as fixed.`);
  }
}

function assignVulnerability(id) {
  const assignee = prompt('Assign to team member:');
  if (assignee) {
    alert(`Vulnerability assigned to ${assignee}.`);
  }
}

function showCVEDetails(cve) {
  alert(`Showing details for ${cve}\n\nThis would typically open a detailed view or external CVE database information.`);
}

function refreshVulnerabilities() {
  alert('Refreshing vulnerability data...');
  displayVulnerabilities(filteredVulnerabilities);
}

function toggleTableView() {
  alert('Toggle between table and card view (feature coming soon)');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayVulnerabilities(vulnerabilities);
  
  // Check for hash in URL to filter by severity
  const hash = window.location.hash.substring(1);
  if (['critical', 'high', 'medium', 'low'].includes(hash)) {
    const severity = hash.charAt(0).toUpperCase() + hash.slice(1);
    filterBySeverity(severity);
  }
});