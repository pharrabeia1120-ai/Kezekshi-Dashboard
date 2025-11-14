// Utils module - utility functions for the application

import { validateCity, safeLocalStorageGet, safeLocalStorageSet } from './security.js';
import { api } from './api.js';
import { logger } from './logger.js';
import { CONFIG } from './config.js';
import { handleAPIError } from './error-handler.js';

// Get user's city (defaults to Астана)
export async function detectUserCity() {
  try {
    // Try to get from localStorage with validation
    const savedCity = safeLocalStorageGet('userCity', validateCity, null);
    if (savedCity) {
      logger.debug('Using saved city:', savedCity);
      return savedCity;
    }
    
    // Default to Астана
    const defaultCity = 'Астана';
    logger.debug('Using default city:', defaultCity);
    safeLocalStorageSet('userCity', defaultCity);
    return defaultCity;
    
  } catch (error) {
    logger.error('Error getting city:', error);
    return 'Астана';
  }
}

// Animate counters from 0 to target value
export function animateCounters() {
  const counters = document.querySelectorAll('.counter-value');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString('ru-RU');
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target.toLocaleString('ru-RU');
      }
    };
    
    updateCounter();
  });
}

// Generate random data based on filters
export function generateChartData(city, period) {
  // Generate different data based on current filters
  const cityMultiplier = {
    'Астана': 1.0,
    'Алматы': 1.2,
    'Шымкент': 0.9,
    'Караганда': 0.8,
    'Актобе': 0.7,
    'Тараз': 0.6,
    'Павлодар': 0.75,
    'Усть-Каменогорск': 0.65,
    'Семей': 0.7,
    'Атырау': 0.8
  };

  const periodMultiplier = {
    'day': 1.0,
    'yesterday': 1.0,
    'week': 7.0,
    'month': 30.0
  };

  const baseMultiplier = (cityMultiplier[city] || 1.0) * (periodMultiplier[period] || 1.0);
  
  // Add some randomness
  const random = () => 0.85 + Math.random() * 0.3;

  return {
    attendance: {
      pie: [
        { value: Math.round(450 * baseMultiplier * random()), name: '1-4 классы', itemStyle: { color: '#60a5fa' } },
        { value: Math.round(595 * baseMultiplier * random()), name: '5-11 классы', itemStyle: { color: '#34d399' } },
        { value: Math.round(189 * baseMultiplier * random()), name: 'Персонал', itemStyle: { color: '#fbbf24' } }
      ],
      bar: {
        present: [
          Math.round(69 * random()),
          Math.round(56 * random()),
          Math.round(63 * random())
        ],
        absent: [
          Math.round(31 * random()),
          Math.round(44 * random()),
          Math.round(37 * random())
        ]
      }
    },
    nutrition: {
      pie: [
        { value: Math.round(456 * baseMultiplier * random()), name: '1-4 классы', itemStyle: { color: '#60a5fa' } },
        { value: Math.round(531 * baseMultiplier * random()), name: '5-11 классы', itemStyle: { color: '#34d399' } }
      ],
      bar: {
        received: [
          Math.round(75 * random()),
          Math.round(62 * random()),
          Math.round(68 * random())
        ],
        notReceived: [
          Math.round(25 * random()),
          Math.round(38 * random()),
          Math.round(32 * random())
        ]
      }
    },
    library: {
      pie: [
        { value: Math.round(234 * baseMultiplier * random()), name: '1-4 классы', itemStyle: { color: '#60a5fa' } },
        { value: Math.round(289 * baseMultiplier * random()), name: '5-11 классы', itemStyle: { color: '#34d399' } },
        { value: Math.round(156 * baseMultiplier * random()), name: 'Персонал', itemStyle: { color: '#fbbf24' } }
      ],
      bar: {
        visited: [
          Math.round(65 * random()),
          Math.round(58 * random()),
          Math.round(52 * random())
        ],
        notVisited: [
          Math.round(35 * random()),
          Math.round(42 * random()),
          Math.round(48 * random())
        ]
      }
    },
    summary: {
      total: Math.round(1234 * baseMultiplier * random()),
      attended: Math.round(1045 * baseMultiplier * random()),
      nutrition: Math.round(987 * baseMultiplier * random()),
      nutrition14: Math.round(456 * baseMultiplier * random()),
      nutrition511: Math.round(531 * baseMultiplier * random()),
      savings: Math.round(124567 * baseMultiplier * random())
    }
  };
}

// Update summary statistics cards
export function updateSummaryCards(summary) {
  const summaryCards = [
    { selector: '.bg-gray-50 .text-2xl', value: summary.total.toLocaleString('ru-RU') },
    { selector: '.bg-blue-50 .text-2xl', value: summary.attended.toLocaleString('ru-RU') },
    { selector: '.bg-green-50 .text-2xl', value: summary.nutrition.toLocaleString('ru-RU') },
    { selector: '.bg-purple-50 .text-2xl', value: summary.nutrition14.toLocaleString('ru-RU') },
    { selector: '.bg-orange-50 .text-2xl', value: summary.nutrition511.toLocaleString('ru-RU') }
  ];
  
  summaryCards.forEach(card => {
    const element = document.querySelector(card.selector);
    if (element) {
      element.textContent = card.value;
    }
  });
  
  // Update savings
  const savingsElement = document.querySelector('.bg-gradient-to-r .text-2xl');
  if (savingsElement) {
    savingsElement.textContent = `₽${summary.savings.toLocaleString('ru-RU')}`;
  }
}
