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
    lastSeen: '2024-07-01'
  },
  {
    id: 2,
    assetName: 'WebServer-02',
    ipAddress: '192.168.1.101',
    vulnerability: 'Spring4Shell Remote Code Execution',
    cve: 'CVE-2022-22965',
    severity: 'Critical',
    cvssScore: 9.8,
    status: 'In Progress',
    source: 'Tenable',
    description: 'Spring Framework contains a remote code execution vulnerability in the Data Binding mechanism.',
    firstDetected: '2024-02-10',
    lastSeen: '2024-07-02'
  },
  {
    id: 3,
    assetName: 'Database-01',
    ipAddress: '192.168.1.102',
    vulnerability: 'SQL Injection',
    cve: 'CVE-2023-1234',
    severity: 'High',
    cvssScore: 8.5,
    status: 'Open',
    source: 'SonarQube',
    description: 'Multiple SQL injection vulnerabilities in database queries.',
    firstDetected: '2024-03-05',
    lastSeen: '2024-07-03'
  },
  {
    id: 4,
    assetName: 'Firewall-01',
    ipAddress: '192.168.1.103',
    vulnerability: 'Authentication Bypass',
    cve: 'CVE-2023-5678',
    severity: 'High',
    cvssScore: 8.0,
    status: 'Fixed',
    source: 'Qualys',
    description: 'Authentication bypass vulnerability in firewall management interface.',
    firstDetected: '2024-01-20',
    lastSeen: '2024-06-15'
  },
  {
    id: 5,
    assetName: 'Laptop-023',
    ipAddress: '192.168.1.104',
    vulnerability: 'Privilege Escalation',
    cve: 'CVE-2023-9012',
    severity: 'Medium',
    cvssScore: 6.5,
    status: 'Open',
    source: 'Tenable',
    description: 'Local privilege escalation vulnerability in system service.',
    firstDetected: '2024-04-12',
    lastSeen: '2024-07-04'
  }
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

// Generate additional vulnerabilities
for (let i = 6; i <= 100; i++) {
  const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
  const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
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
    lastSeen: `2024-07-0${Math.floor(Math.random() * 4) + 1}`
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

  const statusColors = {
    'Open': 'bg-red-100 text-red-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Fixed': 'bg-green-100 text-green-800',
    'False Positive': 'bg-gray-100 text-gray-800'
  };
  
  tbody.innerHTML = vulns.slice(0, 50).map(vuln => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <input type="checkbox" class="vuln-checkbox" value="${vuln.id}">
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="flex items-center">
          <div>
            <div class="text-sm font-medium text-gray-900">${vuln.assetName}</div>
            <div class="text-sm text-gray-500">${vuln.ipAddress}</div>
          </div>
        </div>
      </td>
      <td class="px-6 py-4">
        <div class="text-sm text-gray-900">${vuln.vulnerability}</div>
        <div class="text-sm text-gray-500">${vuln.description.substring(0, 60)}...</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-blue-600 hover:underline cursor-pointer" onclick="showCVEDetails('${vuln.cve}')">${vuln.cve}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severityColors[vuln.severity]}">${vuln.severity}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900 font-medium">${vuln.cvssScore}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[vuln.status]}">${vuln.status}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${vuln.source}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button class="text-primary-600 hover:text-primary-900" onclick="viewVulnerability(${vuln.id})">View</button>
          <button class="text-green-600 hover:text-green-900" onclick="markFixed(${vuln.id})">Fix</button>
          <button class="text-gray-600 hover:text-gray-900" onclick="assignVulnerability(${vuln.id})">Assign</button>
        </div>
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
      case 'asset':
        aVal = a.assetName;
        bVal = b.assetName;
        break;
      case 'vulnerability':
        aVal = a.vulnerability;
        bVal = b.vulnerability;
        break;
      case 'severity':
        const severityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        aVal = severityOrder[a.severity];
        bVal = severityOrder[b.severity];
        break;
      case 'cvss':
        aVal = a.cvssScore;
        bVal = b.cvssScore;
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
    ['Asset Name', 'IP Address', 'Vulnerability', 'CVE', 'Severity', 'CVSS Score', 'Status', 'Source', 'Description', 'First Detected', 'Last Seen'],
    ...filteredVulnerabilities.map(vuln => [
      vuln.assetName,
      vuln.ipAddress,
      vuln.vulnerability,
      vuln.cve,
      vuln.severity,
      vuln.cvssScore,
      vuln.status,
      vuln.source,
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
  alert(`Viewing vulnerability details for ID: ${id}`);
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
  alert(`Showing details for ${cve}`);
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