// Main application entry point - handles initialization and routing

import { loadPage, updateSidebarActiveState } from './navigation.js';
import { loadSidebar, loadHeader } from './components.js';
import { setupCityDropdown, updateCityName } from './dropdowns.js';
import { initializeCharts, initializeRefreshButtons, initializeChartTypeTabs } from './charts.js';
import { initializePeriodTabs, initializeReportsTabs, initializeSummaryBudgetTabs } from './tabs.js';
import { initializeDatePicker, initializeReportsDatePicker } from './datepicker.js';
import { detectUserCity, animateCounters } from './utils.js';
import { generateSchoolsData, renderAttendanceTable, initializeSearch } from './reports-data.js';

// Handle page-specific initialization
function handlePageInit(pageName) {
  // Initialize home page skeletons
  if (pageName === 'home') {
    setTimeout(() => {
      // Hide skeletons
      document.querySelectorAll('.home-card-skeleton').forEach(el => el.classList.add('hidden'));
      document.querySelector('.home-activity-skeleton')?.classList.add('hidden');
      
      // Show actual content
      document.querySelectorAll('.home-card-content').forEach(el => el.classList.remove('hidden'));
      document.querySelector('.home-activity-content')?.classList.remove('hidden');
    }, 800);
  }
  
  // Initialize charts if on analytics page
  if (pageName === 'analytics') {
    setTimeout(() => {
      initializeCharts();
      initializePeriodTabs();
      initializeDatePicker();
      initializeRefreshButtons();
      initializeChartTypeTabs();
      initializeSummaryBudgetTabs();
      animateCounters();
    }, 300);
  }
  
  // Initialize reports page
  if (pageName === 'reports') {
    setTimeout(() => {
      initializeReportsTabs();
      initializeReportsDatePicker();
      // Generate and render table data
      const tableData = generateSchoolsData();
      renderAttendanceTable(tableData);
      initializeSearch(tableData);
    }, 100);
  }
}

// Initialize app
async function init() {
  // Load sidebar and header components
  await loadSidebar((pageName) => loadPage(pageName, handlePageInit));
  await loadHeader(() => setupCityDropdown());
  
  // Show skeleton while detecting city
  const citySkeleton = document.getElementById('city-skeleton');
  const selectedCitySchoolsSpan = document.getElementById('selected-city-schools');
  
  // Detect user's city
  const detectedCity = await detectUserCity();
  console.log('Detected city:', detectedCity);
  
  // Hide skeleton and show city text
  if (citySkeleton) {
    citySkeleton.classList.add('hidden');
  }
  if (selectedCitySchoolsSpan) {
    selectedCitySchoolsSpan.classList.remove('hidden');
    updateCityName(detectedCity);
  }
  
  // Load saved page from localStorage or default to home
  const savedPage = localStorage.getItem('currentPage') || 'home';
  await loadPage(savedPage, handlePageInit);
  
  // Update active state for the saved page
  updateSidebarActiveState(savedPage);
}

// Load components when page loads
init();
