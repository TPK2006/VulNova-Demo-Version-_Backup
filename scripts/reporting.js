// Initialize Lucide icons
lucide.createIcons();

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

// Fetch reports from API
async function fetchReports(limit = 5) {
  try {
    const response = await fetch(`/api/reports?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch reports');
    const data = await response.json();
    return data.reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
}

// Fetch report templates from API
async function fetchReportTemplates() {
  try {
    const response = await fetch('/api/report-templates');
    if (!response.ok) throw new Error('Failed to fetch templates');
    return await response.json();
  } catch (error) {
    console.error('Error fetching report templates:', error);
    return [];
  }
}

// Display reports in the table
async function displayReports() {
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
  
  const reports = await fetchReports();
  
  tbody.innerHTML = reports.map(report => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm font-medium text-gray-900">${report.name}</div>
        <div class="text-sm text-gray-500">${report.size} • ${report.format}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeColors[report.type] || 'bg-gray-100 text-gray-800'}">${report.type}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <div class="text-sm text-gray-900">${new Date(report.generated).toLocaleString()}</div>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[report.status] || 'bg-gray-100 text-gray-800'}">${report.status}</span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div class="flex space-x-2">
          ${report.status === 'Completed' ? `<button class="text-primary-600 hover:text-primary-900" onclick="downloadReport('${report._id}')">Download</button>` : ''}
          <button class="text-blue-600 hover:text-blue-900" onclick="viewReport('${report._id}')">View</button>
          <button class="text-gray-600 hover:text-gray-900" onclick="shareReport('${report._id}')">Share</button>
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

// Report Actions
async function downloadReport(id) {
  try {
    const response = await fetch(`/api/reports/${id}/download`);
    if (!response.ok) throw new Error('Failed to download report');
    const data = await response.json();
    
    // In a real implementation, this would trigger the actual download
    alert(`Downloading: ${data.name}\nSize: ${data.size}`);
    
    // Simulate download (would be replaced with actual file download)
    const a = document.createElement('a');
    a.href = data.downloadUrl;
    a.download = `${data.name}.${data.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading report:', error);
    alert('Failed to download report');
  }
}

async function viewReport(id) {
  try {
    const response = await fetch(`/api/reports/${id}`);
    if (!response.ok) throw new Error('Failed to fetch report');
    const report = await response.json();
    
    // In a real implementation, this would open a preview modal
    alert(`Viewing: ${report.name}\n\nGenerated: ${new Date(report.generated).toLocaleString()}\nType: ${report.type}\nStatus: ${report.status}`);
  } catch (error) {
    console.error('Error viewing report:', error);
    alert('Failed to view report');
  }
}

async function shareReport(id) {
  try {
    const response = await fetch(`/api/reports/${id}`);
    if (!response.ok) throw new Error('Failed to fetch report');
    const report = await response.json();
    
    // In a real implementation, this would open a share dialog
    alert(`Share options for: ${report.name}\n\n- Email\n- Secure Link\n- Export to Portal`);
  } catch (error) {
    console.error('Error sharing report:', error);
    alert('Failed to share report');
  }
}

// Report Generation Functions
async function generateExecutiveReport() {
  try {
    const templates = await fetchReportTemplates();
    const template = templates.find(t => t.type === 'Executive');
    
    if (template) {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Executive Summary - ${new Date().toLocaleDateString()}`,
          type: 'Executive',
          format: 'PDF',
          parameters: {
            timeframe: 'monthly',
            includeCharts: true
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      const result = await response.json();
      
      alert('Executive Summary Report generation started!\n\nThis report will include:\n- Risk score trends\n- Key security metrics\n- Compliance status\n- Executive recommendations');
      
      // Refresh the reports list after a short delay
      setTimeout(displayReports, 1000);
    }
  } catch (error) {
    console.error('Error generating executive report:', error);
    alert('Failed to start report generation');
  }
}

async function generateTechnicalReport() {
  try {
    const templates = await fetchReportTemplates();
    const template = templates.find(t => t.type === 'Technical');
    
    if (template) {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Technical Report - ${new Date().toLocaleDateString()}`,
          type: 'Technical',
          format: 'PDF',
          parameters: {
            includeVulnerabilities: true,
            includeRemediation: true
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      const result = await response.json();
      
      alert('Technical Report generation started!\n\nThis report will include:\n- Detailed vulnerability analysis\n- Asset inventory\n- Remediation priorities\n- Technical recommendations');
      
      setTimeout(displayReports, 1000);
    }
  } catch (error) {
    console.error('Error generating technical report:', error);
    alert('Failed to start report generation');
  }
}

async function generateComplianceReport() {
  try {
    const templates = await fetchReportTemplates();
    const template = templates.find(t => t.type === 'Compliance');
    
    if (template) {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Compliance Report - ${new Date().toLocaleDateString()}`,
          type: 'Compliance',
          format: 'PDF',
          parameters: {
            standards: ['SOC2', 'ISO27001'],
            includeEvidence: true
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      const result = await response.json();
      
      alert('Compliance Report generation started!\n\nThis report will include:\n- Regulatory compliance status\n- Audit findings\n- Control effectiveness\n- Remediation plans');
      
      setTimeout(displayReports, 1000);
    }
  } catch (error) {
    console.error('Error generating compliance report:', error);
    alert('Failed to start report generation');
  }
}

// Schedule Report Dialog
async function scheduleReport() {
  try {
    const templates = await fetchReportTemplates();
    
    // In a real implementation, this would open a modal dialog
    const templateList = templates.map(t => `- ${t.name} (${t.type})`).join('\n');
    const schedule = prompt(`Schedule a new report:\n\nAvailable templates:\n${templateList}\n\nEnter schedule (daily, weekly, monthly):`, 'weekly');
    
    if (schedule) {
      const response = await fetch('/api/reports/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          templateId: templates[0]._id, // Would select from UI in real implementation
          schedule: {
            frequency: schedule.toLowerCase(),
            time: '09:00'
          },
          recipients: ['security-team@example.com']
        })
      });
      
      if (!response.ok) throw new Error('Failed to schedule report');
      const result = await response.json();
      
      alert(`Report scheduled successfully!\nNext run: ${new Date(result.nextRun).toLocaleString()}`);
    }
  } catch (error) {
    console.error('Error scheduling report:', error);
    alert('Failed to schedule report');
  }
}

// View All Reports
function viewAllReports() {
  // In a real implementation, this would navigate to a reports archive page
  window.location.href = '/reports-archive.html';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  displayReports();
  setTimeout(initializeCharts, 100); // Small delay to ensure canvas elements are ready
  
  // Refresh reports every 30 seconds
  setInterval(displayReports, 30000);
});