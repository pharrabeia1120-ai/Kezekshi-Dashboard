// Datepicker module - handles date picker functionality

import { getCurrentPage } from './navigation.js';
import { updateChartsWithFilters } from './charts.js';
import { setDateRange } from './tabs.js';
import { renderAttendanceTable, generateSchoolsData } from './reports-data.js';

// Update date picker display based on selected period (Day/Week/Month)
export function updateDatePickerForPeriod(period) {
  const selectedDateText = document.getElementById('selected-date-text');
  if (!selectedDateText) return;
  
  const today = new Date();
  let startDate, endDate;
  let displayText = '';
  
  switch(period) {
    case 'day':
      // Set to today
      startDate = new Date(today);
      endDate = new Date(today);
      setDateRange({ start: startDate, end: endDate });
      
      displayText = startDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      selectedDateText.textContent = displayText;
      break;
      
    case 'yesterday':
      // Set to yesterday
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 1);
      endDate = new Date(startDate);
      setDateRange({ start: startDate, end: endDate });
      
      displayText = startDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      selectedDateText.textContent = displayText;
      break;
      
    case 'week':
      // Set to current week (Monday to Sunday)
      const dayOfWeek = today.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday (0), go back 6 days
      
      startDate = new Date(today);
      startDate.setDate(today.getDate() + diffToMonday);
      
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); // Sunday
      
      setDateRange({ start: startDate, end: endDate });
      
      const formattedWeekStart = startDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short'
      });
      const formattedWeekEnd = endDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric' 
      });
      
      displayText = `${formattedWeekStart} - ${formattedWeekEnd}`;
      selectedDateText.textContent = displayText;
      break;
      
    case 'month':
      // Set to current month (first day to last day)
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of month
      
      setDateRange({ start: startDate, end: endDate });
      
      const formattedMonthStart = startDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short'
      });
      const formattedMonthEnd = endDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric' 
      });
      
      displayText = `${formattedMonthStart} - ${formattedMonthEnd}`;
      selectedDateText.textContent = displayText;
      break;
  }
  
  // Update summary cards date displays
  const summaryDateDisplay = document.getElementById('summary-date-display');
  const financeDateDisplay = document.getElementById('finance-date-display');
  if (summaryDateDisplay && displayText) summaryDateDisplay.textContent = displayText;
  if (financeDateDisplay && displayText) financeDateDisplay.textContent = displayText;
  
  console.log('Date picker updated for period:', period);
}

// Initialize date picker
export function initializeDatePicker() {
  const calendarTrigger = document.getElementById('calendar-trigger');
  const datepickerContainer = document.getElementById('datepicker-container');
  const prevMonth = document.getElementById('prevMonth');
  const nextMonth = document.getElementById('nextMonth');
  const currentMonthEl = document.getElementById('currentMonth');
  const daysContainer = document.getElementById('days-container');
  const applyButton = document.getElementById('applyButton');
  const cancelButton = document.getElementById('cancelButton');
  const selectedDateText = document.getElementById('selected-date-text');

  let currentDate = new Date();
  let startDate = null;
  let endDate = null;

  if (!calendarTrigger || !datepickerContainer) return;

  // Toggle calendar visibility
  calendarTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    datepickerContainer.classList.toggle('hidden');
    if (!datepickerContainer.classList.contains('hidden')) {
      renderCalendar();
    }
  });

  // Close calendar when clicking outside
  document.addEventListener('click', (e) => {
    if (!datepickerContainer.contains(e.target) && !calendarTrigger.contains(e.target)) {
      datepickerContainer.classList.add('hidden');
    }
  });

  // Previous month
  prevMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  // Next month
  nextMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Cancel button
  cancelButton.addEventListener('click', () => {
    startDate = null;
    endDate = null;
    datepickerContainer.classList.add('hidden');
    renderCalendar();
  });

  // Apply button
  applyButton.addEventListener('click', () => {
    if (startDate && endDate) {
      const formattedStart = startDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short'
      });
      const formattedEnd = endDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric' 
      });
      const dateRangeText = `${formattedStart} - ${formattedEnd}`;
      selectedDateText.textContent = dateRangeText;
      setDateRange({ start: startDate, end: endDate });
      console.log('Selected period:', startDate, '-', endDate);
      
      // Update summary cards date displays
      const summaryDateDisplay = document.getElementById('summary-date-display');
      const financeDateDisplay = document.getElementById('finance-date-display');
      if (summaryDateDisplay) summaryDateDisplay.textContent = dateRangeText;
      if (financeDateDisplay) financeDateDisplay.textContent = dateRangeText;
      
      // Update charts based on selected date range
      if (getCurrentPage() === 'analytics') {
        updateChartsWithFilters();
      }
    } else if (startDate) {
      const formattedDate = startDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      selectedDateText.textContent = formattedDate;
      setDateRange({ start: startDate, end: startDate });
      console.log('Selected date:', startDate);
      
      // Update summary cards date displays
      const summaryDateDisplay = document.getElementById('summary-date-display');
      const financeDateDisplay = document.getElementById('finance-date-display');
      if (summaryDateDisplay) summaryDateDisplay.textContent = formattedDate;
      if (financeDateDisplay) financeDateDisplay.textContent = formattedDate;
      
      // Update charts based on selected date
      if (getCurrentPage() === 'analytics') {
        updateChartsWithFilters();
      }
    }
    datepickerContainer.classList.add('hidden');
  });

  // Render calendar
  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update month/year display
    currentMonthEl.textContent = new Date(year, month).toLocaleDateString('ru-RU', { 
      month: 'long', 
      year: 'numeric' 
    });

    // Clear days container
    daysContainer.innerHTML = '';

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      const emptyDay = document.createElement('div');
      daysContainer.appendChild(emptyDay);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayButton = document.createElement('button');
      dayButton.textContent = day;
      dayButton.className = 'p-2 text-sm rounded transition-colors';

      const dayDate = new Date(year, month, day);
      const today = new Date();
      
      // Highlight today
      if (dayDate.toDateString() === today.toDateString()) {
        dayButton.classList.add('border', 'border-blue-600');
      }

      // Highlight start date
      if (startDate && dayDate.toDateString() === startDate.toDateString()) {
        dayButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700', 'rounded-l-lg');
      }

      // Highlight end date
      if (endDate && dayDate.toDateString() === endDate.toDateString()) {
        dayButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700', 'rounded-r-lg');
      }

      // Highlight dates in range
      if (startDate && endDate && dayDate > startDate && dayDate < endDate) {
        dayButton.classList.add('bg-blue-100', 'text-blue-700', 'rounded-none');
      }
      
      // Add hover effect to show potential range
      if (startDate && !endDate) {
        dayButton.addEventListener('mouseenter', () => {
          highlightHoverRange(dayDate);
        });
        
        dayButton.addEventListener('mouseleave', () => {
          renderCalendar();
        });
      }

      dayButton.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // If no start date or both dates are set, start new selection
        if (!startDate || (startDate && endDate)) {
          startDate = dayDate;
          endDate = null;
        } 
        // If start date is set but no end date
        else if (startDate && !endDate) {
          // If clicked date is before start date, swap them
          if (dayDate < startDate) {
            endDate = startDate;
            startDate = dayDate;
          } else {
            endDate = dayDate;
          }
        }
        
        updateRangeDisplay();
        renderCalendar(); // Re-render to show selection
      });

      daysContainer.appendChild(dayButton);
    }
    
    updateRangeDisplay();
  }
  
  // Highlight hover range preview
  function highlightHoverRange(hoverDate) {
    if (!startDate || endDate) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const buttons = daysContainer.querySelectorAll('button');
    
    buttons.forEach((btn, index) => {
      const day = parseInt(btn.textContent);
      if (!day) return;
      
      const dayDate = new Date(year, month, day);
      
      // Reset classes
      btn.className = 'p-2 text-sm rounded transition-colors';
      
      // Re-apply today border
      const today = new Date();
      if (dayDate.toDateString() === today.toDateString()) {
        btn.classList.add('border', 'border-blue-600');
      }
      
      // Highlight start date
      if (dayDate.toDateString() === startDate.toDateString()) {
        btn.classList.add('bg-blue-600', 'text-white', 'rounded-l-lg');
      }
      
      // Highlight hover range
      const minDate = hoverDate < startDate ? hoverDate : startDate;
      const maxDate = hoverDate > startDate ? hoverDate : startDate;
      
      if (dayDate > minDate && dayDate < maxDate) {
        btn.classList.add('bg-blue-100', 'text-blue-700', 'rounded-none');
      }
      
      // Highlight potential end date
      if (dayDate.toDateString() === hoverDate.toDateString() && dayDate.toDateString() !== startDate.toDateString()) {
        btn.classList.add('bg-blue-400', 'text-white', 'rounded-r-lg');
      }
    });
  }
  
  // Update selected range display
  function updateRangeDisplay() {
    const rangeDisplay = document.getElementById('selected-range-display');
    const rangeText = document.getElementById('range-text');
    
    if (!rangeDisplay || !rangeText) return;
    
    if (startDate && endDate) {
      const formatDate = (date) => date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
      rangeText.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      rangeDisplay.classList.remove('hidden');
    } else if (startDate) {
      rangeText.textContent = `Начало: ${startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })} (выберите конечную дату)`;
      rangeDisplay.classList.remove('hidden');
    } else {
      rangeDisplay.classList.add('hidden');
    }
  }
  
  // Set initial date display for today
  updateDatePickerForPeriod('day');
}

// Initialize date picker for Reports page
export function initializeReportsDatePicker() {
  const calendarTrigger = document.getElementById('reports-calendar-trigger');
  const datepickerContainer = document.getElementById('reports-datepicker-container');
  const prevMonth = document.getElementById('reports-prevMonth');
  const nextMonth = document.getElementById('reports-nextMonth');
  const currentMonthEl = document.getElementById('reports-currentMonth');
  const daysContainer = document.getElementById('reports-days-container');
  const applyButton = document.getElementById('reports-applyButton');
  const cancelButton = document.getElementById('reports-cancelButton');
  const selectedDateText = document.getElementById('reports-selected-date-text');

  let currentDate = new Date();
  let startDate = null;
  let endDate = null;

  if (!calendarTrigger || !datepickerContainer) return;

  // Toggle calendar visibility
  calendarTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    datepickerContainer.classList.toggle('hidden');
    if (!datepickerContainer.classList.contains('hidden')) {
      renderCalendar();
    }
  });

  // Close calendar when clicking outside
  document.addEventListener('click', (e) => {
    if (!datepickerContainer.contains(e.target) && !calendarTrigger.contains(e.target)) {
      datepickerContainer.classList.add('hidden');
    }
  });

  // Previous month
  prevMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  // Next month
  nextMonth.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  // Cancel button
  cancelButton.addEventListener('click', () => {
    startDate = null;
    endDate = null;
    datepickerContainer.classList.add('hidden');
    renderCalendar();
  });

  // Apply button
  applyButton.addEventListener('click', () => {
    if (startDate && endDate) {
      const formattedStart = startDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short'
      });
      const formattedEnd = endDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric' 
      });
      selectedDateText.textContent = `${formattedStart} - ${formattedEnd}`;
      console.log('Reports: Selected period:', startDate, '-', endDate);
      
      // Update table based on selected date range
      if (getCurrentPage() === 'reports') {
        const tableData = generateSchoolsData();
        renderAttendanceTable(tableData);
      }
    } else if (startDate) {
      const formattedDate = startDate.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
      selectedDateText.textContent = formattedDate;
      console.log('Reports: Selected date:', startDate);
      
      // Update table based on selected date
      if (getCurrentPage() === 'reports') {
        const tableData = generateSchoolsData();
        renderAttendanceTable(tableData);
      }
    }
    datepickerContainer.classList.add('hidden');
  });

  // Render calendar
  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update month/year display
    currentMonthEl.textContent = new Date(year, month).toLocaleDateString('ru-RU', { 
      month: 'long', 
      year: 'numeric' 
    });

    // Clear days container
    daysContainer.innerHTML = '';

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      const emptyDay = document.createElement('div');
      daysContainer.appendChild(emptyDay);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayButton = document.createElement('button');
      dayButton.textContent = day;
      dayButton.className = 'p-2 text-sm rounded transition-colors';

      const dayDate = new Date(year, month, day);
      const today = new Date();
      
      // Highlight today
      if (dayDate.toDateString() === today.toDateString()) {
        dayButton.classList.add('border', 'border-blue-600');
      }

      // Highlight start date
      if (startDate && dayDate.toDateString() === startDate.toDateString()) {
        dayButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700', 'rounded-l-lg');
      }

      // Highlight end date
      if (endDate && dayDate.toDateString() === endDate.toDateString()) {
        dayButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700', 'rounded-r-lg');
      }

      // Highlight dates in range
      if (startDate && endDate && dayDate > startDate && dayDate < endDate) {
        dayButton.classList.add('bg-blue-100', 'text-blue-700', 'rounded-none');
      }
      
      // Add hover effect to show potential range
      if (startDate && !endDate) {
        dayButton.addEventListener('mouseenter', () => {
          highlightHoverRange(dayDate);
        });
        
        dayButton.addEventListener('mouseleave', () => {
          renderCalendar();
        });
      }

      dayButton.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // If no start date or both dates are set, start new selection
        if (!startDate || (startDate && endDate)) {
          startDate = dayDate;
          endDate = null;
        } 
        // If start date is set but no end date
        else if (startDate && !endDate) {
          // If clicked date is before start date, swap them
          if (dayDate < startDate) {
            endDate = startDate;
            startDate = dayDate;
          } else {
            endDate = dayDate;
          }
        }
        
        updateRangeDisplay();
        renderCalendar(); // Re-render to show selection
      });

      daysContainer.appendChild(dayButton);
    }
    
    updateRangeDisplay();
  }
  
  // Highlight hover range preview
  function highlightHoverRange(hoverDate) {
    if (!startDate || endDate) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const buttons = daysContainer.querySelectorAll('button');
    
    buttons.forEach((btn, index) => {
      const day = parseInt(btn.textContent);
      if (!day) return;
      
      const dayDate = new Date(year, month, day);
      
      // Reset classes
      btn.className = 'p-2 text-sm rounded transition-colors';
      
      // Re-apply today border
      const today = new Date();
      if (dayDate.toDateString() === today.toDateString()) {
        btn.classList.add('border', 'border-blue-600');
      }
      
      // Highlight start date
      if (dayDate.toDateString() === startDate.toDateString()) {
        btn.classList.add('bg-blue-600', 'text-white', 'rounded-l-lg');
      }
      
      // Highlight hover range
      const minDate = hoverDate < startDate ? hoverDate : startDate;
      const maxDate = hoverDate > startDate ? hoverDate : startDate;
      
      if (dayDate > minDate && dayDate < maxDate) {
        btn.classList.add('bg-blue-100', 'text-blue-700', 'rounded-none');
      }
      
      // Highlight potential end date
      if (dayDate.toDateString() === hoverDate.toDateString() && dayDate.toDateString() !== startDate.toDateString()) {
        btn.classList.add('bg-blue-400', 'text-white', 'rounded-r-lg');
      }
    });
  }
  
  // Update selected range display
  function updateRangeDisplay() {
    const rangeDisplay = document.getElementById('reports-selected-range-display');
    const rangeText = document.getElementById('reports-range-text');
    
    if (!rangeDisplay || !rangeText) return;
    
    if (startDate && endDate) {
      const formatDate = (date) => date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
      rangeText.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      rangeDisplay.classList.remove('hidden');
    } else if (startDate) {
      rangeText.textContent = `Начало: ${startDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })} (выберите конечную дату)`;
      rangeDisplay.classList.remove('hidden');
    } else {
      rangeDisplay.classList.add('hidden');
    }
  }
}
