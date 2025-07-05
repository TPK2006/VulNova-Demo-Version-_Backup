// Initialize Lucide icons
lucide.createIcons();
    
// Sidebar toggle logic
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarHamburger = document.getElementById('sidebarHamburger');
const mainContent = document.getElementById('mainContent');
const topHeader = document.getElementById('topHeader');

function toggleSidebar() {
  const isCollapsed = sidebar.classList.contains('w-16');
  
  sidebar.classList.toggle('w-56');
  sidebar.classList.toggle('w-16');
  mainContent.classList.toggle('ml-56');
  mainContent.classList.toggle('ml-16');
  topHeader.classList.toggle('left-56');
  topHeader.classList.toggle('left-16');
  document.querySelectorAll('.sidebar-label').forEach(el => el.classList.toggle('hidden'));

  // Store the state in localStorage
  localStorage.setItem('sidebar-collapsed', !isCollapsed);
}

// Check localStorage for sidebar state on load
document.addEventListener('DOMContentLoaded', () => {
  const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('w-16');
    mainContent.classList.add('ml-16');
    topHeader.classList.add('left-16');
    document.querySelectorAll('.sidebar-label').forEach(el => el.classList.add('hidden'));
  }
});

if (sidebarToggle) sidebarToggle.onclick = toggleSidebar;
if (sidebarHamburger) sidebarHamburger.onclick = toggleSidebar;

// Sample asset data
const assets = [
  {
    id: 1,
    name: 'Server-001',
    ipAddress: '192.168.1.100',
    hostname: 'web-server-01',
    category: 'Server',
    os: 'Windows Server 2019',
    riskScore: 980,
    riskLevel: 'Critical',
    vulnerabilities: { critical: 12, high: 8, medium: 15, low: 23 },
    lastSeen: '2024-07-04 14:30',
    status: 'Online',
    location: 'Data Center A',
    owner: 'IT Team',
    edrInstalled: true
  },
  {
    id: 2,
    name: 'Laptop-023',
    ipAddress: '192.168.1.104',
    hostname: 'laptop-john-doe',
    category: 'Workstation',
    os: 'Windows 11 Pro',
    riskScore: 920,
    riskLevel: 'Critical',
    vulnerabilities: { critical: 8, high: 12, medium: 20, low: 18 },
    lastSeen: '2024-07-04 16:45',
    status: 'Online',
    location: 'Office Floor 3',
    owner: 'John Doe',
    edrInstalled: false
  },
  {
    id: 3,
    name: 'Database-01',
    ipAddress: '192.168.1.102',
    hostname: 'db-prod-01',
    category: 'Server',
    os: 'Ubuntu 20.04 LTS',
    riskScore: 890,
    riskLevel: 'High',
    vulnerabilities: { critical: 6, high: 15, medium: 25, low: 30 },
    lastSeen: '2024-07-04 15:20',
    status: 'Online',
    location: 'Data Center B',
    owner: 'Database Team',
    edrInstalled: true
  },
  {
    id: 4,
    name: 'Firewall-02',
    ipAddress: '192.168.1.103',
    hostname: 'fw-perimeter-02',
    category: 'Network',
    os: 'FortiOS 7.2',
    riskScore: 870,
    riskLevel: 'High',
    vulnerabilities: { critical: 7, high: 10, medium: 18, low: 12 },
    lastSeen: '2024-07-04 17:00',
    status: 'Online',
    location: 'Network Closet',
    owner: 'Network Team',
    edrInstalled: false
  },
  {
    id: 5,
    name: 'Mobile-Device-12',
    ipAddress: '192.168.1.150',
    hostname: 'iphone-jane-smith',
    category: 'Mobile',
    os: 'iOS 17.1',
    riskScore: 450,
    riskLevel: 'Medium',
    vulnerabilities: { critical: 0, high: 2, medium: 8, low: 15 },
    lastSeen: '2024-07-04 13:15',
    status: 'Online',
    location: 'Remote',
    owner: 'Jane Smith',
    edrInstalled: true
  }
];

// Generate more sample assets
const categories = ['Server', 'Workstation', 'Mobile', 'Network', 'IoT'];
const osOptions = {
  'Server': ['Windows Server 2019', 'Windows Server 2022', 'Ubuntu 20.04 LTS', 'Ubuntu 22.04 LTS', 'CentOS 8', 'RHEL 8'],
  'Workstation': ['Windows 11 Pro', 'Windows 10 Pro', 'macOS Monterey', 'macOS Ventura', 'Ubuntu Desktop'],
  'Mobile': ['iOS 17.1', 'iOS 16.7', 'Android 13', 'Android 12', 'Android 11'],
  'Network': ['FortiOS 7.2', 'Cisco IOS 15.2', 'pfSense 2.6', 'Juniper JUNOS'],
  'IoT': ['Embedded Linux', 'FreeRTOS', 'Custom Firmware', 'Android Things']
};
const locations = ['Data Center A', 'Data Center B', 'Office Floor 1', 'Office Floor 2', 'Office Floor 3', 'Remote', 'Branch Office'];
const owners = ['IT Team', 'Database Team', 'Network Team', 'Security Team', 'Development Team', 'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];

// Generate additional assets
for (let i = 6; i <= 100; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const osArray = osOptions[category];
  const os = osArray[Math.floor(Math.random() * osArray.length)];
  const riskScore = Math.floor(Math.random() * 1000);
  let riskLevel;
  if (riskScore >= 800) riskLevel = 'Critical';
  else if (riskScore >= 600) riskLevel = 'High';
  else if (riskScore >= 300) riskLevel = 'Medium';
  else riskLevel = 'Low';

  const critical = Math.floor(Math.random() * (riskLevel === 'Critical' ? 15 : riskLevel === 'High' ? 8 : 3));
  const high = Math.floor(Math.random() * (riskLevel === 'Critical' ? 20 : riskLevel === 'High' ? 15 : 8));
  const medium = Math.floor(Math.random() * 30);
  const low = Math.floor(Math.random() * 40);

  assets.push({
    id: i,
    name: `${category}-${String(i).padStart(3, '0')}`,
    ipAddress: `192.168.${Math.floor(i/254) + 1}.${(i % 254) + 1}`,
    hostname: `${category.toLowerCase()}-${i}`,
    category: category,
    os: os,
    riskScore: riskScore,
    riskLevel: riskLevel,
    vulnerabilities: { critical, high, medium, low },
    lastSeen: `2024-07-0${Math.floor(Math.random() * 4) + 1} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    status: Math.random() > 0.05 ? 'Online' : 'Offline',
    location: locations[Math.floor(Math.random() * locations.length)],
    owner: owners[Math.floor(Math.random() * owners.length)],
    edrInstalled: Math.random() > 0.3
  });
}

let filteredAssets = [...assets];
let currentSort = { field: null, direction: 'asc' };

// Function to display assets in the table
function displayAssets(assetList) {
  const tbody = document.getElementById('assetsTableBody');
  if (!tbody) return;
  
  const riskColors = {
    'Critical': 'bg-red-100 text-red-800',
    'High': 'bg-orange-100 text-orange-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Low': 'bg-green-100 text-green-800'
  };

  const statusColors = {
    'Online': 'bg-green-100 text-green-800',
    'Offline': 'bg-red-100 text-red-800'
  };
  
  tbody.innerHTML = assetList.slice(0, 50).map(asset => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <input type="checkbox" class="asset-checkbox" value="${asset.id}">
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
          ${asset.vulnerabilities.critical > 0 ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">${asset.vulnerabilities.critical}C</span>` : ''}
          ${asset.vulnerabilities.high > 0 ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">${asset.vulnerabilities.high}H</span>` : ''}
          ${asset.vulnerabilities.medium > 0 ? `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">${asset.vulnerabilities.medium}M</span>` : ''}
        </div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${asset.lastSeen}</div>
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[asset.status]}">${asset.status}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          <button class="text-primary-600 hover:text-primary-900" onclick="viewAsset(${asset.id})">View</button>
          <button class="text-blue-600 hover:text-blue-900" onclick="scanAsset(${asset.id})">Scan</button>
          <button class="text-gray-600 hover:text-gray-900" onclick="editAsset(${asset.id})">Edit</button>
        </div>
      </td>
    </tr>
  `).join('');
  
  // Update count display
  const showingCount = document.getElementById('showingAssetsCount');
  const totalCount = document.getElementById('totalAssetsCount');
  if (showingCount) showingCount.textContent = Math.min(assetList.length, 50).toLocaleString();
  if (totalCount) totalCount.textContent = assetList.length.toLocaleString();
}

// Function to filter assets
function filterAssets() {
  const searchInput = document.getElementById('searchAssets');
  const categorySelect = document.getElementById('categoryFilter');
  const osSelect = document.getElementById('osFilter');
  const riskSelect = document.getElementById('riskFilter');
  
  if (!searchInput || !categorySelect || !osSelect || !riskSelect) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const categoryFilter = categorySelect.value;
  const osFilter = osSelect.value;
  const riskFilter = riskSelect.value;
  
  filteredAssets = assets.filter(asset => {
    const matchesSearch = !searchTerm || 
      asset.name.toLowerCase().includes(searchTerm) ||
      asset.ipAddress.toLowerCase().includes(searchTerm) ||
      asset.hostname.toLowerCase().includes(searchTerm) ||
      asset.owner.toLowerCase().includes(searchTerm);
    
    const matchesCategory = !categoryFilter || asset.category === categoryFilter;
    const matchesOS = !osFilter || asset.os.includes(osFilter);
    const matchesRisk = !riskFilter || asset.riskLevel === riskFilter;
    
    return matchesSearch && matchesCategory && matchesOS && matchesRisk;
  });
  
  displayAssets(filteredAssets);
}

// Function to sort assets
function sortAssets(field) {
  if (currentSort.field === field) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.field = field;
    currentSort.direction = 'asc';
  }

  filteredAssets.sort((a, b) => {
    let aVal, bVal;
    
    switch(field) {
      case 'name':
        aVal = a.name;
        bVal = b.name;
        break;
      case 'risk':
        aVal = a.riskScore;
        bVal = b.riskScore;
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

  displayAssets(filteredAssets);
}

// Function to toggle select all assets
function toggleSelectAllAssets() {
  const selectAll = document.getElementById('selectAllAssets');
  const checkboxes = document.querySelectorAll('.asset-checkbox');
  checkboxes.forEach(cb => cb.checked = selectAll.checked);
}

// Placeholder functions for actions
function scanAssets() {
  alert('Starting comprehensive asset scan...');
}

function addAsset() {
  alert('Add new asset form would open here');
}

function viewAsset(id) {
  const asset = assets.find(a => a.id === id);
  if (asset) {
    alert(`Viewing details for ${asset.name}\nIP: ${asset.ipAddress}\nRisk Score: ${asset.riskScore}\nOwner: ${asset.owner}`);
  }
}

function scanAsset(id) {
  const asset = assets.find(a => a.id === id);
  if (asset) {
    alert(`Starting scan for ${asset.name}...`);
  }
}

function editAsset(id) {
  const asset = assets.find(a => a.id === id);
  if (asset) {
    alert(`Edit form for ${asset.name} would open here`);
  }
}

function refreshAssets() {
  alert('Refreshing asset data...');
  displayAssets(filteredAssets);
}

function exportAssets() {
  const csvContent = [
    ['Asset Name', 'IP Address', 'Hostname', 'Category', 'OS', 'Risk Score', 'Risk Level', 'Critical Vulns', 'High Vulns', 'Medium Vulns', 'Low Vulns', 'Status', 'Location', 'Owner', 'EDR Installed', 'Last Seen'],
    ...filteredAssets.map(asset => [
      asset.name,
      asset.ipAddress,
      asset.hostname,
      asset.category,
      asset.os,
      asset.riskScore,
      asset.riskLevel,
      asset.vulnerabilities.critical,
      asset.vulnerabilities.high,
      asset.vulnerabilities.medium,
      asset.vulnerabilities.low,
      asset.status,
      asset.location,
      asset.owner,
      asset.edrInstalled ? 'Yes' : 'No',
      asset.lastSeen
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `assets_report_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  alert(`Exported ${filteredAssets.length} assets to CSV file.`);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayAssets(assets);
  
  // Check for hash in URL to highlight specific assets
  const hash = window.location.hash.substring(1);
  if (hash) {
    const searchInput = document.getElementById('searchAssets');
    if (searchInput) {
      searchInput.value = hash;
      filterAssets();
    }
  }
});