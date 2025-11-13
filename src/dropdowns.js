// Dropdowns module - handles city and school dropdown functionality

import { getCurrentPage } from './navigation.js';
import { updateChartsWithFilters } from './charts.js';
import { generateSchoolsData, renderAttendanceTable } from './reports-data.js';

// Global state for filters
export let currentCity = 'Астана';

// Schools database by city
const schoolsByCity = {
  'Алматы': [
    { id: 1, name: 'Школа №15' },
    { id: 2, name: 'Школа №27' },
    { id: 3, name: 'Школа №42' },
    { id: 4, name: 'Школа №58' },
    { id: 5, name: 'Школа №73' },
    { id: 24, name: 'Школа №89' },
    { id: 25, name: 'Школа №104' },
    { id: 26, name: 'Школа №125' },
    { id: 27, name: 'Школа №137' },
    { id: 28, name: 'Школа №156' }
  ],
  'Астана': [
    { id: 6, name: 'Школа №12' },
    { id: 7, name: 'Школа №23' },
    { id: 8, name: 'Школа №35' },
    { id: 9, name: 'Школа №47' },
    { id: 10, name: 'Школа №61' }
  ],
  'Шымкент': [
    { id: 11, name: 'Школа №8' },
    { id: 12, name: 'Школа №19' },
    { id: 13, name: 'Школа №31' },
    { id: 14, name: 'Школа №44' }
  ],
  'Караганда': [
    { id: 15, name: 'Школа №5' },
    { id: 16, name: 'Школа №17' },
    { id: 17, name: 'Школа №29' },
    { id: 18, name: 'Школа №38' },
    { id: 19, name: 'Школа №52' }
  ],
  'Атырау': [
    { id: 20, name: 'Школа №9' },
    { id: 21, name: 'Школа №14' },
    { id: 22, name: 'Школа №26' },
    { id: 23, name: 'Школа №33' }
  ]
};

// Global state for selected schools
let selectedSchools = [];
let tempSelectedSchools = []; // Temporary state before applying

// Setup city dropdown functionality
export function setupCityDropdown() {
  const dropdownBtn = document.getElementById('city-dropdown-btn');
  const dropdownMenu = document.getElementById('city-dropdown-menu');
  const dropdownArrow = document.getElementById('dropdown-arrow');
  const cityLinks = document.querySelectorAll('[data-city]');
  const cityListView = document.getElementById('city-list-view');
  const schoolsListView = document.getElementById('schools-list-view');
  const backToCitiesBtn = document.getElementById('back-to-cities-btn');
  const currentCityName = document.getElementById('current-city-name');
  const schoolsCheckboxesContainer = document.getElementById('schools-checkboxes-container');
  const selectAllCheckbox = document.getElementById('select-all-schools');
  const cancelSchoolsBtn = document.getElementById('cancel-schools-btn');
  const applySchoolsBtn = document.getElementById('apply-schools-btn');
  
  if (!dropdownBtn || !dropdownMenu) return;
  
  // Toggle dropdown
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
    dropdownArrow.classList.toggle('rotate-180');
    
    // Show city list when opening
    if (!dropdownMenu.classList.contains('hidden')) {
      showCityList();
    }
  });
  
  // Show city list view
  function showCityList() {
    cityListView.classList.remove('hidden');
    schoolsListView.classList.add('hidden');
  }
  
  // Show schools list view
  function showSchoolsList(cityName) {
    currentCity = cityName;
    currentCityName.textContent = cityName;
    cityListView.classList.add('hidden');
    schoolsListView.classList.remove('hidden');
    
    // Get search input
    const searchInput = document.getElementById('schools-search-input');
    
    // Clear search input
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Clear and populate schools checkboxes
    schoolsCheckboxesContainer.innerHTML = '';
    const schools = schoolsByCity[cityName] || [];
    
    // Function to render schools
    function renderSchools(schoolsToRender) {
      schoolsCheckboxesContainer.innerHTML = '';
      schoolsToRender.forEach(school => {
        const isChecked = tempSelectedSchools.includes(school.id);
        const label = document.createElement('label');
        label.className = 'flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer school-item';
        label.innerHTML = `
          <input type="checkbox" class="school-checkbox w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                 data-school-id="${school.id}" ${isChecked ? 'checked' : ''}>
          <span class="text-sm text-gray-700">${school.name}</span>
        `;
        schoolsCheckboxesContainer.appendChild(label);
      });
      
      // Update select all checkbox
      updateSelectAllCheckbox();
      
      // Add checkbox event listeners
      const checkboxes = schoolsCheckboxesContainer.querySelectorAll('.school-checkbox');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const schoolId = parseInt(e.target.dataset.schoolId);
          if (e.target.checked) {
            if (!tempSelectedSchools.includes(schoolId)) {
              tempSelectedSchools.push(schoolId);
            }
          } else {
            tempSelectedSchools = tempSelectedSchools.filter(id => id !== schoolId);
          }
          updateSelectAllCheckbox();
        });
      });
    }
    
    // Initial render
    renderSchools(schools);
    
    // Add search functionality
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm === '') {
          renderSchools(schools);
        } else {
          const filtered = schools.filter(school => 
            school.name.toLowerCase().includes(searchTerm)
          );
          renderSchools(filtered);
        }
      });
    }
  }
  
  // Update select all checkbox state
  function updateSelectAllCheckbox() {
    const checkboxes = schoolsCheckboxesContainer.querySelectorAll('.school-checkbox');
    const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);
    selectAllCheckbox.checked = allChecked;
  }
  
  // Select all functionality
  selectAllCheckbox.addEventListener('change', (e) => {
    const checkboxes = schoolsCheckboxesContainer.querySelectorAll('.school-checkbox');
    const schools = schoolsByCity[currentCity] || [];
    
    if (e.target.checked) {
      // Select all schools from current city
      schools.forEach(school => {
        if (!tempSelectedSchools.includes(school.id)) {
          tempSelectedSchools.push(school.id);
        }
      });
      checkboxes.forEach(cb => cb.checked = true);
    } else {
      // Deselect all schools from current city
      const citySchoolIds = schools.map(s => s.id);
      tempSelectedSchools = tempSelectedSchools.filter(id => !citySchoolIds.includes(id));
      checkboxes.forEach(cb => cb.checked = false);
    }
  });
  
  // Click on city - show schools list
  cityLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cityName = link.getAttribute('data-city');
      showSchoolsList(cityName);
    });
  });
  
  // Back to cities button
  backToCitiesBtn.addEventListener('click', () => {
    showCityList();
  });
  
  // Cancel button - reset temp selections
  cancelSchoolsBtn.addEventListener('click', () => {
    tempSelectedSchools = [...selectedSchools]; // Reset to saved state
    dropdownMenu.classList.add('hidden');
    dropdownArrow.classList.remove('rotate-180');
    showCityList();
  });
  
  // Apply button - save selections
  applySchoolsBtn.addEventListener('click', () => {
    selectedSchools = [...tempSelectedSchools];
    updateCitySchoolsDisplay();
    dropdownMenu.classList.add('hidden');
    dropdownArrow.classList.remove('rotate-180');
    showCityList();
    
    // Update charts if on analytics page
    if (getCurrentPage() === 'analytics') {
      updateChartsWithFilters();
    }
    
    // Update table if on reports page
    if (getCurrentPage() === 'reports') {
      const tableData = generateSchoolsData();
      renderAttendanceTable(tableData);
    }
  });
  
  // Update the display text
  function updateCitySchoolsDisplay() {
    const selectedCitySchoolsSpan = document.getElementById('selected-city-schools');
    if (selectedCitySchoolsSpan) {
      const count = selectedSchools.length;
      if (count === 0) {
        selectedCitySchoolsSpan.textContent = currentCity;
      } else {
        selectedCitySchoolsSpan.textContent = `${currentCity} (${count} школ)`;
      }
    }
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.classList.add('hidden');
      dropdownArrow.classList.remove('rotate-180');
      showCityList();
      // Reset temp selections to saved state when closing
      tempSelectedSchools = [...selectedSchools];
    }
  });
}

// Update city name in header and auto-select all schools from that city
export function updateCityName(cityName) {
  const selectedCitySchoolsSpan = document.getElementById('selected-city-schools');
  if (selectedCitySchoolsSpan) {
    selectedCitySchoolsSpan.textContent = cityName;
  }
  currentCity = cityName;
  
  // Auto-select all schools from detected city
  const schools = schoolsByCity[cityName] || [];
  selectedSchools = schools.map(s => s.id);
  tempSelectedSchools = [...selectedSchools];
  
  // Update display
  if (selectedCitySchoolsSpan) {
    selectedCitySchoolsSpan.textContent = `${cityName} (${selectedSchools.length} школ)`;
  }
}

// Export function to get selected schools data
export function getSelectedSchools() {
  // Return array of selected school objects
  const allSchools = Object.values(schoolsByCity).flat();
  return allSchools.filter(school => selectedSchools.includes(school.id));
}
