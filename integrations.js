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

// Sample integrations data
const activeIntegrations = [
  {
    id: 1,
    name: 'Tenable.io',
    category: 'vulnerability-scanners',
    status: 'Connected',
    lastSync: '2024-07-04 16:30',
    icon: 'scan',
    color: 'blue'
  },
  {
    id: 2,
    name: 'Splunk Enterprise',
    category: 'siem-tools',
    status: 'Connected',
    lastSync: '2024-07-04 16:45',
    icon: 'activity',
    color: 'green'
  },
  {
    id: 3,
    name: 'Jira Service Management',
    category: 'ticketing-systems',
    status: 'Connected',
    lastSync: '2024-07-04 15:20',
    icon: 'ticket',
    color: 'purple'
  },
  {
    id: 4,
    name: 'Slack',
    category: 'communication',
    status: 'Connected',
    lastSync: '2024-07-04 17:00',
    icon: 'message-square',
    color: 'orange'
  },
  {
    id: 5,
    name: 'Microsoft Teams',
    category: 'communication',
    status: 'Connected',
    lastSync: '2024-07-04 16:55',
    icon: 'message-circle',
    color: 'blue'
  },
  {
    id: 6,
    name: 'AWS Security Hub',
    category: 'cloud-security',
    status: 'Connected',
    lastSync: '2024-07-04 16:40',
    icon: 'cloud',
    color: 'yellow'
  },
  {
    id: 7,
    name: 'Orca Security',
    category: 'vulnerability-scanners',
    status: 'Connected',
    lastSync: '2024-07-04 16:35',
    icon: 'shield',
    color: 'green'
  }
];

const availableIntegrations = [
  {
    id: 8,
    name: 'Qualys VMDR',
    category: 'vulnerability-scanners',
    description: 'Comprehensive vulnerability management and detection',
    icon: 'scan',
    color: 'blue',
    popular: true
  },
  {
    id: 9,
    name: 'Rapid7 InsightVM',
    category: 'vulnerability-scanners',
    description: 'Risk-based vulnerability management',
    icon: 'search',
    color: 'red',
    popular: false
  },
  {
    id: 10,
    name: 'ServiceNow ITSM',
    category: 'ticketing-systems',
    description: 'IT service management platform',
    icon: 'ticket',
    color: 'green',
    popular: true
  },
  {
    id: 11,
    name: 'PagerDuty',
    category: 'communication',
    description: 'Incident response and alerting',
    icon: 'bell',
    color: 'orange',
    popular: true
  },
  {
    id: 12,
    name: 'Azure Sentinel',
    category: 'siem-tools',
    description: 'Cloud-native SIEM and SOAR',
    icon: 'eye',
    color: 'blue',
    popular: false
  },
  {
    id: 13,
    name: 'Elastic Security',
    category: 'siem-tools',
    description: 'Search-powered security analytics',
    icon: 'activity',
    color: 'yellow',
    popular: false
  },
  {
    id: 14,
    name: 'Google Cloud Security',
    category: 'cloud-security',
    description: 'Google Cloud security and compliance',
    icon: 'cloud',
    color: 'blue',
    popular: false
  },
  {
    id: 15,
    name: 'Okta',
    category: 'identity-management',
    description: 'Identity and access management',
    icon: 'user-check',
    color: 'purple',
    popular: true
  }
];

const automationRules = [
  {
    id: 1,
    name: 'Critical Vulnerability Alert',
    trigger: 'New critical vulnerability detected',
    action: 'Create Jira ticket and send Slack notification',
    status: 'Active',
    lastTriggered: '2024-07-04 14:30'
  },
  {
    id: 2,
    name: 'Asset Discovery Notification',
    trigger: 'New asset discovered',
    action: 'Send email to security team',
    status: 'Active',
    lastTriggered: '2024-07-03 09:15'
  },
  {
    id: 3,
    name: 'Compliance Report Generation',
    trigger: 'Weekly schedule',
    action: 'Generate and email compliance report',
    status: 'Active',
    lastTriggered: '2024-07-01 08:00'
  },
  {
    id: 4,
    name: 'High Risk Asset Alert',
    trigger: 'Asset risk score > 800',
    action: 'Create ServiceNow incident',
    status: 'Paused',
    lastTriggered: '2024-06-28 16:45'
  }
];

// Function to display active integrations
function displayActiveIntegrations() {
  const container = document.getElementById('activeIntegrations');
  if (!container) return;

  const colorClasses = {
    'blue': 'text-blue-600 bg-blue-100',
    'green': 'text-green-600 bg-green-100',
    'purple': 'text-purple-600 bg-purple-100',
    'orange': 'text-orange-600 bg-orange-100',
    'red': 'text-red-600 bg-red-100',
    'yellow': 'text-yellow-600 bg-yellow-100'
  };

  container.innerHTML = activeIntegrations.map(integration => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg ${colorClasses[integration.color]} flex items-center justify-center">
            <i data-lucide="${integration.icon}" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">${integration.name}</h3>
            <p class="text-sm text-gray-600">${integration.category.replace('-', ' ')}</p>
          </div>
        </div>
        <span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">${integration.status}</span>
      </div>
      <div class="text-sm text-gray-600 mb-3">
        Last sync: ${integration.lastSync}
      </div>
      <div class="flex space-x-2">
        <button class="text-primary-600 hover:text-primary-800 text-sm font-medium" onclick="configureIntegration(${integration.id})">Configure</button>
        <button class="text-gray-600 hover:text-gray-800 text-sm font-medium" onclick="testIntegration(${integration.id})">Test</button>
        <button class="text-red-600 hover:text-red-800 text-sm font-medium" onclick="disconnectIntegration(${integration.id})">Disconnect</button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// Function to display available integrations
function displayAvailableIntegrations(integrations = availableIntegrations) {
  const container = document.getElementById('availableIntegrations');
  if (!container) return;

  const colorClasses = {
    'blue': 'text-blue-600 bg-blue-100',
    'green': 'text-green-600 bg-green-100',
    'purple': 'text-purple-600 bg-purple-100',
    'orange': 'text-orange-600 bg-orange-100',
    'red': 'text-red-600 bg-red-100',
    'yellow': 'text-yellow-600 bg-yellow-100'
  };

  container.innerHTML = integrations.map(integration => `
    <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg ${colorClasses[integration.color]} flex items-center justify-center">
            <i data-lucide="${integration.icon}" class="w-5 h-5"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h3 class="font-semibold text-gray-900">${integration.name}</h3>
              ${integration.popular ? '<span class="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">Popular</span>' : ''}
            </div>
            <p class="text-sm text-gray-600">${integration.category.replace('-', ' ')}</p>
          </div>
        </div>
      </div>
      <p class="text-sm text-gray-600 mb-4">${integration.description}</p>
      <div class="flex space-x-2">
        <button class="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors" onclick="connectIntegration(${integration.id})">Connect</button>
        <button class="text-primary-600 hover:text-primary-800 text-sm font-medium" onclick="viewIntegrationDetails(${integration.id})">Learn More</button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// Function to display automation rules
function displayAutomationRules() {
  const container = document.getElementById('automationRules');
  if (!container) return;

  const statusColors = {
    'Active': 'bg-green-100 text-green-800',
    'Paused': 'bg-yellow-100 text-yellow-800',
    'Disabled': 'bg-red-100 text-red-800'
  };

  container.innerHTML = automationRules.map(rule => `
    <div class="border border-gray-200 rounded-lg p-4">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-3">
          <i data-lucide="zap" class="w-5 h-5 text-purple-600"></i>
          <div>
            <h3 class="font-semibold text-gray-900">${rule.name}</h3>
            <p class="text-sm text-gray-600">When: ${rule.trigger}</p>
          </div>
        </div>
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[rule.status]}">${rule.status}</span>
      </div>
      <div class="text-sm text-gray-600 mb-3">
        <strong>Action:</strong> ${rule.action}
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-500">Last triggered: ${rule.lastTriggered}</span>
        <div class="flex space-x-2">
          <button class="text-primary-600 hover:text-primary-800 text-sm font-medium" onclick="editAutomationRule(${rule.id})">Edit</button>
          <button class="text-gray-600 hover:text-gray-800 text-sm font-medium" onclick="toggleAutomationRule(${rule.id})">${rule.status === 'Active' ? 'Pause' : 'Activate'}</button>
          <button class="text-red-600 hover:text-red-800 text-sm font-medium" onclick="deleteAutomationRule(${rule.id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// Function to filter integrations
function filterIntegrations() {
  const searchInput = document.getElementById('searchIntegrations');
  const categorySelect = document.getElementById('categoryFilter');
  
  if (!searchInput || !categorySelect) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const categoryFilter = categorySelect.value;
  
  const filtered = availableIntegrations.filter(integration => {
    const matchesSearch = !searchTerm || 
      integration.name.toLowerCase().includes(searchTerm) ||
      integration.description.toLowerCase().includes(searchTerm);
    
    const matchesCategory = !categoryFilter || integration.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  displayAvailableIntegrations(filtered);
}

// Function to filter by category (called from category cards)
function filterByCategory(category) {
  document.getElementById('categoryFilter').value = category;
  filterIntegrations();
}

// Placeholder functions for actions
function browseMarketplace() {
  alert('Browse Integration Marketplace\n\nDiscover hundreds of pre-built integrations and connectors for your security tools.');
}

function createCustomIntegration() {
  alert('Create Custom Integration\n\nBuild custom integrations using our API and webhook framework.');
}

function configureIntegration(id) {
  const integration = activeIntegrations.find(i => i.id === id);
  if (integration) {
    alert(`Configure ${integration.name}\n\nSettings and configuration options would open here.`);
  }
}

function testIntegration(id) {
  const integration = activeIntegrations.find(i => i.id === id);
  if (integration) {
    alert(`Testing ${integration.name} connection...\n\n✓ Connection successful\n✓ Authentication valid\n✓ Data sync working`);
  }
}

function disconnectIntegration(id) {
  const integration = activeIntegrations.find(i => i.id === id);
  if (integration) {
    if (confirm(`Are you sure you want to disconnect ${integration.name}?`)) {
      alert(`${integration.name} has been disconnected.`);
    }
  }
}

function connectIntegration(id) {
  const integration = availableIntegrations.find(i => i.id === id);
  if (integration) {
    alert(`Connecting to ${integration.name}...\n\nPlease provide your API credentials and configuration details.`);
  }
}

function viewIntegrationDetails(id) {
  const integration = availableIntegrations.find(i => i.id === id);
  if (integration) {
    alert(`${integration.name}\n\n${integration.description}\n\nFeatures:\n• Real-time data sync\n• Automated workflows\n• Custom field mapping\n• Enterprise security`);
  }
}

function createAutomationRule() {
  alert('Create Automation Rule\n\nDefine triggers, conditions, and actions to automate your security workflows.');
}

function editAutomationRule(id) {
  const rule = automationRules.find(r => r.id === id);
  if (rule) {
    alert(`Edit Automation Rule: ${rule.name}\n\nRule configuration editor would open here.`);
  }
}

function toggleAutomationRule(id) {
  const rule = automationRules.find(r => r.id === id);
  if (rule) {
    const newStatus = rule.status === 'Active' ? 'Paused' : 'Active';
    rule.status = newStatus;
    displayAutomationRules();
    alert(`Rule "${rule.name}" has been ${newStatus.toLowerCase()}.`);
  }
}

function deleteAutomationRule(id) {
  const rule = automationRules.find(r => r.id === id);
  if (rule && confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) {
    const index = automationRules.findIndex(r => r.id === id);
    automationRules.splice(index, 1);
    displayAutomationRules();
    alert(`Rule "${rule.name}" has been deleted.`);
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayActiveIntegrations();
  displayAvailableIntegrations();
  displayAutomationRules();
});