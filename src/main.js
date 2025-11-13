// Main application entry point - handles initialization and routing

import { loadPage, updateSidebarActiveState } from './navigation.js';
import { loadSidebar, loadHeader } from './components.js';
import { setupCityDropdown, updateCityName } from './dropdowns.js';
import { initializeCharts, initializeRefreshButtons, initializeChartTypeTabs } from './charts.js';
import { initializePeriodTabs, initializeReportsTabs, initializeSummaryBudgetTabs } from './tabs.js';
import { initializeDatePicker, initializeReportsDatePicker } from './datepicker.js';
import { detectUserCity, animateCounters } from './utils.js';
import { generateSchoolsData, renderAttendanceTable, initializeSearch } from './reports-data.js';
import { validatePageName } from './security.js';
import { initErrorHandlers } from './error-handler.js';
import { logger } from './logger.js';
import { CONFIG } from './config.js';

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
    }, CONFIG.CHART_INIT_DELAY);
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
  try {
    // Initialize error handlers
    initErrorHandlers();
    
    // Load sidebar and header components
    await loadSidebar((pageName) => loadPage(pageName, handlePageInit));
    await loadHeader(() => setupCityDropdown());
    
    // Show skeleton while detecting city
    const citySkeleton = document.getElementById('city-skeleton');
    const selectedCitySchoolsSpan = document.getElementById('selected-city-schools');
    
    // Detect user's city
    const detectedCity = await detectUserCity();
    logger.debug('Detected city:', detectedCity);
    
    // Hide skeleton and show city text
    if (citySkeleton) {
      citySkeleton.classList.add('hidden');
    }
    if (selectedCitySchoolsSpan) {
      selectedCitySchoolsSpan.classList.remove('hidden');
      updateCityName(detectedCity);
    }
    
    // Load saved page from localStorage with validation
    const savedPage = localStorage.getItem('currentPage');
    const validatedPage = validatePageName(savedPage);
    await loadPage(validatedPage, handlePageInit);
    
    // Update active state for the saved page
    updateSidebarActiveState(validatedPage);
  } catch (error) {
    logger.error('Failed to initialize app:', error);
    // Show error page or fallback
    document.getElementById('main-content').innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Ошибка загрузки</h2>
          <p class="text-gray-600">Не удалось загрузить приложение. Пожалуйста, обновите страницу.</p>
          <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Обновить страницу
          </button>
        </div>
      </div>
    `;
  }
}

// Load components when page loads
init();
