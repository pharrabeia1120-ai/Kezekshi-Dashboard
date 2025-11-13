// Pagination module - handles table pagination

let currentPage = 1;
let itemsPerPage = 10;
let totalItems = 0;
let allData = [];
let pageChangeCallback = null;

// Initialize pagination
export function initializePagination(data, onPageChange) {
  allData = data;
  totalItems = data.length;
  currentPage = 1;
  pageChangeCallback = onPageChange;
  
  renderPagination(onPageChange);
  updatePaginationInfo();
  initializeItemsPerPageSelector();
}

// Update pagination when data changes
export function updatePagination(data, onPageChange) {
  allData = data;
  totalItems = data.length;
  pageChangeCallback = onPageChange;
  
  // Reset to page 1 if current page is now out of range
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (currentPage > totalPages) {
    currentPage = 1;
  }
  
  renderPagination(onPageChange);
  updatePaginationInfo();
}

// Get current page data
export function getCurrentPageData() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return allData.slice(startIndex, endIndex);
}

// Render pagination controls
function renderPagination(onPageChange) {
  const paginationNav = document.getElementById('pagination-nav');
  if (!paginationNav) return;
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Clear existing pagination
  paginationNav.innerHTML = '';
  
  // Previous button
  const prevBtn = createPaginationButton('prev', currentPage === 1, () => {
    if (currentPage > 1) {
      currentPage--;
      renderPagination(onPageChange);
      updatePaginationInfo();
      onPageChange();
    }
  });
  paginationNav.appendChild(prevBtn);
  
  // Page numbers
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  
  pageNumbers.forEach(page => {
    if (page === '...') {
      const ellipsis = document.createElement('span');
      ellipsis.className = 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 inset-ring inset-ring-gray-300 focus:outline-offset-0';
      ellipsis.textContent = '...';
      paginationNav.appendChild(ellipsis);
    } else {
      const pageBtn = document.createElement('a');
      pageBtn.href = '#';
      pageBtn.textContent = page;
      
      if (page === currentPage) {
        pageBtn.className = 'relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
        pageBtn.setAttribute('aria-current', 'page');
      } else {
        pageBtn.className = 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 inset-ring inset-ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0';
      }
      
      pageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = page;
        renderPagination(onPageChange);
        updatePaginationInfo();
        onPageChange();
      });
      
      paginationNav.appendChild(pageBtn);
    }
  });
  
  // Next button
  const nextBtn = createPaginationButton('next', currentPage === totalPages, () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPagination(onPageChange);
      updatePaginationInfo();
      onPageChange();
    }
  });
  paginationNav.appendChild(nextBtn);
  
  // Mobile buttons
  setupMobileButtons(totalPages, onPageChange);
}

// Create prev/next button
function createPaginationButton(type, disabled, onClick) {
  const button = document.createElement('a');
  button.href = '#';
  
  if (type === 'prev') {
    button.className = `relative inline-flex items-center rounded-l-md px-2 py-2 ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-50'} inset-ring inset-ring-gray-300 focus:z-20 focus:outline-offset-0`;
    button.innerHTML = `
      <span class="sr-only">Previous</span>
      <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
        <path d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clip-rule="evenodd" fill-rule="evenodd" />
      </svg>
    `;
  } else {
    button.className = `relative inline-flex items-center rounded-r-md px-2 py-2 ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-50'} inset-ring inset-ring-gray-300 focus:z-20 focus:outline-offset-0`;
    button.innerHTML = `
      <span class="sr-only">Next</span>
      <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
        <path d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" fill-rule="evenodd" />
      </svg>
    `;
  }
  
  if (!disabled) {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      onClick();
    });
  }
  
  return button;
}

// Setup mobile prev/next buttons
function setupMobileButtons(totalPages, onPageChange) {
  const prevMobile = document.getElementById('prev-mobile');
  const nextMobile = document.getElementById('next-mobile');
  
  if (prevMobile) {
    prevMobile.disabled = currentPage === 1;
    prevMobile.onclick = (e) => {
      e.preventDefault();
      if (currentPage > 1) {
        currentPage--;
        renderPagination(onPageChange);
        updatePaginationInfo();
        onPageChange();
      }
    };
  }
  
  if (nextMobile) {
    nextMobile.disabled = currentPage === totalPages;
    nextMobile.onclick = (e) => {
      e.preventDefault();
      if (currentPage < totalPages) {
        currentPage++;
        renderPagination(onPageChange);
        updatePaginationInfo();
        onPageChange();
      }
    };
  }
}

// Calculate which page numbers to show
function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  const pages = [];
  
  // Always show first page
  pages.push(1);
  
  if (current <= 3) {
    // Near start: 1 2 3 ... 8 9 10
    pages.push(2, 3, '...', total - 2, total - 1, total);
  } else if (current >= total - 2) {
    // Near end: 1 2 3 ... 8 9 10
    pages.push(2, 3, '...', total - 2, total - 1, total);
  } else {
    // Middle: 1 ... 4 5 6 ... 10
    pages.push('...', current - 1, current, current + 1, '...', total);
  }
  
  return pages;
}

// Update pagination info text
function updatePaginationInfo() {
  const pageStart = document.getElementById('page-start');
  const pageEnd = document.getElementById('page-end');
  const totalResults = document.getElementById('total-results');
  
  if (!pageStart || !pageEnd || !totalResults) return;
  
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  
  pageStart.textContent = totalItems > 0 ? startIndex : 0;
  pageEnd.textContent = endIndex;
  totalResults.textContent = totalItems;
}

// Set items per page
export function setItemsPerPage(count) {
  itemsPerPage = count;
  currentPage = 1;
}

// Get current page number
export function getCurrentPage() {
  return currentPage;
}

// Initialize items per page selector
function initializeItemsPerPageSelector() {
  const selector = document.getElementById('items-per-page');
  if (!selector) return;
  
  // Set initial value
  selector.value = itemsPerPage;
  
  // Add event listener (only once)
  if (!selector.dataset.initialized) {
    selector.addEventListener('change', (e) => {
      const newCount = parseInt(e.target.value);
      itemsPerPage = newCount;
      currentPage = 1; // Reset to first page
      
      // Re-render pagination with new items per page
      if (pageChangeCallback) {
        renderPagination(pageChangeCallback);
        updatePaginationInfo();
        pageChangeCallback();
      }
    });
    
    selector.dataset.initialized = 'true';
  }
}
