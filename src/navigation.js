// Navigation module - handles page loading and navigation

// Page titles for breadcrumbs
const pageTitles = {
  'home': 'Главная',
  'analytics': 'Аналитика',
  'reports': 'Статистика по школам'
};

// Current page tracker
let currentPage = 'home';

// Get current page
export function getCurrentPage() {
  return currentPage;
}

// Load page content
export async function loadPage(pageName, onPageLoaded) {
  try {
    const response = await fetch(`/pages/${pageName}.html`);
    const html = await response.text();
    document.getElementById('main-content').innerHTML = html;
    currentPage = pageName;
    
    // Save current page to localStorage
    localStorage.setItem('currentPage', pageName);
    
    updateBreadcrumb(pageName);
    
    // Call the callback to initialize page-specific features
    if (onPageLoaded) {
      onPageLoaded(pageName);
    }
  } catch (error) {
    console.error('Error loading page:', error);
  }
}

// Update breadcrumb
export function updateBreadcrumb(pageName) {
  const breadcrumbText = document.getElementById('breadcrumb-current-page');
  if (breadcrumbText) {
    breadcrumbText.textContent = pageTitles[pageName] || pageName;
  }
  
  // Update page controls in header
  updatePageControls(pageName);
}

// Update page controls in header based on current page
function updatePageControls(pageName) {
  const controlsContainer = document.getElementById('page-controls-container');
  if (!controlsContainer) return;
  
  // Clear existing controls
  controlsContainer.innerHTML = '';
  
  // Add controls based on page
  if (pageName === 'analytics') {
    controlsContainer.innerHTML = `
      <!-- Period Tabs -->
      <div class="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50 h-11 items-center gap-1">
        <button class="w-[85px] py-2 text-sm font-medium rounded-md transition-all bg-white text-blue-600 period-tab tab-active" data-period="day">
          Сегодня
        </button>
        <button class="w-[85px] py-2 text-sm font-medium rounded-md transition-all text-gray-700 hover:text-gray-900 hover:bg-gray-100 period-tab" data-period="yesterday">
          Вчера
        </button>
        <button class="w-[85px] py-2 text-sm font-medium rounded-md transition-all text-gray-700 hover:text-gray-900 hover:bg-gray-100 period-tab" data-period="week">
          Неделя
        </button>
        <button class="w-[85px] py-2 text-sm font-medium rounded-md transition-all text-gray-700 hover:text-gray-900 hover:bg-gray-100 period-tab" data-period="month">
          Месяц
        </button>
      </div>
      
      <!-- Calendar Popover -->
      <div class="relative">
        <button id="calendar-trigger" class="w-[220px] h-11 px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-2">
          <img src="/public/calendar.svg" class="w-5 h-5 flex-shrink-0" alt="Calendar Icon"/>
          <span id="selected-date-text" class="truncate">Выбрать дату</span>
        </button>
        
        <!-- Datepicker Container -->
        <div id="datepicker-container" class="hidden absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 w-90">
          <!-- Info Header -->
          <div class="px-4 pt-4 pb-2">
            <div class="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Выберите начальную и конечную дату периода</span>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-4">
            <button id="prevMonth" class="p-1 hover:bg-gray-100 rounded">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <div id="currentMonth" class="text-sm font-medium"></div>
            <button id="nextMonth" class="p-1 hover:bg-gray-100 rounded">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="grid grid-cols-7 gap-1 p-4 border-t border-gray-200">
            <div class="text-center text-xs font-medium text-gray-500">Пн</div>
            <div class="text-center text-xs font-medium text-gray-500">Вт</div>
            <div class="text-center text-xs font-medium text-gray-500">Ср</div>
            <div class="text-center text-xs font-medium text-gray-500">Чт</div>
            <div class="text-center text-xs font-medium text-gray-500">Пт</div>
            <div class="text-center text-xs font-medium text-gray-500">Сб</div>
            <div class="text-center text-xs font-medium text-gray-500">Вс</div>
          </div>
          <div id="days-container" class="grid grid-cols-7 gap-1 p-4"></div>
          
          <!-- Selected Range Display -->
          <div id="selected-range-display" class="hidden px-4 pb-2">
            <div class="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-700">
              <span class="font-medium">Выбранный период:</span>
              <span id="range-text" class="ml-2"></span>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 p-4 border-t border-gray-200">
            <button id="cancelButton" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
              Отмена
            </button>
            <button id="applyButton" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
              Применить
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (pageName === 'reports') {
    controlsContainer.innerHTML = `
      <!-- Calendar Popover -->
      <div class="relative">
        <button id="reports-calendar-trigger" class="h-11 px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center gap-2">
          <img src="/public/calendar.svg" class="w-5 h-5  flex-shrink-0" alt="Calendar Icon"/>
          <span id="reports-selected-date-text" class="truncate">Выбрать дату</span>
        </button>
        
        <!-- Datepicker Container -->
        <div id="reports-datepicker-container" class="hidden absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 w-90">
          <!-- Info Header -->
          <div class="px-4 pt-4 pb-2">
            <div class="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Выберите начальную и конечную дату периода</span>
            </div>
          </div>
          
          <div class="flex items-center justify-between p-4">
            <button id="reports-prevMonth" class="p-1 hover:bg-gray-100 rounded">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
            <div id="reports-currentMonth" class="text-sm font-medium"></div>
            <button id="reports-nextMonth" class="p-1 hover:bg-gray-100 rounded">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <div class="grid grid-cols-7 gap-1 p-4 border-t border-gray-200">
            <div class="text-center text-xs font-medium text-gray-500">Пн</div>
            <div class="text-center text-xs font-medium text-gray-500">Вт</div>
            <div class="text-center text-xs font-medium text-gray-500">Ср</div>
            <div class="text-center text-xs font-medium text-gray-500">Чт</div>
            <div class="text-center text-xs font-medium text-gray-500">Пт</div>
            <div class="text-center text-xs font-medium text-gray-500">Сб</div>
            <div class="text-center text-xs font-medium text-gray-500">Вс</div>
          </div>
          <div id="reports-days-container" class="grid grid-cols-7 gap-1 p-4"></div>
          
          <!-- Selected Range Display -->
          <div id="reports-selected-range-display" class="hidden px-4 pb-2">
            <div class="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-blue-700">
              <span class="font-medium">Выбранный период:</span>
              <span id="reports-range-text" class="ml-2"></span>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 p-4 border-t border-gray-200">
            <button id="reports-cancelButton" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
              Отмена
            </button>
            <button id="reports-applyButton" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700">
              Применить
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

// Update sidebar active state
export function updateSidebarActiveState(pageName) {
  const buttons = document.querySelectorAll('aside button[data-page]');
  buttons.forEach(btn => {
    const btnPage = btn.getAttribute('data-page');
    if (btnPage === pageName) {
      btn.classList.remove('text-gray-500');
      btn.classList.add('bg-blue-50', 'text-blue-600');
    } else {
      btn.classList.remove('bg-blue-50', 'text-blue-600');
      btn.classList.add('text-gray-500');
    }
  });
}

// Setup sidebar navigation
export function setupSidebarNavigation(onNavigate) {
  const buttons = document.querySelectorAll('aside button[data-page]');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const pageName = button.getAttribute('data-page');
      
      // Update active state
      buttons.forEach(btn => {
        btn.classList.remove('bg-blue-50', 'text-blue-600');
        btn.classList.add('text-gray-500');
      });
      button.classList.remove('text-gray-500');
      button.classList.add('bg-blue-50', 'text-blue-600');
      
      // Trigger navigation callback
      if (onNavigate) {
        onNavigate(pageName);
      }
    });
  });
}
