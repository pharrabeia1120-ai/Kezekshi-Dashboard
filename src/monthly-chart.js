// Monthly Savings Chart module using Chart.js

import { Chart, registerables } from 'chart.js';
import { logger } from './logger.js';

// Register Chart.js components
Chart.register(...registerables);

let monthlySavingsChart = null;

// Sample data for different years
const yearlyData = {
  2025: [12000, 19000, 15000, 17000, 14000, 15000, 16000, 11000, 15000, 20000, 16000, 13000],
  2024: [11000, 18000, 14000, 16000, 13000, 14000, 15000, 10000, 14000, 19000, 15000, 12000],
  2023: [10000, 17000, 13000, 15000, 12000, 13000, 14000, 9000, 13000, 18000, 14000, 11000],
  2022: [9000, 16000, 12000, 14000, 11000, 12000, 13000, 8000, 12000, 17000, 13000, 10000]
};

// Initialize monthly savings chart
export function initializeMonthlySavingsChart() {
  const canvas = document.getElementById('monthly-savings-chart');
  if (!canvas) {
    logger.debug('Monthly savings chart canvas not found');
    return;
  }

  const ctx = canvas.getContext('2d');

  // Destroy existing chart if it exists
  if (monthlySavingsChart) {
    monthlySavingsChart.destroy();
  }

  // Sample data for 12 months (default 2025)
  const data = {
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    datasets: [{
      label: 'Экономия (₸)',
      data: yearlyData[2025],
      backgroundColor: '#60a5fa',
      borderColor: '#60a5fa',
      borderWidth: 0,
      borderRadius: 8,
      barPercentage: 0.7,
    }]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1f2937',
          padding: 12,
          titleFont: {
            size: 13,
            weight: 'normal'
          },
          bodyFont: {
            size: 14,
            weight: 'bold'
          },
          callbacks: {
            label: function(context) {
              return context.parsed.y.toLocaleString('ru-RU') + ' ₸';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            color: '#f3f4f6',
            drawBorder: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 11
            },
            callback: function(value) {
              return (value / 1000) + 'K';
            }
          },
          border: {
            display: false
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 11
            }
          },
          border: {
            display: false
          }
        }
      }
    }
  };

  monthlySavingsChart = new Chart(ctx, config);
  
  // Add event listener for year selector
  const yearSelector = document.getElementById('year-selector');
  if (yearSelector) {
    yearSelector.addEventListener('change', (e) => {
      const selectedYear = parseInt(e.target.value);
      updateChartForYear(selectedYear);
    });
  }
  
  logger.debug('Monthly savings chart initialized');
}

// Update chart for selected year
function updateChartForYear(year) {
  if (!monthlySavingsChart) {
    logger.warn('Monthly savings chart not initialized');
    return;
  }

  const data = yearlyData[year] || yearlyData[2025];
  monthlySavingsChart.data.datasets[0].data = data;
  monthlySavingsChart.update();
  logger.debug(`Monthly savings chart updated for year ${year}`);
}

// Update monthly savings chart with new data
export function updateMonthlySavingsChart(data) {
  if (!monthlySavingsChart) {
    logger.warn('Monthly savings chart not initialized');
    return;
  }

  monthlySavingsChart.data.datasets[0].data = data;
  monthlySavingsChart.update();
  logger.debug('Monthly savings chart updated');
}

// Destroy chart on cleanup
export function destroyMonthlySavingsChart() {
  if (monthlySavingsChart) {
    monthlySavingsChart.destroy();
    monthlySavingsChart = null;
    logger.debug('Monthly savings chart destroyed');
  }
}
