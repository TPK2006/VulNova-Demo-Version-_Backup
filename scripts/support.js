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

// Function to display support tickets
async function displaySupportTickets() {
  const container = document.getElementById('supportTickets');
  if (!container) return;

  try {
    const response = await fetch('/api/support/tickets');
    const supportTickets = await response.json();

    const statusColors = {
      'Open': 'bg-red-100 text-red-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800'
    };

    const priorityColors = {
      'High': 'bg-red-100 text-red-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Low': 'bg-green-100 text-green-800'
    };

    container.innerHTML = supportTickets.map(ticket => `
      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="viewTicketDetails('${ticket.id}')">
        <div class="flex items-start justify-between mb-2">
          <div>
            <h3 class="font-semibold text-gray-900 text-sm">${ticket.id}</h3>
            <p class="text-sm text-gray-600">${ticket.title}</p>
          </div>
          <div class="flex space-x-2">
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ticket.status]}">${ticket.status}</span>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${priorityColors[ticket.priority]}">${ticket.priority}</span>
          </div>
        </div>
        <div class="flex items-center justify-between text-xs text-gray-500 mt-3">
          <span>Created: ${new Date(ticket.created).toLocaleString()}</span>
          <span>Updated: ${new Date(ticket.lastUpdate).toLocaleString()}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading support tickets:', error);
    container.innerHTML = '<p class="text-red-500">Error loading support tickets. Please try again later.</p>';
  }
}

// Function to display system status
async function displaySystemStatus() {
  const container = document.getElementById('systemStatus');
  if (!container) return;

  try {
    const response = await fetch('/api/support/status');
    const systemStatus = await response.json();

    const statusColors = {
      'Operational': 'bg-green-100 text-green-800',
      'Degraded Performance': 'bg-yellow-100 text-yellow-800',
      'Partial Outage': 'bg-orange-100 text-orange-800',
      'Major Outage': 'bg-red-100 text-red-800'
    };

    container.innerHTML = systemStatus.map(service => `
      <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
        <div>
          <h3 class="font-medium text-gray-900">${service.service}</h3>
          <p class="text-sm text-gray-600">Uptime: ${service.uptime}</p>
        </div>
        <div class="text-right">
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[service.status]}">${service.status}</span>
          <p class="text-xs text-gray-500 mt-1">Last incident: ${service.lastIncident}</p>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading system status:', error);
    container.innerHTML = '<p class="text-red-500">Error loading system status. Please try again later.</p>';
  }
}

// Function to display knowledge base articles
async function displayKnowledgeBase(articles = null) {
  const container = document.getElementById('knowledgeBase');
  if (!container) return;

  try {
    if (!articles) {
      const response = await fetch('/api/support/knowledge-base');
      articles = await response.json();
    }

    const categoryColors = {
      'Getting Started': 'bg-blue-100 text-blue-800',
      'Configuration': 'bg-green-100 text-green-800',
      'Risk Management': 'bg-purple-100 text-purple-800',
      'API': 'bg-orange-100 text-orange-800',
      'Troubleshooting': 'bg-red-100 text-red-800',
      'Reporting': 'bg-yellow-100 text-yellow-800'
    };

    container.innerHTML = articles.map(article => `
      <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="viewArticle(${article.id})">
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-semibold text-gray-900 text-sm">${article.title}</h3>
          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[article.category]}">${article.category}</span>
        </div>
        <p class="text-sm text-gray-600 mb-3">${article.description}</p>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span>${article.views} views</span>
          <span>Updated: ${new Date(article.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    container.innerHTML = '<p class="text-red-500">Error loading knowledge base. Please try again later.</p>';
  }
}

// Function to search knowledge base
async function searchKnowledgeBase() {
  const searchInput = document.getElementById('searchKB');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  
  try {
    const response = await fetch(`/api/support/knowledge-base?search=${encodeURIComponent(searchTerm)}`);
    const articles = await response.json();
    displayKnowledgeBase(articles);
  } catch (error) {
    console.error('Error searching knowledge base:', error);
  }
}

// Placeholder functions for actions
async function openLiveChat() {
  alert('Opening Live Chat...\n\nConnecting you with a support representative.\nAverage wait time: 2 minutes');
}

async function createTicket() {
  const title = prompt('Enter ticket title:');
  if (!title) return;
  
  const description = prompt('Enter detailed description:');
  if (!description) return;
  
  const priority = prompt('Enter priority (High/Medium/Low):');
  if (!priority) return;
  
  try {
    const response = await fetch('/api/support/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, description, priority })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert(`Ticket created successfully!\nTicket ID: ${result.id}`);
      displaySupportTickets();
    } else {
      alert('Failed to create ticket. Please try again.');
    }
  } catch (error) {
    console.error('Error creating ticket:', error);
    alert('Error creating ticket. Please try again later.');
  }
}

async function viewTicketDetails(ticketId) {
  try {
    const response = await fetch(`/api/support/tickets/${ticketId}`);
    const ticket = await response.json();
    
    if (ticket) {
      alert(`Ticket Details: ${ticket.id}\n\nTitle: ${ticket.title}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}\nCreated: ${new Date(ticket.created).toLocaleString()}\nLast Update: ${new Date(ticket.lastUpdate).toLocaleString()}\n\nDescription:\n${ticket.description}`);
    }
  } catch (error) {
    console.error('Error fetching ticket details:', error);
    alert('Error loading ticket details. Please try again later.');
  }
}

async function viewArticle(articleId) {
  try {
    const response = await fetch(`/api/support/knowledge-base/${articleId}`);
    const article = await response.json();
    
    if (article) {
      alert(`Knowledge Base Article: ${article.title}\n\nCategory: ${article.category}\nViews: ${article.views}\nLast Updated: ${new Date(article.lastUpdated).toLocaleDateString()}\n\n${article.description}\n\n${article.content || ''}`);
    }
  } catch (error) {
    console.error('Error fetching article:', error);
    alert('Error loading article. Please try again later.');
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displaySupportTickets();
  displaySystemStatus();
  displayKnowledgeBase();
});