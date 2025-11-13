// Charts module - handles all chart-related functionality using ECharts

import * as echarts from 'echarts';
import { currentCity, getSelectedSchools } from './dropdowns.js';
import { currentPeriod, currentDateRange } from './tabs.js';
import { generateChartData, updateSummaryCards } from './utils.js';
import { logger } from './logger.js';

// Initialize ECharts for analytics page
export function initializeCharts() {
  // Hide all skeleton loaders and show charts
  const skeletonLoaders = document.querySelectorAll('.skeleton-loader');
  skeletonLoaders.forEach(skeleton => {
    skeleton.classList.add('hidden');
  });
  
  // Temporarily show all charts for initialization
  document.getElementById('attendance-pie-chart')?.classList.remove('hidden');
  document.getElementById('nutrition-pie-chart')?.classList.remove('hidden');
  document.getElementById('library-pie-chart')?.classList.remove('hidden');
  document.getElementById('attendance-bar-chart')?.classList.remove('hidden');
  document.getElementById('nutrition-bar-chart')?.classList.remove('hidden');
  document.getElementById('library-bar-chart')?.classList.remove('hidden');
  
  // Wait for next frame to ensure DOM is fully rendered
  requestAnimationFrame(() => {
    // Initialize all charts
    initializeAttendanceCharts();
    initializeNutritionCharts();
    initializeLibraryCharts();
    
    // Hide bar charts after initialization (pie charts are shown by default)
    document.getElementById('attendance-bar-chart')?.classList.add('hidden');
    document.getElementById('nutrition-bar-chart')?.classList.add('hidden');
    document.getElementById('library-bar-chart')?.classList.add('hidden');
  });
}

// Initialize attendance charts
function initializeAttendanceCharts() {
  // Attendance Pie Chart
  const attendancePieChartDom = document.getElementById('attendance-pie-chart');
  if (attendancePieChartDom && attendancePieChartDom.clientWidth > 0) {
    const attendancePieChart = echarts.init(attendancePieChartDom);
    const attendancePieOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Посещение',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10
          },
          label: {
            show: true,
            formatter: '{b}\n{c} ({d}%)',
            fontSize: 11,
            color: '#374151'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 456, name: '1-4 классы', itemStyle: { color: '#0075F6' } },
            { value: 350, name: '5-11 классы', itemStyle: { color: '#84cc16' } },
            { value: 280, name: 'Персонал', itemStyle: { color: '#fb923c' } }
          ]
        }
      ]
    };
    attendancePieChart.setOption(attendancePieOption);
  }

  // Attendance Bar Chart
  const attendanceBarChartDom = document.getElementById('attendance-bar-chart');
  if (attendanceBarChartDom && attendanceBarChartDom.clientWidth > 0) {
    const attendanceBarChart = echarts.init(attendanceBarChartDom);
    const attendanceBarOption = {
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          let result = params[0].name + '<br/>';
          params.forEach(item => {
            result += item.marker + ' ' + item.seriesName + ': ' + item.value + '%<br/>';
          });
          return result;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['1-4 классы', '5-11 классы', 'Персонал'],
        axisLabel: {
          fontSize: 10,
          color: '#6b7280'
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          color: '#6b7280',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      series: [
        {
          name: 'Посещение',
          type: 'bar',
          stack: 'total',
          data: [69, 56, 63],
          itemStyle: {
            color: '#0075F6'
          },
          barWidth: '60%',
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            color: '#fff',
            fontWeight: 'bold'
          }
        },
        {
          name: 'Не посетили',
          type: 'bar',
          stack: 'total',
          data: [31, 44, 37],
          itemStyle: {
            color: 'rgba(239, 68, 68, 0.6)'
          },
          label: {
            show: false
          }
        }
      ]
    };
    attendanceBarChart.setOption(attendanceBarOption);
  }
}

// Initialize nutrition charts
function initializeNutritionCharts() {
  // Nutrition Pie Chart
  const nutritionPieChartDom = document.getElementById('nutrition-pie-chart');
  if (nutritionPieChartDom && nutritionPieChartDom.clientWidth > 0) {
    const nutritionPieChart = echarts.init(nutritionPieChartDom);
    const nutritionPieOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Питание',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10
          },
          label: {
            show: true,
            formatter: '{b}\n{c} ({d}%)',
            fontSize: 11,
            color: '#374151'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 410, name: '1-4 классы', itemStyle: { color: '#0075F6' } },
            { value: 320, name: '5-11 классы', itemStyle: { color: '#84cc16' } }
          ]
        }
      ]
    };
    nutritionPieChart.setOption(nutritionPieOption);
  }

  // Nutrition Bar Chart
  const nutritionBarChartDom = document.getElementById('nutrition-bar-chart');
  if (nutritionBarChartDom && nutritionBarChartDom.clientWidth > 0) {
    const nutritionBarChart = echarts.init(nutritionBarChartDom);
    const nutritionBarOption = {
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          let result = params[0].name + '<br/>';
          params.forEach(item => {
            result += item.marker + ' ' + item.seriesName + ': ' + item.value + '%<br/>';
          });
          return result;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['1-4 классы', '5-11 классы'],
        axisLabel: {
          fontSize: 10,
          color: '#6b7280'
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          color: '#6b7280',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      series: [
        {
          name: 'Получили питание',
          type: 'bar',
          stack: 'total',
          data: [75, 62],
          itemStyle: {
            color: '#0075F6'
          },
          barWidth: '60%',
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            color: '#fff',
            fontWeight: 'bold'
          }
        },
        {
          name: 'Не получили',
          type: 'bar',
          stack: 'total',
          data: [25, 38],
          itemStyle: {
            color: 'rgba(239, 68, 68, 0.6)'
          },
          label: {
            show: false
          }
        }
      ]
    };
    nutritionBarChart.setOption(nutritionBarOption);
  }
}

// Initialize library charts
function initializeLibraryCharts() {
  // Library Pie Chart
  const libraryPieChartDom = document.getElementById('library-pie-chart');
  if (libraryPieChartDom && libraryPieChartDom.clientWidth > 0) {
    const libraryPieChart = echarts.init(libraryPieChartDom);
    const libraryPieOption = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Библиотека',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          padAngle: 5,
          itemStyle: {
            borderRadius: 10
          },
          label: {
            show: true,
            formatter: '{b}\n{c} ({d}%)',
            fontSize: 11,
            color: '#374151'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: 320, name: '1-4 классы', itemStyle: { color: '#0075F6' } },
            { value: 280, name: '5-11 классы', itemStyle: { color: '#84cc16' } },
            { value: 150, name: 'Персонал', itemStyle: { color: '#fb923c' } }
          ]
        }
      ]
    };
    libraryPieChart.setOption(libraryPieOption);
  }

  // Library Bar Chart
  const libraryBarChartDom = document.getElementById('library-bar-chart');
  if (libraryBarChartDom && libraryBarChartDom.clientWidth > 0) {
    const libraryBarChart = echarts.init(libraryBarChartDom);
    const libraryBarOption = {
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params) {
          let result = params[0].name + '<br/>';
          params.forEach(item => {
            result += item.marker + ' ' + item.seriesName + ': ' + item.value + '%<br/>';
          });
          return result;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['1-4 классы', '5-11 классы', 'Персонал'],
        axisLabel: {
          fontSize: 10,
          color: '#6b7280'
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        }
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: '{value}%',
          color: '#6b7280',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6'
          }
        }
      },
      series: [
        {
          name: 'Посетили',
          type: 'bar',
          stack: 'total',
          data: [65, 58, 52],
          itemStyle: {
            color: '#0075F6'
          },
          barWidth: '60%',
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}%',
            color: '#fff',
            fontWeight: 'bold'
          }
        },
        {
          name: 'Не посетили',
          type: 'bar',
          stack: 'total',
          data: [35, 42, 48],
          itemStyle: {
            color: 'rgba(239, 68, 68, 0.6)'
          },
          label: {
            show: false
          }
        }
      ]
    };
    libraryBarChart.setOption(libraryBarOption);
  }
}

// Initialize refresh buttons
export function initializeRefreshButtons() {
  const refreshButtons = document.querySelectorAll('.refresh-chart-btn');
  
  refreshButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const chartType = button.getAttribute('data-chart');
      const icon = button.querySelector('svg');
      
      // Add rotation animation
      icon.style.transition = 'transform 0.5s ease';
      icon.style.transform = 'rotate(360deg)';
      
      // Reset rotation after animation
      setTimeout(() => {
        icon.style.transform = 'rotate(0deg)';
      }, 500);
      
      // Refresh specific charts
      if (chartType === 'attendance') {
        refreshAttendanceCharts();
      } else if (chartType === 'nutrition') {
        refreshNutritionCharts();
      } else if (chartType === 'library') {
        refreshLibraryCharts();
      }
    });
  });
}

// Refresh attendance charts
export function refreshAttendanceCharts() {
  const pieChart = echarts.getInstanceByDom(document.getElementById('attendance-pie-chart'));
  const barChart = echarts.getInstanceByDom(document.getElementById('attendance-bar-chart'));
  
  if (pieChart) {
    pieChart.setOption({
      series: [{
        data: [
          { value: 450, name: '1-4 классы', itemStyle: { color: '#0075F6' } },
          { value: 595, name: '5-11 классы', itemStyle: { color: '#84cc16' } },
          { value: 189, name: 'Персонал', itemStyle: { color: '#fb923c' } }
        ]
      }]
    });
  }
  
  if (barChart) {
    barChart.setOption({
      series: [
        {
          data: [69, 56, 63]
        },
        {
          data: [31, 44, 37]
        }
      ]
    });
  }
  
  logger.debug('Attendance charts refreshed');
}

// Refresh nutrition charts
export function refreshNutritionCharts() {
  const pieChart = echarts.getInstanceByDom(document.getElementById('nutrition-pie-chart'));
  const barChart = echarts.getInstanceByDom(document.getElementById('nutrition-bar-chart'));
  
  if (pieChart) {
    pieChart.setOption({
      series: [{
        data: [
          { value: 456, name: '1-4 классы', itemStyle: { color: '#0075F6' } },
          { value: 531, name: '5-11 классы', itemStyle: { color: '#84cc16' } }
        ]
      }]
    });
  }
  
  if (barChart) {
    barChart.setOption({
      series: [
        {
          data: [75, 62]
        },
        {
          data: [25, 38]
        }
      ]
    });
  }
  
  logger.debug('Nutrition charts refreshed');
}

// Refresh library charts
export function refreshLibraryCharts() {
  const pieChart = echarts.getInstanceByDom(document.getElementById('library-pie-chart'));
  const barChart = echarts.getInstanceByDom(document.getElementById('library-bar-chart'));
  
  if (pieChart) {
    pieChart.setOption({
      series: [{
        data: [
          { value: 234, name: '1-4 классы', itemStyle: { color: '#0075F6' } },
          { value: 289, name: '5-11 классы', itemStyle: { color: '#84cc16' } },
          { value: 156, name: 'Персонал', itemStyle: { color: '#fb923c' } }
        ]
      }]
    });
  }
  
  if (barChart) {
    barChart.setOption({
      series: [
        {
          data: [65, 58, 52]
        },
        {
          data: [35, 42, 48]
        }
      ]
    });
  }
  
  logger.debug('Library charts refreshed');
}

// Update all charts with current filters
export function updateChartsWithFilters() {
  logger.debug('Updating charts with filters:', { city: currentCity, period: currentPeriod, dateRange: currentDateRange });
  
  const data = generateChartData(currentCity, currentPeriod);
  
  // Update attendance charts
  const attendancePieChart = echarts.getInstanceByDom(document.getElementById('attendance-pie-chart'));
  const attendanceBarChart = echarts.getInstanceByDom(document.getElementById('attendance-bar-chart'));
  
  if (attendancePieChart) {
    attendancePieChart.setOption({
      series: [{ data: data.attendance.pie }]
    });
  }
  
  if (attendanceBarChart) {
    attendanceBarChart.setOption({
      series: [
        { data: data.attendance.bar.present },
        { data: data.attendance.bar.absent }
      ]
    });
  }
  
  // Update nutrition charts
  const nutritionPieChart = echarts.getInstanceByDom(document.getElementById('nutrition-pie-chart'));
  const nutritionBarChart = echarts.getInstanceByDom(document.getElementById('nutrition-bar-chart'));
  
  if (nutritionPieChart) {
    nutritionPieChart.setOption({
      series: [{ data: data.nutrition.pie }]
    });
  }
  
  if (nutritionBarChart) {
    nutritionBarChart.setOption({
      series: [
        { data: data.nutrition.bar.received },
        { data: data.nutrition.bar.notReceived }
      ]
    });
  }
  
  // Update library charts
  const libraryPieChart = echarts.getInstanceByDom(document.getElementById('library-pie-chart'));
  const libraryBarChart = echarts.getInstanceByDom(document.getElementById('library-bar-chart'));
  
  if (libraryPieChart) {
    libraryPieChart.setOption({
      series: [{ data: data.library.pie }]
    });
  }
  
  if (libraryBarChart) {
    libraryBarChart.setOption({
      series: [
        { data: data.library.bar.visited },
        { data: data.library.bar.notVisited }
      ]
    });
  }
  
  // Update summary cards
  updateSummaryCards(data.summary);
}

// Initialize chart type tabs
export function initializeChartTypeTabs() {
  const chartTypeTabs = document.querySelectorAll('.chart-type-tab');
  
  chartTypeTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const chartName = tab.getAttribute('data-chart');
      const chartType = tab.getAttribute('data-type');
      
      // Update tab styles
      const siblingTabs = document.querySelectorAll(`.chart-type-tab[data-chart="${chartName}"]`);
      siblingTabs.forEach(t => {
        t.classList.remove('border-blue-600', 'text-blue-600', 'active');
        t.classList.add('border-transparent', 'text-gray-500');
      });
      
      tab.classList.remove('border-transparent', 'text-gray-500');
      tab.classList.add('border-blue-600', 'text-blue-600', 'active');
      
      // Show/hide charts
      const pieChart = document.getElementById(`${chartName}-pie-chart`);
      const barChart = document.getElementById(`${chartName}-bar-chart`);
      
      if (chartType === 'pie') {
        // Show pie chart, hide bar chart
        pieChart.classList.remove('hidden');
        barChart.classList.add('hidden');
        
        // Resize pie chart
        setTimeout(() => {
          const chart = echarts.getInstanceByDom(pieChart);
          if (chart) {
            chart.resize();
          }
        }, 50);
      } else if (chartType === 'bar') {
        // Show bar chart, hide pie chart
        pieChart.classList.add('hidden');
        barChart.classList.remove('hidden');
        
        // Resize bar chart when shown
        setTimeout(() => {
          const chart = echarts.getInstanceByDom(barChart);
          if (chart) {
            chart.resize();
          }
        }, 50);
      }
    });
  });
}
