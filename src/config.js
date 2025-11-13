// Configuration file for the application

export const CONFIG = {
  // Allowed pages for navigation
  ALLOWED_PAGES: ['home', 'analytics', 'reports'],
  
  // Allowed cities
  ALLOWED_CITIES: ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Атырау'],
  
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_ITEMS_PER_PAGE: 10,
    ITEMS_PER_PAGE_OPTIONS: [10, 25, 50, 100],
  },
  
  // Geolocation
  GEOLOCATION: {
    TIMEOUT: 10000,
    ENABLE_HIGH_ACCURACY: false,
    NOMINATIM_DELAY: 1000, // Rate limit for OpenStreetMap
  },
  
  // Performance
  DEBOUNCE_DELAY: 300,
  SKELETON_TIMEOUT: 800,
  CHART_INIT_DELAY: 300,
  
  // Features
  FEATURES: {
    ENABLE_GEOLOCATION: false,
    ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    ENABLE_GDPR_CONSENT: false,
  },
  
  // Logging
  LOGGING: {
    ENABLED: import.meta.env.MODE === 'development',
    LEVEL: import.meta.env.MODE === 'development' ? 'debug' : 'error',
  }
};
