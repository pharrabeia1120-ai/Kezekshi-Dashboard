// Security utilities for sanitization and validation

import { CONFIG } from './config.js';

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Create element with safe text content
 * @param {string} tag - HTML tag name
 * @param {string} text - Text content
 * @param {string} className - CSS class
 * @returns {HTMLElement}
 */
export function createSafeElement(tag, text, className = '') {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

/**
 * Validate page name against allowed pages
 * @param {string} pageName - Page name to validate
 * @returns {string} - Valid page name or default
 */
export function validatePageName(pageName) {
  return CONFIG.ALLOWED_PAGES.includes(pageName) ? pageName : 'home';
}

/**
 * Validate city name against allowed cities
 * @param {string} city - City name to validate
 * @returns {string} - Valid city name or default
 */
export function validateCity(city) {
  return CONFIG.ALLOWED_CITIES.includes(city) ? city : 'Астана';
}

/**
 * Validate and sanitize school ID
 * @param {any} id - School ID to validate
 * @returns {number|null} - Valid school ID or null
 */
export function validateSchoolId(id) {
  const parsed = parseInt(id, 10);
  return !isNaN(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Sanitize array of IDs
 * @param {Array} ids - Array of IDs
 * @returns {Array<number>} - Sanitized array
 */
export function sanitizeIdArray(ids) {
  if (!Array.isArray(ids)) return [];
  return ids.map(id => validateSchoolId(id)).filter(id => id !== null);
}

/**
 * Validate date object
 * @param {any} date - Date to validate
 * @returns {Date|null} - Valid date or null
 */
export function validateDate(date) {
  if (!(date instanceof Date)) return null;
  if (isNaN(date.getTime())) return null;
  
  // Don't allow future dates
  const now = new Date();
  if (date > now) return null;
  
  // Don't allow dates more than 2 years in the past
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(now.getFullYear() - 2);
  if (date < twoYearsAgo) return null;
  
  return date;
}

/**
 * Safe localStorage get with validation
 * @param {string} key - localStorage key
 * @param {Function} validator - Validation function
 * @param {any} defaultValue - Default value if validation fails
 * @returns {any} - Validated value or default
 */
export function safeLocalStorageGet(key, validator, defaultValue) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return defaultValue;
    
    const parsed = JSON.parse(value);
    return validator ? validator(parsed) : parsed;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Safe localStorage set
 * @param {string} key - localStorage key
 * @param {any} value - Value to store
 */
export function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
}

/**
 * Validate percentage value
 * @param {number} value - Percentage value
 * @returns {number} - Clamped percentage (0-100)
 */
export function validatePercentage(value) {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return Math.max(0, Math.min(100, num));
}

/**
 * Safe division with zero check
 * @param {number} numerator
 * @param {number} denominator
 * @param {number} defaultValue - Default value if division by zero
 * @returns {number}
 */
export function safeDivide(numerator, denominator, defaultValue = 0) {
  if (denominator === 0 || !isFinite(denominator)) return defaultValue;
  const result = numerator / denominator;
  return isFinite(result) ? result : defaultValue;
}
