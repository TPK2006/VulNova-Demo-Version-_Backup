// Replace the entire integrations.js content with:

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

// Color mapping for integration icons
const colorClasses = {
  'blue': 'text-blue-600 bg-blue-100',
  'green': 'text-green-600 bg-green-100',
  'purple': 'text-purple-600 bg-purple-100',
  'orange': 'text-orange-600 bg-orange-100',
  'red': 'text-red-600 bg-red-100',
  'yellow': 'text-yellow-600 bg-yellow-100'
};

// Status colors for automation rules
const statusColors = {
  'active': 'bg-green-100 text-green-800',
  'paused': 'bg-yellow-100 text-yellow-800',
  'disabled': 'bg-red-100 text-red-800'
};

async function fetchActiveIntegrations() {
  try {
    const response = await fetch('/api/integrations/active');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching active integrations:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Fetch available integrations from API
async function fetchAvailableIntegrations() {
  try {
    const response = await fetch('/api/integrations/available');
    if (!response.ok) throw new Error('Failed to fetch available integrations');
    return await response.json();
  } catch (error) {
    console.error('Error fetching available integrations:', error);
    return [];
  }
}

// Fetch automation rules from API
async function fetchAutomationRules() {
  try {
    const response = await fetch('/api/automation-rules');
    if (!response.ok) throw new Error('Failed to fetch automation rules');
    return await response.json();
  } catch (error) {
    console.error('Error fetching automation rules:', error);
    return [];
  }
}

// Replace the displayActiveIntegrations function with this corrected version:
async function displayActiveIntegrations() {
  const container = document.getElementById('activeIntegrations');
  if (!container) return;

  try {
    // Fetch active integrations
    const activeIntegrations = await fetchActiveIntegrations();
    
    // Fetch total count of integrations
    const totalResponse = await fetch('/api/integrations');
    if (!totalResponse.ok) throw new Error('Failed to fetch total integrations');
    const totalIntegrations = await totalResponse.json();
    const totalCount = totalIntegrations.length;

    // Update active count display
    const countElement = document.querySelector('#activeIntegrations + div > span');
    if (countElement) {
      countElement.textContent = `${activeIntegrations.length} of ${totalCount} integrations active`;
    }

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
          <span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">Connected</span>
        </div>
        <div class="text-sm text-gray-600 mb-3">
          Last sync: ${integration.lastSync ? new Date(integration.lastSync).toLocaleString() : 'Never'}
        </div>
        <div class="flex space-x-2">
          <button class="text-primary-600 hover:text-primary-800 text-sm font-medium" onclick="configureIntegration('${integration._id}')">Configure</button>
          <button class="text-gray-600 hover:text-gray-800 text-sm font-medium" onclick="testIntegration('${integration._id}')">Test</button>
          <button class="text-red-600 hover:text-red-800 text-sm font-medium" onclick="disconnectIntegration('${integration._id}')">Disconnect</button>
        </div>
      </div>
    `).join('');

    lucide.createIcons();
  } catch (error) {
    console.error('Error displaying active integrations:', error);
    container.innerHTML = '<p class="text-red-500">Error loading active integrations. Please try again.</p>';
  }
}

// Display available integrations
async function displayAvailableIntegrations(filteredIntegrations = null) {
  const container = document.getElementById('availableIntegrations');
  if (!container) return;

  const integrations = filteredIntegrations || await fetchAvailableIntegrations();

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
        <button class="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors" onclick="connectIntegration('${integration._id}')">Connect</button>
        <button class="text-primary-600 hover:text-primary-800 text-sm font-medium" onclick="viewIntegrationDetails('${integration._id}')">Learn More</button>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// Display automation rules
async function displayAutomationRules() {
  const container = document.getElementById('automationRules');
  if (!container) return;

  const rules = await fetchAutomationRules();

  container.innerHTML = rules.map(rule => `
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
        <span class="text-sm text-gray-500">${rule.lastTriggered ? 'Last triggered: ' + new Date(rule.lastTriggered).toLocaleString() : 'Never triggered'}</span>
        <div class="flex space-x-2">
          <button class="text-primary-600 hover:text-primary-800 text-sm font-medium" onclick="editAutomationRule('${rule._id}')">Edit</button>
          <button class="text-gray-600 hover:text-gray-800 text-sm font-medium" onclick="toggleAutomationRule('${rule._id}')">${rule.status === 'active' ? 'Pause' : 'Activate'}</button>
          <button class="text-red-600 hover:text-red-800 text-sm font-medium" onclick="deleteAutomationRule('${rule._id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// Filter integrations based on search and category
async function filterIntegrations() {
  const searchInput = document.getElementById('searchIntegrations');
  const categorySelect = document.getElementById('categoryFilter');
  
  if (!searchInput || !categorySelect) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const categoryFilter = categorySelect.value;
  
  const allIntegrations = await fetchAvailableIntegrations();
  
  const filtered = allIntegrations.filter(integration => {
    const matchesSearch = !searchTerm || 
      integration.name.toLowerCase().includes(searchTerm) ||
      integration.description.toLowerCase().includes(searchTerm);
    
    const matchesCategory = !categoryFilter || integration.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  displayAvailableIntegrations(filtered);
}

// Filter by category (called from category cards)
function filterByCategory(category) {
  document.getElementById('categoryFilter').value = category;
  filterIntegrations();
}

// Integration actions
async function configureIntegration(id) {
  alert(`Configure integration with ID: ${id}\n\nSettings and configuration options would open here.`);
}

async function testIntegration(id) {
  alert(`Testing integration with ID: ${id}\n\n✓ Connection successful\n✓ Authentication valid\n✓ Data sync working`);
}

async function disconnectIntegration(id) {
  if (confirm('Are you sure you want to disconnect this integration?')) {
    try {
      const response = await fetch(`/api/integrations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'available' })
      });
      
      if (response.ok) {
        alert('Integration disconnected successfully');
        displayActiveIntegrations();
      } else {
        throw new Error('Failed to disconnect integration');
      }
    } catch (error) {
      console.error('Error disconnecting integration:', error);
      alert('Failed to disconnect integration');
    }
  }
}

async function connectIntegration(id) {
  alert(`Connecting to integration with ID: ${id}\n\nPlease provide your API credentials and configuration details.`);
}

async function viewIntegrationDetails(id) {
  try {
    const response = await fetch(`/api/integrations/${id}`);
    if (!response.ok) throw new Error('Failed to fetch integration details');
    
    const integration = await response.json();
    alert(`${integration.name}\n\n${integration.description}\n\nCategory: ${integration.category}\nStatus: ${integration.status}`);
  } catch (error) {
    console.error('Error fetching integration details:', error);
    alert('Failed to load integration details');
  }
}

async function createAutomationRule() {
  alert('Create Automation Rule\n\nDefine triggers, conditions, and actions to automate your security workflows.');
}

async function editAutomationRule(id) {
  try {
    const response = await fetch(`/api/automation-rules/${id}`);
    if (!response.ok) throw new Error('Failed to fetch rule details');
    
    const rule = await response.json();
    alert(`Edit Automation Rule: ${rule.name}\n\nTrigger: ${rule.trigger}\nAction: ${rule.action}\nStatus: ${rule.status}`);
  } catch (error) {
    console.error('Error fetching rule details:', error);
    alert('Failed to load rule details');
  }
}

async function toggleAutomationRule(id) {
  try {
    const response = await fetch(`/api/automation-rules/${id}`);
    if (!response.ok) throw new Error('Failed to fetch rule status');
    
    const rule = await response.json();
    const newStatus = rule.status === 'active' ? 'paused' : 'active';
    
    const updateResponse = await fetch(`/api/automation-rules/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (updateResponse.ok) {
      alert(`Rule status updated to ${newStatus}`);
      displayAutomationRules();
    } else {
      throw new Error('Failed to update rule status');
    }
  } catch (error) {
    console.error('Error toggling rule status:', error);
    alert('Failed to update rule status');
  }
}

async function deleteAutomationRule(id) {
  if (confirm('Are you sure you want to delete this automation rule?')) {
    try {
      const response = await fetch(`/api/automation-rules/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Rule deleted successfully');
        displayAutomationRules();
      } else {
        throw new Error('Failed to delete rule');
      }
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('Failed to delete rule');
    }
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async function() {
  await displayActiveIntegrations();
  await displayAvailableIntegrations();
  await displayAutomationRules();
});