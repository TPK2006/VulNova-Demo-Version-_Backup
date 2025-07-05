// Initialize Lucide icons
lucide.createIcons();

// Critical vulnerabilities data (120 items)
const criticalVulnerabilities = [
  {
    assetName: 'Server-001',
    ipAddress: '192.168.1.100',
    vulnerability: 'Log4j Remote Code Execution',
    cve: 'CVE-2021-44228',
    cvssScore: 10.0,
    status: 'Open',
    description: 'Apache Log4j2 contains a remote code execution vulnerability via the JNDI LDAP endpoint.',
    hostname: 'server-01',
    source: 'Orca Security'
  },
  {
    assetName: 'WebServer-02',
    ipAddress: '192.168.1.101',
    vulnerability: 'Spring4Shell Remote Code Execution',
    cve: 'CVE-2022-22965',
    cvssScore: 9.8,
    status: 'Open',
    description: 'Spring Framework contains a remote code execution vulnerability in the Data Binding mechanism.',
    hostname: 'web-02',
    source: 'Tenable'
  },
  {
    assetName: 'Database-01',
    ipAddress: '192.168.1.102',
    vulnerability: 'SQL Injection',
    cve: 'CVE-2023-1234',
    cvssScore: 9.5,
    status: 'Open',
    description: 'Multiple SQL injection vulnerabilities in database queries.',
    hostname: 'db-01',
    source: 'SonarQube'
  },
  {
    assetName: 'Firewall-01',
    ipAddress: '192.168.1.103',
    vulnerability: 'Authentication Bypass',
    cve: 'CVE-2023-5678',
    cvssScore: 9.0,
    status: 'Open',
    description: 'Authentication bypass vulnerability in firewall management interface.',
    hostname: 'fw-01',
    source: 'Orca Security'
  },
  {
    assetName: 'Laptop-023',
    ipAddress: '192.168.1.104',
    vulnerability: 'Privilege Escalation',
    cve: 'CVE-2023-9012',
    cvssScore: 8.8,
    status: 'Open',
    description: 'Local privilege escalation vulnerability in system service.',
    hostname: 'laptop-023',
    source: 'Tenable'
  },
  {
    assetName: 'Router-09',
    ipAddress: '192.168.1.105',
    vulnerability: 'Command Injection',
    cve: 'CVE-2023-3456',
    cvssScore: 9.1,
    status: 'Open',
    description: 'Command injection vulnerability in router management interface.',
    hostname: 'router-09',
    source: 'Orca Security'
  },
  {
    assetName: 'Switch-05',
    ipAddress: '192.168.1.106',
    vulnerability: 'Buffer Overflow',
    cve: 'CVE-2023-7890',
    cvssScore: 9.3,
    status: 'Open',
    description: 'Buffer overflow vulnerability in network switch firmware.',
    hostname: 'switch-05',
    source: 'Orca Security'
  },
  {
    assetName: 'Mobile-12',
    ipAddress: '192.168.1.107',
    vulnerability: 'Code Execution',
    cve: 'CVE-2023-2345',
    cvssScore: 8.9,
    status: 'Open',
    description: 'Remote code execution vulnerability in mobile application.',
    hostname: 'mobile-12',
    source: 'Tenable'
  }
];

// Generate additional critical vulnerabilities to reach 120 total
for (let i = 9; i <= 120; i++) {
  const assetTypes = ['Server', 'WebServer', 'Database', 'Firewall', 'Laptop', 'Router', 'Switch', 'Mobile', 'Workstation', 'IoT-Device'];
  const vulnTypes = [
    'Remote Code Execution', 'SQL Injection', 'Authentication Bypass', 'Privilege Escalation',
    'Command Injection', 'Buffer Overflow', 'Code Execution', 'Memory Corruption',
    'Integer Overflow', 'Use After Free', 'Double Free', 'Format String',
    'Race Condition', 'Time-of-Check Time-of-Use', 'Directory Traversal', 'XML External Entity'
  ];
  
  const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
  const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
  const cvssScore = (8.5 + Math.random() * 1.5).toFixed(1);
  
  criticalVulnerabilities.push({
    assetName: `${assetType}-${String(i).padStart(3, '0')}`,
    ipAddress: `192.168.1.${100 + i}`,
    vulnerability: `${vulnType}`,
    cve: `CVE-2023-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
    cvssScore: parseFloat(cvssScore),
    status: 'Open',
    description: `Critical ${vulnType.toLowerCase()} vulnerability requiring immediate attention.`,
    hostname: `${assetType.toLowerCase()}-${i}`,
    source: 'Orca Security'
  });
}

// High vulnerabilities data (340 items)
const highVulnerabilities = [
  {
    assetName: 'Server-002',
    ipAddress: '192.168.1.108',
    vulnerability: 'Cross-Site Scripting (XSS)',
    cve: 'CVE-2023-4567',
    cvssScore: 8.5,
    status: 'Open',
    description: 'Reflected XSS vulnerability in web application.',
    hostname: 'server-02',
    source: 'Tenable'
  },
  {
    assetName: 'WebServer-03',
    ipAddress: '192.168.1.109',
    vulnerability: 'Path Traversal',
    cve: 'CVE-2023-5678',
    cvssScore: 8.2,
    status: 'Open',
    description: 'Directory traversal vulnerability in file upload functionality.',
    hostname: 'web-03',
    source: 'SonarQube'
  },
  {
    assetName: 'Database-02',
    ipAddress: '192.168.1.110',
    vulnerability: 'Information Disclosure',
    cve: 'CVE-2023-6789',
    cvssScore: 7.8,
    status: 'Open',
    description: 'Sensitive information disclosure in error messages.',
    hostname: 'db-02',
    source: 'Orca Security'
  },
  {
    assetName: 'Firewall-02',
    ipAddress: '192.168.1.111',
    vulnerability: 'Weak Encryption',
    cve: 'CVE-2023-7890',
    cvssScore: 7.5,
    status: 'Open',
    description: 'Use of weak encryption algorithms in VPN configuration.',
    hostname: 'fw-02',
    source: 'Tenable'
  },
  {
    assetName: 'Laptop-024',
    ipAddress: '192.168.1.112',
    vulnerability: 'Memory Corruption',
    cve: 'CVE-2023-8901',
    cvssScore: 8.0,
    status: 'Open',
    description: 'Memory corruption vulnerability in system driver.',
    hostname: 'laptop-024',
    source: 'Orca Security'
  }
];

// Generate additional high vulnerabilities to reach 340 total
for (let i = 6; i <= 340; i++) {
  const assetTypes = ['Server', 'WebServer', 'Database', 'Firewall', 'Laptop', 'Router', 'Switch', 'Mobile', 'Workstation', 'IoT-Device'];
  const vulnTypes = [
    'Cross-Site Scripting (XSS)', 'Path Traversal', 'Information Disclosure', 'Weak Encryption',
    'Memory Corruption', 'Integer Overflow', 'Use After Free', 'Format String',
    'Race Condition', 'Directory Traversal', 'XML External Entity', 'Server-Side Request Forgery',
    'Cross-Site Request Forgery', 'Insecure Deserialization', 'Broken Authentication', 'Sensitive Data Exposure'
  ];
  
  const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
  const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
  const cvssScore = (7.0 + Math.random() * 1.5).toFixed(1);
  
  highVulnerabilities.push({
    assetName: `${assetType}-${String(i).padStart(3, '0')}`,
    ipAddress: `192.168.2.${100 + i}`,
    vulnerability: `${vulnType}`,
    cve: `CVE-2023-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
    cvssScore: parseFloat(cvssScore),
    status: 'Open',
    description: `High severity ${vulnType.toLowerCase()} vulnerability requiring attention within 30 days.`,
    hostname: `${assetType.toLowerCase()}-${i}`,
    source: 'Tenable'
  });
}

// Medium vulnerabilities data (1,200 items)
const mediumVulnerabilities = [
  {
    assetName: 'Server-003',
    ipAddress: '192.168.1.113',
    vulnerability: 'Outdated Software',
    cve: 'CVE-2023-9012',
    cvssScore: 6.5,
    status: 'Open',
    description: 'Multiple outdated software components with known vulnerabilities.',
    hostname: 'server-03',
    source: 'SonarQube'
  },
  {
    assetName: 'WebServer-04',
    ipAddress: '192.168.1.114',
    vulnerability: 'Missing Security Headers',
    cve: 'CVE-2023-0123',
    cvssScore: 5.8,
    status: 'Open',
    description: 'Missing security headers in web application responses.',
    hostname: 'web-04',
    source: 'Orca Security'
  },
  {
    assetName: 'Database-03',
    ipAddress: '192.168.1.115',
    vulnerability: 'Weak Password Policy',
    cve: 'CVE-2023-1234',
    cvssScore: 6.0,
    status: 'Open',
    description: 'Weak password policy enforcement in database authentication.',
    hostname: 'db-03',
    source: 'Tenable'
  },
  {
    assetName: 'Firewall-03',
    ipAddress: '192.168.1.116',
    vulnerability: 'Default Credentials',
    cve: 'CVE-2023-2345',
    cvssScore: 6.2,
    status: 'Open',
    description: 'Default credentials still in use on firewall management interface.',
    hostname: 'fw-03',
    source: 'Orca Security'
  },
  {
    assetName: 'Laptop-025',
    ipAddress: '192.168.1.117',
    vulnerability: 'Unpatched System',
    cve: 'CVE-2023-3456',
    cvssScore: 5.5,
    status: 'Open',
    description: 'System missing critical security patches.',
    hostname: 'laptop-025',
    source: 'Tenable'
  }
];

// Generate additional medium vulnerabilities to reach 1,200 total
for (let i = 6; i <= 1200; i++) {
  const assetTypes = ['Server', 'WebServer', 'Database', 'Firewall', 'Laptop', 'Router', 'Switch', 'Mobile', 'Workstation', 'IoT-Device'];
  const vulnTypes = [
    'Outdated Software', 'Missing Security Headers', 'Weak Password Policy', 'Default Credentials',
    'Unpatched System', 'Weak Cipher Suites', 'Missing Access Controls', 'Insecure Default Configuration',
    'Information Disclosure', 'Cross-Site Scripting (Reflected)', 'Directory Listing', 'Server Information Disclosure',
    'Weak Session Management', 'Insecure File Permissions', 'Missing Input Validation', 'Insecure Error Handling'
  ];
  
  const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
  const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
  const cvssScore = (4.0 + Math.random() * 2.5).toFixed(1);
  
  mediumVulnerabilities.push({
    assetName: `${assetType}-${String(i).padStart(3, '0')}`,
    ipAddress: `192.168.3.${100 + (i % 200)}`,
    vulnerability: `${vulnType}`,
    cve: `CVE-2023-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
    cvssScore: parseFloat(cvssScore),
    status: 'Open',
    description: `Medium severity ${vulnType.toLowerCase()} vulnerability requiring attention within 90 days.`,
    hostname: `${assetType.toLowerCase()}-${i}`,
    source: 'Orca Security'
  });
}

// Low vulnerabilities data (2,100 items)
const lowVulnerabilities = [
  {
    assetName: 'Server-004',
    ipAddress: '192.168.1.118',
    vulnerability: 'Information Disclosure',
    cve: 'CVE-2023-4567',
    cvssScore: 3.5,
    status: 'Open',
    description: 'Minor information disclosure in server response headers.',
    hostname: 'server-04',
    source: 'Tenable'
  },
  {
    assetName: 'WebServer-05',
    ipAddress: '192.168.1.119',
    vulnerability: 'Version Disclosure',
    cve: 'CVE-2023-5678',
    cvssScore: 2.8,
    status: 'Open',
    description: 'Software version information disclosed in HTTP headers.',
    hostname: 'web-05',
    source: 'SonarQube'
  },
  {
    assetName: 'Database-04',
    ipAddress: '192.168.1.120',
    vulnerability: 'Verbose Error Messages',
    cve: 'CVE-2023-6789',
    cvssScore: 3.0,
    status: 'Open',
    description: 'Verbose error messages in database queries.',
    hostname: 'db-04',
    source: 'Orca Security'
  },
  {
    assetName: 'Firewall-04',
    ipAddress: '192.168.1.121',
    vulnerability: 'Banner Disclosure',
    cve: 'CVE-2023-7890',
    cvssScore: 2.5,
    status: 'Open',
    description: 'Service banner discloses unnecessary information.',
    hostname: 'fw-04',
    source: 'Tenable'
  },
  {
    assetName: 'Laptop-026',
    ipAddress: '192.168.1.122',
    vulnerability: 'Debug Mode Enabled',
    cve: 'CVE-2023-8901',
    cvssScore: 3.2,
    status: 'Open',
    description: 'Debug mode enabled in production application.',
    hostname: 'laptop-026',
    source: 'Orca Security'
  }
];

// Generate additional low vulnerabilities to reach 2,100 total
for (let i = 6; i <= 2100; i++) {
  const assetTypes = ['Server', 'WebServer', 'Database', 'Firewall', 'Laptop', 'Router', 'Switch', 'Mobile', 'Workstation', 'IoT-Device'];
  const vulnTypes = [
    'Information Disclosure', 'Version Disclosure', 'Verbose Error Messages', 'Banner Disclosure',
    'Debug Mode Enabled', 'Directory Listing', 'Server Information Disclosure', 'Weak Session Management',
    'Insecure File Permissions', 'Missing Input Validation', 'Insecure Error Handling', 'Cross-Site Scripting (Stored)',
    'Weak Cipher Suites', 'Missing Access Controls', 'Insecure Default Configuration', 'Outdated Software'
  ];
  
  const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
  const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)];
  const cvssScore = (0.1 + Math.random() * 3.9).toFixed(1);
  
  lowVulnerabilities.push({
    assetName: `${assetType}-${String(i).padStart(3, '0')}`,
    ipAddress: `192.168.4.${100 + (i % 200)}`,
    vulnerability: `${vulnType}`,
    cve: `CVE-2023-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
    cvssScore: parseFloat(cvssScore),
    status: 'Open',
    description: `Low severity ${vulnType.toLowerCase()} vulnerability for monitoring and review.`,
    hostname: `${assetType.toLowerCase()}-${i}`,
    source: 'Tenable'
  });
}

// Sidebar toggle logic
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarHamburger = document.getElementById('sidebarHamburger');

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  const topHeader = document.getElementById('topHeader');
  
  if (sidebar.classList.contains('w-56')) {
    sidebar.classList.remove('w-56');
    sidebar.classList.add('w-16');
    mainContent.classList.remove('ml-56');
    mainContent.classList.add('ml-16');
    topHeader.classList.remove('left-56');
    topHeader.classList.add('left-16');
  } else {
    sidebar.classList.remove('w-16');
    sidebar.classList.add('w-56');
    mainContent.classList.remove('ml-16');
    mainContent.classList.add('ml-56');
    topHeader.classList.remove('left-16');
    topHeader.classList.add('left-56');
  }
  
  document.querySelectorAll('.sidebar-label').forEach(el => el.classList.toggle('hidden'));
}

if (sidebarToggle) sidebarToggle.onclick = toggleSidebar;
if (sidebarHamburger) sidebarHamburger.onclick = toggleSidebar;

// Mock data for riskiest assets
const riskiestAssets = [
  { name: 'Server-001', risk: 980, critical: 12, lastSeen: '2024-07-01' },
  { name: 'Laptop-023', risk: 920, critical: 8, lastSeen: '2024-07-02' },
  { name: 'Firewall-02', risk: 890, critical: 7, lastSeen: '2024-07-01' },
  { name: 'DB-Prod-12', risk: 870, critical: 6, lastSeen: '2024-07-03' },
  { name: 'Router-09', risk: 850, critical: 5, lastSeen: '2024-07-01' },
];

document.getElementById('riskiest-assets-tbody').innerHTML = riskiestAssets.map(a =>
  `<tr class='hover:bg-primary-50 cursor-pointer' onclick="window.location.href='assets.html#${a.name}'">
    <td class='py-1 px-3 border-b'>${a.name}</td>
    <td class='py-1 px-3 border-b'>${a.risk}</td>
    <td class='py-1 px-3 border-b'>${a.critical}</td>
    <td class='py-1 px-3 border-b'>${a.lastSeen}</td>
  </tr>`
).join('');

// Mock data for threat intelligence news
const threatNews = [
  { headline: 'New Ransomware Campaign Targets Healthcare', affected: 14, link: 'threat-intelligence.html#ransomware-healthcare' },
  { headline: 'Zero-Day in Major Firewall Detected', affected: 7, link: 'threat-intelligence.html#firewall-zeroday' },
  { headline: 'Critical OpenSSL Vulnerability', affected: 22, link: 'threat-intelligence.html#openssl-critical' },
];

document.getElementById('threat-news-list').innerHTML = threatNews.map(n =>
  `<li class='bg-primary-50 rounded p-3 flex flex-col cursor-pointer hover:bg-primary-100 transition-colors' onclick="window.location.href='${n.link}'">
    <span class='font-semibold text-primary-800'>${n.headline}</span>
    <span class='text-sm text-gray-600'>Affected assets: <span class='font-bold text-primary-700'>${n.affected}</span></span>
    <span class='text-xs text-primary-600 mt-1'>Read more →</span>
  </li>`
).join('');

// Mock data for assets missing EDR
const missingEDR = [
  'Workstation-12', 'Server-22', 'Laptop-45', 'IoT-Device-7', 'Printer-3', 'Switch-8', 'Mobile-19', 'Server-33', 'Laptop-77', 'Router-2'
];

document.getElementById('missing-edr-list').innerHTML = missingEDR.slice(0, 5).map(a => `<li>${a}</li>`).join('');
document.getElementById('missing-edr-count').textContent = 37;

// Mock data for assets not getting scanned
const notScanned = [
  'Server-12', 'Laptop-21', 'Firewall-3', 'Switch-5', 'Mobile-7', 'Printer-2', 'IoT-Device-2', 'Server-23', 'Laptop-31', 'Router-1'
];

document.getElementById('not-scanned-list').innerHTML = notScanned.slice(0, 5).map(a => `<li>${a}</li>`).join('');
document.getElementById('not-scanned-count').textContent = 22;

if (sidebarHamburger) {
  sidebarHamburger.onclick = function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('mobile-open');
  };
}