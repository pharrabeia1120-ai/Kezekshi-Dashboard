// Tabs module - handles period tabs, chart type tabs, and reports tabs

import { getCurrentPage } from './navigation.js';
import { updateChartsWithFilters } from './charts.js';
import { updateDatePickerForPeriod } from './datepicker.js';
import { generateSchoolsData, renderAttendanceTable } from './reports-data.js';
import { logger } from './logger.js';

// Global state for period
export let currentPeriod = 'day';
export let currentDateRange = null;

// Set period
export function setPeriod(period) {
  currentPeriod = period;
}

// Set date range
export function setDateRange(range) {
  currentDateRange = range;
}

// Initialize period tabs
export function initializePeriodTabs() {
  const tabs = document.querySelectorAll('.period-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active state from all tabs
      tabs.forEach(t => {
        t.classList.remove('bg-white', 'text-blue-600', 'tab-active');
        t.classList.add('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-100');
      });
      
      // Add active state to clicked tab
      tab.classList.remove('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-100');
      tab.classList.add('bg-white', 'text-blue-600', 'tab-active');
      
      // Get selected period
      const period = tab.getAttribute('data-period');
      currentPeriod = period;
      logger.debug('Selected period:', period);
      
      // Update date picker to show the selected period
      updateDatePickerForPeriod(period);
      
      // Update charts based on selected period
      if (getCurrentPage() === 'analytics') {
        updateChartsWithFilters();
      }
    });
  });
}

// Initialize Reports Tabs
export function initializeReportsTabs() {
  const tabs = document.querySelectorAll('.reports-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active state from all tabs
      tabs.forEach(t => {
        t.classList.remove('bg-white', 'text-blue-600', 'tab-active');
        t.classList.add('text-gray-700');
      });
      
      // Add active state to clicked tab
      tab.classList.remove('text-gray-700');
      tab.classList.add('bg-white', 'text-blue-600', 'tab-active');
      
      // Get selected category
      const category = tab.getAttribute('data-category');
      logger.debug('Selected category:', category);
      
      // Hide all content sections
      document.getElementById('attendance-content')?.classList.add('hidden');
      document.getElementById('cafeteria-content')?.classList.add('hidden');
      document.getElementById('library-content')?.classList.add('hidden');
      
      // Show selected content
      document.getElementById(`${category}-content`)?.classList.remove('hidden');
    });
  });
  
  // Initialize reports period tabs
  initializeReportsPeriodTabs();
}

// Initialize Reports Period Tabs (called after page load)
export function initializeReportsPeriodTabs() {
  const periodTabs = document.querySelectorAll('.reports-period-tab');
  
  periodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active state from all period tabs
      periodTabs.forEach(t => {
        t.classList.remove('bg-white', 'text-blue-600', 'tab-active');
        t.classList.add('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-100');
      });
      
      // Add active state to clicked tab
      tab.classList.remove('text-gray-700', 'hover:text-gray-900', 'hover:bg-gray-100');
      tab.classList.add('bg-white', 'text-blue-600', 'tab-active');
      
      // Get selected period
      const period = tab.getAttribute('data-period');
      logger.debug('Selected reports period:', period);
      
      // Update reports data based on period
      updateReportsPeriod(period);
    });
  });
}

// Update reports data based on selected period
function updateReportsPeriod(period) {
  // This function will be called when period changes
  logger.debug('Updating reports for period:', period);
  
  // Regenerate table data with period-specific logic
  const tableData = generateSchoolsData();
  
  // Apply period multiplier to simulate different data for different periods
  const periodMultiplier = {
    'today': 1.0,
    'yesterday': 0.95,
    'week': 1.1,
    'month': 1.3
  };
  
  const multiplier = periodMultiplier[period] || 1.0;
  
  // Adjust data based on period
  const adjustedData = tableData.map(row => ({
    ...row,
    system: {
      ...row.system,
      students14: Math.floor(row.system.students14 * multiplier),
      students511: Math.floor(row.system.students511 * multiplier),
      totalStudents: Math.floor(row.system.totalStudents * multiplier),
      staff: Math.floor(row.system.staff * multiplier)
    },
    attended: {
      ...row.attended,
      students14: Math.floor(row.attended.students14 * multiplier),
      students511: Math.floor(row.attended.students511 * multiplier),
      staff: Math.floor(row.attended.staff * multiplier),
      percentage: row.attended.percentage
    },
    nutrition14: {
      ...row.nutrition14,
      received: Math.floor(row.nutrition14.received * multiplier),
      notReceived: Math.floor(row.nutrition14.notReceived * multiplier)
    },
    nutrition511: {
      ...row.nutrition511,
      received: Math.floor(row.nutrition511.received * multiplier),
      notReceived: Math.floor(row.nutrition511.notReceived * multiplier)
    }
  }));
  
  // Re-render table with adjusted data
  renderAttendanceTable(adjustedData);
  
  logger.debug(`Reports table updated for period: ${period}`);
}

// Initialize Summary/Budget Tabs
export function initializeSummaryBudgetTabs() {
  const summaryTabBtn = document.getElementById('summary-tab-btn');
  const budgetTabBtn = document.getElementById('budget-tab-btn');
  const summaryContent = document.getElementById('summary-tab-content');
  const budgetContent = document.getElementById('budget-tab-content');
  
  if (!summaryTabBtn || !budgetTabBtn) return;
  
  summaryTabBtn.addEventListener('click', () => {
    // Update tab styles - active state
    summaryTabBtn.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700');
    summaryTabBtn.classList.add('border-blue-600', 'text-blue-600');
    
    // Remove active state from budget tab
    budgetTabBtn.classList.remove('border-blue-600', 'text-blue-600');
    budgetTabBtn.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700');
    
    // Show/hide content
    summaryContent.classList.remove('hidden');
    budgetContent.classList.add('hidden');
  });
  
  budgetTabBtn.addEventListener('click', () => {
    // Update tab styles - active state
    budgetTabBtn.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700');
    budgetTabBtn.classList.add('border-blue-600', 'text-blue-600');
    
    // Remove active state from summary tab
    summaryTabBtn.classList.remove('border-blue-600', 'text-blue-600');
    summaryTabBtn.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700');
    
    // Show/hide content
    budgetContent.classList.remove('hidden');
    summaryContent.classList.add('hidden');
  });
}
