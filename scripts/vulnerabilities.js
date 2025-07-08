// Initialize Lucide icons
lucide.createIcons();

let vulnerability = [];
let filteredVulnerability = [];
let currentSort = { field: 'priorityScore', direction: 'desc' };
let currentPage = 1;
const itemsPerPage = 50;
let totalVulnerabilities = 0;

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

async function fetchVulnerability(page = 1) {
  try {
    currentPage = page;
    const searchInput = document.getElementById('searchVulns');
    const severitySelect = document.getElementById('severityFilter');
    const statusSelect = document.getElementById('statusFilter');
    const sourceSelect = document.getElementById('sourceFilter');
    
    const searchTerm = searchInput ? searchInput.value : '';
    const severityFilter = severitySelect ? severitySelect.value : '';
    const statusFilter = statusSelect ? statusSelect.value : '';
    const sourceFilter = sourceSelect ? sourceSelect.value : '';
    
    let url = `/api/vulnerability?page=${page}&limit=${itemsPerPage}&sortField=${currentSort.field}&sortOrder=${currentSort.direction}`;
    
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
    if (severityFilter) url += `&severity=${encodeURIComponent(severityFilter)}`;
    if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
    if (sourceFilter) url += `&source=${encodeURIComponent(sourceFilter)}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    vulnerability = data.vulnerability;
    filteredVulnerability = [...vulnerability];
    totalVulnerabilities = data.pagination.total;
    
    displayVulnerability(filteredVulnerability);
    updatePagination(data.pagination);
    updateVulnerabilityCount();
  } catch (error) {
    console.error('Error fetching vulnerability:', error);
    loadSampleData();
  }
}

function updatePagination(pagination) {
  const paginationContainer = document.querySelector('.pagination-container');
  if (!paginationContainer) return;

  const { page, pages } = pagination;
  
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
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}">
            <i data-lucide="chevron-left" class="w-5 h-5"></i>
          </button>`;

  // Show page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(pages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    paginationHTML += `
      <button onclick="changePage(1)" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
        1
      </button>`;
    if (startPage > 2) {
      paginationHTML += `
        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          ...
        </span>`;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button onclick="changePage(${i})" 
              class="${i === page ? 'bg-primary-50 border-primary-500 text-primary-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'} relative inline-flex items-center px-4 py-2 border text-sm font-medium">
        ${i}
      </button>`;
  }

  if (endPage < pages) {
    if (endPage < pages - 1) {
      paginationHTML += `
        <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
          ...
        </span>`;
    }
    paginationHTML += `
      <button onclick="changePage(${pages})" class="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
        ${pages}
      </button>`;
  }

  paginationHTML += `
          <button onclick="changePage(${page < pages ? page + 1 : pages})" 
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${page === pages ? 'opacity-50 cursor-not-allowed' : ''}">
            <i data-lucide="chevron-right" class="w-5 h-5"></i>
          </button>
        </nav>
      </div>
    </div>`;

  paginationContainer.innerHTML = paginationHTML;
  lucide.createIcons();
}

function changePage(page) {
  currentPage = page;
  fetchVulnerability(page);
}

function loadSampleData() {
  // Generate sample data if needed
  if (vulnerability.length === 0) {
    const assetTypes = ['Server', 'WebServer', 'Database', 'Firewall', 'Laptop', 'Router', 'Switch', 'Mobile', 'Workstation', 'IoT-Device'];
    const vulnTypes = [
      'Remote Code Execution', 'SQL Injection', 'Authentication Bypass', 'Privilege Escalation',
      'Command Injection', 'Buffer Overflow', 'Cross-Site Scripting', 'Memory Corruption',
      'Integer Overflow', 'Use After Free', 'Directory Traversal', 'XML External Entity',
      'Insecure Deserialization', 'Server-Side Request Forgery', 'Weak Encryption', 'Information Disclosure'
    ];
    const sources = ['Orca Security', 'Tenable', 'SonarQube', 'Qualys'];
    const statuses = ['Open', 'In Progress', 'Resurfaced', 'False Positive'];
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

    for (let i = 1; i <= 100; i++) {
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
      
      vulnerability.push({
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
  }
  
  filteredVulnerability = [...vulnerability];
  totalVulnerabilities = vulnerability.length;
  displayVulnerability(filteredVulnerability.slice(0, itemsPerPage));
  updatePagination({
    page: 1,
    pages: Math.ceil(vulnerability.length / itemsPerPage),
    total: vulnerability.length
  });
  calculateLocalStats();
}

function updateVulnerabilityCount() {
  const showingCount = document.getElementById('showingVulnsCount');
  const totalCount = document.getElementById('totalVulnsCount');
  if (showingCount) showingCount.textContent = filteredVulnerability.length.toLocaleString();
  if (totalCount) totalCount.textContent = totalVulnerabilities.toLocaleString();
}

function calculateLocalStats() {
  const stats = {
    critical: vulnerability.filter(v => v.severity === 'Critical').length,
    high: vulnerability.filter(v => v.severity === 'High').length,
    medium: vulnerability.filter(v => v.severity === 'Medium').length,
    low: vulnerability.filter(v => v.severity === 'Low').length
  };
  
  document.querySelector('.bg-red-50 span').textContent = stats.critical;
  document.querySelector('.bg-orange-50 span').textContent = stats.high;
  document.querySelector('.bg-yellow-50 span').textContent = stats.medium;
  document.querySelector('.bg-green-50 span').textContent = stats.low;
  
  updateVulnerabilityCount();
}

function displayVulnerability(vulns) {
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
  
  tbody.innerHTML = vulns.map(vuln => `
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
  
  updateVulnerabilityCount();
}

function filterVulnerability() {
  currentPage = 1;
  fetchVulnerability(currentPage);
}

function filterBySeverity(severity) {
  document.getElementById('severityFilter').value = severity;
  filterVulnerability();
}

function sortTable(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'asc';
  }
  
  fetchVulnerability(currentPage);
}

function toggleSelectAll() {
  const selectAll = document.getElementById('selectAll');
  const checkboxes = document.querySelectorAll('.vuln-checkbox');
  checkboxes.forEach(cb => cb.checked = selectAll.checked);
}

function exportVulnerabilityReport() {
  const csvContent = [
    ['Affected', 'CVE ID', 'Title', 'CVSS', 'EPSS', 'Exploit', 'Assets', 'MITRE Tactic', 'Priority Score', 'Description', 'First Detected', 'Last Seen'],
    ...filteredVulnerability.map(vuln => [
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
  a.download = `vulnerability_report_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  alert(`Exported ${filteredVulnerability.length} vulnerability to CSV file.`);
}

function bulkActions() {
  const selectedCheckboxes = document.querySelectorAll('.vuln-checkbox:checked');
  if (selectedCheckboxes.length === 0) {
    alert('Please select vulnerability to perform bulk actions.');
    return;
  }
  
  const action = prompt(`Selected ${selectedCheckboxes.length} vulnerability. Choose action:\n1. Mark as Resurfaced\n2. Mark as False Positive\n3. Assign to Team\n4. Change Priority\n\nEnter number (1-4):`);
  
  if (action) {
    alert(`Bulk action ${action} applied to ${selectedCheckboxes.length} vulnerability.`);
  }
}

function applyAdvancedFilters() {
  currentPage = 1;
  fetchVulnerability(currentPage);
}

function markFixed(id) {
  const vuln = vulnerability.find(v => v.id === id);
  if (vuln) {
    vuln.status = 'Resurfaced';
    displayVulnerability(filteredVulnerability);
    alert(`Vulnerability ${vuln.cve} marked as Resurfaced.`);
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

function refreshVulnerability() {
  fetchVulnerability(currentPage);
}

function toggleTableView() {
  alert('Toggle between table and card view (feature coming soon)');
}

document.addEventListener('DOMContentLoaded', function() {
  fetchVulnerability();
  
  const hash = window.location.hash.substring(1);
  if (['critical', 'high', 'medium', 'low'].includes(hash)) {
    const severity = hash.charAt(0).toUpperCase() + hash.slice(1);
    filterBySeverity(severity);
  }
});