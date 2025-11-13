// Reports data generator

import { initializePagination, updatePagination, getCurrentPageData } from './pagination.js';
import { getSelectedSchools, currentCity } from './dropdowns.js';
import { safeDivide, createSafeElement } from './security.js';
import { api } from './api.js';
import { logger } from './logger.js';
import { handleAPIError } from './error-handler.js';
import { CONFIG } from './config.js';

let currentData = [];
let allOriginalData = [];

// Generate table data for schools
export function generateSchoolsData() {
  // Get selected schools from dropdown
  const selectedSchools = getSelectedSchools();
  
  // If no schools selected, use all schools from current city
  const schools = selectedSchools.length > 0 ? selectedSchools : [];

  return schools.map(school => {
    // Generate random data for each school
    const students14 = Math.floor(280 + Math.random() * 100);
    const students511 = Math.floor(400 + Math.random() * 150);
    const totalStudents = students14 + students511;
    const staff = Math.floor(35 + Math.random() * 20);
    
    const attended14 = Math.floor(students14 * (0.92 + Math.random() * 0.06));
    const attended511 = Math.floor(students511 * (0.92 + Math.random() * 0.06));
    const attendedStaff = Math.floor(staff * (0.90 + Math.random() * 0.08));
    
    const totalAttended = attended14 + attended511;
    const percentage = safeDivide(totalAttended * 100, totalStudents, 0).toFixed(1);

    // Питание 1-4 классы
    const nutrition14Received = Math.floor(attended14 * (0.85 + Math.random() * 0.12));
    const nutrition14NotReceived = attended14 - nutrition14Received;
    const nutrition14Percentage = safeDivide(nutrition14Received * 100, attended14, 0).toFixed(1);

    // Питание 5-11 классы
    const nutrition511Received = Math.floor(attended511 * (0.80 + Math.random() * 0.15));
    const nutrition511NotReceived = attended511 - nutrition511Received;
    const nutrition511Percentage = safeDivide(nutrition511Received * 100, attended511, 0).toFixed(1);

    return {
      id: school.id,
      name: school.name,
      system: {
        students14,
        students511,
        totalStudents,
        staff
      },
      attended: {
        students14: attended14,
        students511: attended511,
        staff: attendedStaff,
        percentage
      },
      nutrition14: {
        received: nutrition14Received,
        notReceived: nutrition14NotReceived,
        percentage: nutrition14Percentage
      },
      nutrition511: {
        received: nutrition511Received,
        notReceived: nutrition511NotReceived,
        percentage: nutrition511Percentage
      }
    };
  });
}

// Render table with data
export function renderAttendanceTable(data, usePagination = true) {
  currentData = data;
  allOriginalData = data;
  
  // Initialize or update pagination
  if (usePagination) {
    if (document.getElementById('pagination-nav')?.children.length === 0) {
      initializePagination(data, () => renderTableRows());
    } else {
      updatePagination(data, () => renderTableRows());
    }
    renderTableRows();
  } else {
    renderTableRows(data);
  }
}

// Render table rows (separated for pagination)
function renderTableRows(dataToRender = null) {
  const tbody = document.getElementById('table-body');
  if (!tbody) return;

  // Get data for current page or use provided data
  const data = dataToRender || getCurrentPageData();
  
  tbody.innerHTML = '';

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="16" class="px-4 py-8 text-center text-sm text-gray-500">
          Данные не найдены
        </td>
      </tr>
    `;
    renderTotalRow({ 
      totalStudents: 0, 
      totalStaff: 0, 
      attendedStudents: 0, 
      attendedStaff: 0, 
      percentage: 0,
      nutrition14Received: 0,
      nutrition14NotReceived: 0,
      nutrition14Percentage: 0,
      nutrition511Received: 0,
      nutrition511NotReceived: 0,
      nutrition511Percentage: 0
    });
    return;
  }

  // Calculate totals from ALL data (not just current page)
  const allData = currentData;
  let totalStudents14 = 0;
  let totalStudents511 = 0;
  let totalStudents = 0;
  let totalStaff = 0;
  let attendedStudents14 = 0;
  let attendedStudents511 = 0;
  let attendedStaff = 0;
  let totalNutrition14Received = 0;
  let totalNutrition14NotReceived = 0;
  let totalNutrition511Received = 0;
  let totalNutrition511NotReceived = 0;

  allData.forEach(row => {
    totalStudents14 += row.system.students14;
    totalStudents511 += row.system.students511;
    totalStudents += row.system.totalStudents;
    totalStaff += row.system.staff;
    attendedStudents14 += row.attended.students14;
    attendedStudents511 += row.attended.students511;
    attendedStaff += row.attended.staff;
    totalNutrition14Received += row.nutrition14.received;
    totalNutrition14NotReceived += row.nutrition14.notReceived;
    totalNutrition511Received += row.nutrition511.received;
    totalNutrition511NotReceived += row.nutrition511.notReceived;
  });

  // Render rows for current page
  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-50 transition-colors';

    // Определяем цвет badge в зависимости от процента посещаемости
    const percentage = parseFloat(row.attended.percentage);
    let badgeColor = 'bg-green-100 text-green-800';
    if (percentage < 90) {
      badgeColor = 'bg-red-100 text-red-800';
    } else if (percentage < 95) {
      badgeColor = 'bg-yellow-100 text-yellow-800';
    }

    // Определяем цвет badge для питания 1-4
    const nutrition14Pct = parseFloat(row.nutrition14.percentage);
    let nutrition14BadgeColor = 'bg-green-100 text-green-800';
    if (nutrition14Pct < 80) {
      nutrition14BadgeColor = 'bg-red-100 text-red-800';
    } else if (nutrition14Pct < 90) {
      nutrition14BadgeColor = 'bg-yellow-100 text-yellow-800';
    }

    // Определяем цвет badge для питания 5-11
    const nutrition511Pct = parseFloat(row.nutrition511.percentage);
    let nutrition511BadgeColor = 'bg-green-100 text-green-800';
    if (nutrition511Pct < 80) {
      nutrition511BadgeColor = 'bg-red-100 text-red-800';
    } else if (nutrition511Pct < 90) {
      nutrition511BadgeColor = 'bg-yellow-100 text-yellow-800';
    }
    
    tr.innerHTML = `
      <td class="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-200">${row.id}</td>
      <td class="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-200">${row.name}</td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.system.students14}</td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.system.students511}</td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.system.totalStudents}</td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.system.staff}</td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.attended.students14}</td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.attended.students511}</td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.attended.staff}</td>
      <td class="px-4 py-3 text-center border-r border-gray-200">
        <span class="whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-bold ${badgeColor}">
          ${row.attended.percentage}%
        </span>
      </td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.nutrition14.received}</td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.nutrition14.notReceived}</td>
      <td class="px-4 py-3 text-center border-r border-gray-200">
        <span class="whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-bold ${nutrition14BadgeColor}">
          ${row.nutrition14.percentage}%
        </span>
      </td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.nutrition511.received}</td>
      <td class="px-4 py-3 text-base font-semibold text-gray-900 text-center border-r border-gray-200">${row.nutrition511.notReceived}</td>
      <td class="px-4 py-3 text-center">
        <span class="whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-bold ${nutrition511BadgeColor}">
          ${row.nutrition511.percentage}%
        </span>
      </td>
    `;
    
    tbody.appendChild(tr);
  });

  // Calculate overall percentage
  const totalAttendedStudents = attendedStudents14 + attendedStudents511;
  const overallPercentage = safeDivide(totalAttendedStudents * 100, totalStudents, 0).toFixed(1);

  // Calculate nutrition percentages
  const nutrition14TotalPercentage = safeDivide(totalNutrition14Received * 100, attendedStudents14, 0).toFixed(1);
  const nutrition511TotalPercentage = safeDivide(totalNutrition511Received * 100, attendedStudents511, 0).toFixed(1);

  // Render total row
  renderTotalRow({
    totalStudents14,
    totalStudents511,
    totalStudents,
    totalStaff,
    attendedStudents14,
    attendedStudents511,
    attendedStaff,
    percentage: overallPercentage,
    nutrition14Received: totalNutrition14Received,
    nutrition14NotReceived: totalNutrition14NotReceived,
    nutrition14Percentage: nutrition14TotalPercentage,
    nutrition511Received: totalNutrition511Received,
    nutrition511NotReceived: totalNutrition511NotReceived,
    nutrition511Percentage: nutrition511TotalPercentage
  });
}

// Render total row in footer
function renderTotalRow(totals) {
  const tfoot = document.getElementById('table-footer');
  if (!tfoot) return;

  // Определяем цвет badge для общего процента посещаемости
  const percentage = parseFloat(totals.percentage || 0);
  let badgeColor = 'bg-green-100 text-green-800';
  if (percentage < 90) {
    badgeColor = 'bg-red-100 text-red-800';
  } else if (percentage < 95) {
    badgeColor = 'bg-yellow-100 text-yellow-800';
  }

  // Определяем цвет badge для питания 1-4
  const nutrition14Pct = parseFloat(totals.nutrition14Percentage || 0);
  let nutrition14BadgeColor = 'bg-green-100 text-green-800';
  if (nutrition14Pct < 80) {
    nutrition14BadgeColor = 'bg-red-100 text-red-800';
  } else if (nutrition14Pct < 90) {
    nutrition14BadgeColor = 'bg-yellow-100 text-yellow-800';
  }

  // Определяем цвет badge для питания 5-11
  const nutrition511Pct = parseFloat(totals.nutrition511Percentage || 0);
  let nutrition511BadgeColor = 'bg-green-100 text-green-800';
  if (nutrition511Pct < 80) {
    nutrition511BadgeColor = 'bg-red-100 text-red-800';
  } else if (nutrition511Pct < 90) {
    nutrition511BadgeColor = 'bg-yellow-100 text-yellow-800';
  }

  tfoot.innerHTML = `
    <tr class="font-semibold">
      <td class="px-4 py-4 text-sm text-gray-900 border-r border-blue-200" colspan="2">
        <span class="flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
          Всего:
        </span>
      </td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.totalStudents14 || 0}</td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.totalStudents511 || 0}</td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.totalStudents || 0}</td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.totalStaff || 0}</td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.attendedStudents14 || 0}</td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.attendedStudents511 || 0}</td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.attendedStaff || 0}</td>
      <td class="px-4 py-4 text-center border-r border-blue-200">
        <span class="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold ${badgeColor}">
          ${totals.percentage || 0}%
        </span>
      </td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.nutrition14Received || 0}</td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.nutrition14NotReceived || 0}</td>
      <td class="px-4 py-4 text-center border-r border-blue-200">
        <span class="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold ${nutrition14BadgeColor}">
          ${totals.nutrition14Percentage || 0}%
        </span>
      </td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.nutrition511Received || 0}</td>
      <td class="px-4 py-4 text-base font-bold text-gray-900 text-center border-r border-blue-200">${totals.nutrition511NotReceived || 0}</td>
      <td class="px-4 py-4 text-center">
        <span class="whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold ${nutrition511BadgeColor}">
          ${totals.nutrition511Percentage || 0}%
        </span>
      </td>
    </tr>
  `;
}


// Initialize search functionality
export function initializeSearch(allData) {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
      allOriginalData = allData;
      renderAttendanceTable(allData);
      return;
    }

    const filteredData = allData.filter(row => 
      row.name.toLowerCase().includes(searchTerm) ||
      row.id.toString().includes(searchTerm)
    );

    allOriginalData = filteredData;
    renderAttendanceTable(filteredData);
  });
}

// Initialize filter button (placeholder for future functionality)
export function initializeFilter() {
  const filterBtn = document.getElementById('filter-btn');
  if (!filterBtn) return;

  filterBtn.addEventListener('click', () => {
    logger.debug('Filter button clicked');
    // TODO: Implement filter functionality
    alert('Функция фильтрации будет добавлена позже');
  });
}
