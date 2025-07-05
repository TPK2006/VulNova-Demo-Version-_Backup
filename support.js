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

// Sample support data
const supportTickets = [
  {
    id: 'TICK-001',
    title: 'Integration Issue with Tenable.io',
    status: 'Open',
    priority: 'High',
    created: '2024-07-04 10:30',
    lastUpdate: '2024-07-04 14:20'
  },
  {
    id: 'TICK-002',
    title: 'False Positive in Vulnerability Scan',
    status: 'In Progress',
    priority: 'Medium',
    created: '2024-07-03 16:45',
    lastUpdate: '2024-07-04 09:15'
  },
  {
    id: 'TICK-003',
    title: 'Report Generation Timeout',
    status: 'Resolved',
    priority: 'Low',
    created: '2024-07-02 11:20',
    lastUpdate: '2024-07-03 13:30'
  }
];

const systemStatus = [
  {
    service: 'Vulnerability Scanning',
    status: 'Operational',
    uptime: '99.9%',
    lastIncident: 'None'
  },
  {
    service: 'Asset Discovery',
    status: 'Operational',
    uptime: '99.8%',
    lastIncident: 'None'
  },
  {
    service: 'Threat Intelligence',
    status: 'Operational',
    uptime: '100%',
    lastIncident: 'None'
  },
  {
    service: 'Reporting Engine',
    status: 'Degraded Performance',
    uptime: '98.5%',
    lastIncident: '2 hours ago'
  },
  {
    service: 'API Services',
    status: 'Operational',
    uptime: '99.9%',
    lastIncident: 'None'
  }
];

const knowledgeBaseArticles = [
  {
    id: 1,
    title: 'Getting Started with VulNova',
    category: 'Getting Started',
    views: 1250,
    lastUpdated: '2024-07-01',
    description: 'Complete guide to setting up and configuring VulNova for your organization'
  },
  {
    id: 2,
    title: 'Configuring Vulnerability Scanners',
    category: 'Configuration',
    views: 890,
    lastUpdated: '2024-06-28',
    description: 'Step-by-step guide to integrate and configure vulnerability scanning tools'
  },
  {
    id: 3,
    title: 'Understanding Risk Scores',
    category: 'Risk Management',
    views: 756,
    lastUpdated: '2024-06-25',
    description: 'Learn how VulNova calculates and interprets risk scores for your assets'
  },
  {
    id: 4,
    title: 'API Authentication Guide',
    category: 'API',
    views: 623,
    lastUpdated: '2024-06-20',
    description: 'Complete guide to authenticating and using the VulNova API'
  },
  {
    id: 5,
    title: 'Troubleshooting Common Issues',
    category: 'Troubleshooting',
    views: 1100,
    lastUpdated: '2024-07-02',
    description: 'Solutions to frequently encountered problems and error messages'
  },
  {
    id: 6,
    title: 'Custom Report Templates',
    category: 'Reporting',
    views: 445,
    lastUpdated: '2024-06-15',
    description: 'Create and customize report templates for your specific needs'
  }
];

let filteredArticles = [...knowledgeBaseArticles];

// Function to display support tickets
function displaySupportTickets() {
  const container = document.getElementById('supportTickets');
  if (!container) return;

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
        <span>Created: ${ticket.created}</span>
        <span>Updated: ${ticket.lastUpdate}</span>
      </div>
    </div>
  `).join('');
}

// Function to display system status
function displaySystemStatus() {
  const container = document.getElementById('systemStatus');
  if (!container) return;

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
}

// Function to display knowledge base articles
function displayKnowledgeBase(articles = filteredArticles) {
  const container = document.getElementById('knowledgeBase');
  if (!container) return;

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
        <span>Updated: ${article.lastUpdated}</span>
      </div>
    </div>
  `).join('');
}

// Function to search knowledge base
function searchKnowledgeBase() {
  const searchInput = document.getElementById('searchKB');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  
  filteredArticles = knowledgeBaseArticles.filter(article => {
    return !searchTerm || 
      article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      article.category.toLowerCase().includes(searchTerm);
  });
  
  displayKnowledgeBase(filteredArticles);
}

// Placeholder functions for actions
function openLiveChat() {
  alert('Opening Live Chat...\n\nConnecting you with a support representative.\nAverage wait time: 2 minutes');
}

function createTicket() {
  alert('Create Support Ticket\n\nTicket creation form would open here with fields for:\n• Issue category\n• Priority level\n• Detailed description\n• File attachments');
}

function openDocumentation() {
  alert('Opening Documentation Portal\n\nAccess comprehensive guides for:\n• Getting Started\n• API Reference\n• Integration Guides\n• Best Practices');
}

function viewVideoTutorials() {
  alert('Video Tutorial Library\n\nAccess video content including:\n• Platform Overview\n• Feature Walkthroughs\n• Integration Tutorials\n• Best Practices');
}

function viewFAQ() {
  alert('Frequently Asked Questions\n\nFind answers to common questions about:\n• Account Management\n• Feature Usage\n• Troubleshooting\n• Billing & Licensing');
}

function contactSupport() {
  alert('Contact Support Options\n\n• Phone: +1 (555) 123-4567\n• Email: support@vulnova.com\n• Live Chat: Available 9 AM - 6 PM EST\n• Emergency: 24/7 phone support');
}

function viewAllTickets() {
  alert('Navigate to complete support ticket history and management interface');
}

function viewStatusPage() {
  alert('Opening System Status Page\n\nReal-time status of all VulNova services and infrastructure components');
}

function viewTicketDetails(ticketId) {
  const ticket = supportTickets.find(t => t.id === ticketId);
  if (ticket) {
    alert(`Ticket Details: ${ticket.id}\n\nTitle: ${ticket.title}\nStatus: ${ticket.status}\nPriority: ${ticket.priority}\nCreated: ${ticket.created}\nLast Update: ${ticket.lastUpdate}`);
  }
}

function viewArticle(articleId) {
  const article = knowledgeBaseArticles.find(a => a.id === articleId);
  if (article) {
    alert(`Knowledge Base Article: ${article.title}\n\nCategory: ${article.category}\nViews: ${article.views}\nLast Updated: ${article.lastUpdated}\n\n${article.description}`);
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displaySupportTickets();
  displaySystemStatus();
  displayKnowledgeBase();
});