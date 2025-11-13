// Logging utility with environment-aware configuration

import { CONFIG } from './config.js';

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = LOG_LEVELS[CONFIG.LOGGING.LEVEL] || LOG_LEVELS.error;

/**
 * Logger with environment-aware output
 */
export const logger = {
  debug: (...args) => {
    if (CONFIG.LOGGING.ENABLED && LOG_LEVELS.debug >= currentLevel) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args) => {
    if (CONFIG.LOGGING.ENABLED && LOG_LEVELS.info >= currentLevel) {
      console.info('[INFO]', ...args);
    }
  },
  
  warn: (...args) => {
    if (LOG_LEVELS.warn >= currentLevel) {
      console.warn('[WARN]', ...args);
    }
  },
  
  error: (...args) => {
    if (LOG_LEVELS.error >= currentLevel) {
      console.error('[ERROR]', ...args);
    }
  },
};
