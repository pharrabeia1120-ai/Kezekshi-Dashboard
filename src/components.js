// Components module - handles loading sidebar and header components

import { setupSidebarNavigation } from './navigation.js';

// Setup user profile dropdown
function setupUserProfileDropdown() {
  const profileBtn = document.getElementById('user-profile-btn');
  const dropdown = document.getElementById('user-profile-dropdown');
  
  if (!profileBtn || !dropdown) return;
  
  // Toggle dropdown on button click
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add('hidden');
    }
  });
  
  // Close dropdown when clicking on menu items
  const menuItems = dropdown.querySelectorAll('a');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      dropdown.classList.add('hidden');
    });
  });
}

// Load sidebar component
export async function loadSidebar(onNavigate) {
  try {
    const response = await fetch('/components/sidebar.html');
    const html = await response.text();
    document.getElementById('sidebar-container').innerHTML = html;
    
    // Setup navigation after sidebar is loaded
    setupSidebarNavigation(onNavigate);
    
    // Setup user profile dropdown
    setupUserProfileDropdown();
  } catch (error) {
    console.error('Error loading sidebar:', error);
  }
}

// Load header component
export async function loadHeader(onHeaderLoaded) {
  try {
    const response = await fetch('/components/header.html');
    const html = await response.text();
    document.getElementById('header-container').innerHTML = html;
    
    // Call callback after header is loaded
    if (onHeaderLoaded) {
      onHeaderLoaded();
    }
  } catch (error) {
    console.error('Error loading header:', error);
  }
}
