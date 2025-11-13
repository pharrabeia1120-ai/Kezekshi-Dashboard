// API client for backend integration

import { CONFIG } from './config.js';
import { logger } from './logger.js';

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic fetch wrapper with error handling and retry logic
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
async function fetchWithRetry(endpoint, options = {}, retryCount = 0) {
  const url = `${CONFIG.API.BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.API.TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new APIError(
        errorData?.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeout);
    
    // Retry on network errors
    if (error.name === 'AbortError' || error.name === 'TypeError') {
      if (retryCount < CONFIG.API.RETRY_ATTEMPTS) {
        logger.warn(`Retrying request to ${endpoint} (attempt ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return fetchWithRetry(endpoint, options, retryCount + 1);
      }
    }
    
    logger.error('API request failed:', error);
    throw error;
  }
}

/**
 * API client
 */
export const api = {
  /**
   * Get user profile
   */
  async getUserProfile() {
    return fetchWithRetry('/user/profile');
  },
  
  /**
   * Get schools by city
   * @param {string} city - City name
   * @param {Array<number>} schoolIds - Optional array of specific school IDs
   */
  async getSchools(city, schoolIds = null) {
    const params = new URLSearchParams({ city });
    if (schoolIds && schoolIds.length > 0) {
      params.append('ids', schoolIds.join(','));
    }
    return fetchWithRetry(`/schools?${params}`);
  },
  
  /**
   * Get analytics data
   * @param {Object} filters - Filter parameters
   */
  async getAnalytics(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.schoolIds && filters.schoolIds.length > 0) {
      params.append('schoolIds', filters.schoolIds.join(','));
    }
    if (filters.period) params.append('period', filters.period);
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
    
    return fetchWithRetry(`/analytics?${params}`);
  },
  
  /**
   * Get attendance data for charts
   * @param {Object} filters - Filter parameters
   */
  async getAttendanceData(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.schoolIds && filters.schoolIds.length > 0) {
      params.append('schoolIds', filters.schoolIds.join(','));
    }
    if (filters.period) params.append('period', filters.period);
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
    
    return fetchWithRetry(`/analytics/attendance?${params}`);
  },
  
  /**
   * Get nutrition data for charts
   * @param {Object} filters - Filter parameters
   */
  async getNutritionData(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.schoolIds && filters.schoolIds.length > 0) {
      params.append('schoolIds', filters.schoolIds.join(','));
    }
    if (filters.period) params.append('period', filters.period);
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
    
    return fetchWithRetry(`/analytics/nutrition?${params}`);
  },
  
  /**
   * Get library data for charts
   * @param {Object} filters - Filter parameters
   */
  async getLibraryData(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.schoolIds && filters.schoolIds.length > 0) {
      params.append('schoolIds', filters.schoolIds.join(','));
    }
    if (filters.period) params.append('period', filters.period);
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
    
    return fetchWithRetry(`/analytics/library?${params}`);
  },
  
  /**
   * Get reports/statistics data
   * @param {Object} filters - Filter parameters
   */
  async getReportsData(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.schoolIds && filters.schoolIds.length > 0) {
      params.append('schoolIds', filters.schoolIds.join(','));
    }
    if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
    if (filters.category) params.append('category', filters.category);
    
    return fetchWithRetry(`/reports?${params}`);
  },
  
  /**
   * Detect user's city by IP or geolocation
   */
  async detectCity() {
    return fetchWithRetry('/geo/detect-city');
  },
  
  /**
   * Get home page data
   */
  async getHomeData() {
    return fetchWithRetry('/home');
  },
};
