// Sidebar functionality
function toggleSubmenu(submenuId, clickedElement) {
  // Stop propagation to prevent parent menus from closing
  event.stopPropagation();
  
  const submenu = document.getElementById(submenuId);
  const chevron = clickedElement.querySelector('.submenu-chevron');
  
  // Toggle the submenu
  submenu.classList.toggle('hidden');
  
  // Rotate the chevron
  chevron.classList.toggle('rotate-180');
  
  // Store the state in localStorage
  const isOpen = !submenu.classList.contains('hidden');
  localStorage.setItem(`submenu-${submenuId}-state`, isOpen);
}

// Initialize sidebar
function initSidebar() {
  // Initialize submenu states from localStorage
  document.querySelectorAll('[id$="Submenu"]').forEach(submenu => {
    const isOpen = localStorage.getItem(`submenu-${submenu.id}-state`) === 'true';
    if (isOpen) {
      submenu.classList.remove('hidden');
      const chevron = submenu.previousElementSibling.querySelector('.submenu-chevron');
      if (chevron) chevron.classList.add('rotate-180');
    }
  });

  // Highlight current page in sidebar
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link[href]').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage) {
      link.classList.add('text-primary-700', 'font-semibold');
      link.classList.remove('text-gray-700');
      
      // Open parent menus if this is a submenu item
      let parentMenu = link.closest('[id$="Submenu"]');
      while (parentMenu) {
        parentMenu.classList.remove('hidden');
        const chevron = parentMenu.previousElementSibling.querySelector('.submenu-chevron');
        if (chevron) chevron.classList.add('rotate-180');
        parentMenu = parentMenu.parentElement.closest('[id$="Submenu"]');
      }
    }
  });

  // Handle sidebar link clicks
  document.querySelectorAll('.sidebar-link[href]').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('href') && this.getAttribute('href') !== '#') {
        e.preventDefault();
        window.location.href = this.getAttribute('href');
      }
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initSidebar);