// Initialize Lucide icons
lucide.createIcons();

// Sample reports data
const reports = [
  {
    id: 1,
    name: 'Monthly Security Executive Summary - July 2024',
    type: 'Executive',
    generated: '2024-07-04 09:00',
    status: 'Completed',
    size: '2.3 MB',
    format: 'PDF'
  },
  {
    id: 2,
    name: 'Vulnerability Assessment Report - Q2 2024',
    type: 'Technical',
    generated: '2024-07-01 14:30',
    status: 'Completed',
    size: '15.7 MB',
    format: 'PDF'
  },
  {
    id: 3,
    name: 'SOC 2 Compliance Report - June 2024',
    type: 'Compliance',
    generated: '2024-06-30 16:45',
    status: 'Completed',
    size: '8.9 MB',
    format: 'PDF'
  },
  {
    id: 4,
    name: 'Weekly Threat Intelligence Brief',
    type: 'Intelligence',
    generated: '2024-07-04 08:00',
    status: 'Scheduled',
    size: '-',
    format: 'PDF'
  },
  {
    id: 5,
    name: 'Asset Inventory Report - July 2024',
    type: 'Technical',
    generated: '2024-07-03 11:20',
    status: 'Completed',
    size: '4.2 MB',
    format: 'Excel'
  }
];

// Sidebar toggle logic
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarHamburger = document.getElementById('sidebarHamburger');
const topHeader = document.getElementById('topHeader');
const mainContent = document.getElementById('mainContent');

function toggleSidebar() {
  sidebar.classList.toggle('w-56');
  sidebar.classList.toggle('w-16');
  document.querySelectorAll('.sidebar-label').forEach(el => el.classList.toggle('hidden'));
  topHeader.classList.toggle('left-56');
  topHeader.classList.toggle('left-16');
  mainContent.classList.toggle('ml-56');
  mainContent.classList.toggle('ml-16');
}
if (sidebarToggle) sidebarToggle.onclick = toggleSidebar;
if (sidebarHamburger) sidebarHamburger.onclick = toggleSidebar;

// Function to display reports in the table
function displayReports() {
  const tbody = document.getElementById('reportsTableBody');
  if (!tbody) return;
  
  const statusColors = {
    'Completed': 'bg-green-100 text-green-800',
    'Scheduled': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Failed': 'bg-red-100 text-red-800'
  };

  const typeColors = {
    'Executive': 'bg-blue-100 text-blue-800',
    'Technical': 'bg-green-100 text-green-800',
    'Compliance': 'bg-purple-100 text-purple-800',
    'Intelligence': 'bg-orange-100 text-orange-800'
  };
  
  tbody.innerHTML = reports.map(report => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${report.name}</div>
        <div class="text-sm text-gray-500">${report.size} • ${report.format}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[report.type]}">${report.type}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${report.generated}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[report.status]}">${report.status}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          ${report.status === 'Completed' ? `<button class="text-primary-600 hover:text-primary-900" onclick="downloadReport(${report.id})">Download</button>` : ''}
          <button class="text-blue-600 hover:text-blue-900" onclick="viewReport(${report.id})">View</button>
          <button class="text-gray-600 hover:text-gray-900" onclick="shareReport(${report.id})">Share</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Initialize charts
function initializeCharts() {
  // Vulnerability Trends Chart
  const vulnCtx = document.getElementById('vulnerabilityTrendsChart').getContext('2d');
  new Chart(vulnCtx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Critical',
          data: [115, 120, 118, 120],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4
        },
        {
          label: 'High',
          data: [350, 340, 345, 340],
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.4
        },
        {
          label: 'Medium',
          data: [1180, 1200, 1195, 1200],
          borderColor: 'rgb(234, 179, 8)',
          backgroundColor: 'rgba(234, 179, 8, 0.1)',
          tension: 0.4
        },
        {
          label: 'Low',
          data: [2080, 2100, 2095, 2100],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Risk Distribution Chart
  const riskCtx = document.getElementById('riskDistributionChart').getContext('2d');
  new Chart(riskCtx, {
    type: 'doughnut',
    data: {
      labels: ['Critical Risk', 'High Risk', 'Medium Risk', 'Low Risk'],
      datasets: [{
        data: [59, 187, 456, 545],
        backgroundColor: [
          'rgb(239, 68, 68)',
          'rgb(249, 115, 22)',
          'rgb(234, 179, 8)',
          'rgb(34, 197, 94)'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        }
      }
    }
  });
}

// Placeholder functions for actions
function scheduleReport() {
  alert('Schedule report dialog would open here');
}

function generateReport() {
  alert('Generate custom report dialog would open here');
}

function generateExecutiveReport() {
  alert('Generating Executive Summary Report...\n\nThis report will include:\n- Risk score trends\n- Key security metrics\n- Compliance status\n- Executive recommendations');
}

function generateTechnicalReport() {
  alert('Generating Technical Report...\n\nThis report will include:\n- Detailed vulnerability analysis\n- Asset inventory\n- Remediation priorities\n- Technical recommendations');
}

function generateComplianceReport() {
  alert('Generating Compliance Report...\n\nThis report will include:\n- Regulatory compliance status\n- Audit findings\n- Control effectiveness\n- Remediation plans');
}

function downloadReport(id) {
  const report = reports.find(r => r.id === id);
  if (report) {
    alert(`Downloading: ${report.name}`);
  }
}

function viewReport(id) {
  const report = reports.find(r => r.id === id);
  if (report) {
    alert(`Opening: ${report.name}`);
  }
}

function shareReport(id) {
  const report = reports.find(r => r.id === id);
  if (report) {
    alert(`Share options for: ${report.name}\n\n- Email\n- Secure Link\n- Export to Portal`);
  }
}

function viewAllReports() {
  alert('Navigate to full reports archive');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayReports();
  setTimeout(initializeCharts, 100); // Small delay to ensure canvas elements are ready
});