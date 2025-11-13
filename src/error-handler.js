// Global error handler

import { logger } from './logger.js';
import { APIError } from './api.js';

/**
 * Show error toast notification
 * @param {string} message - Error message
 * @param {number} duration - Duration in ms
 */
export function showErrorToast(message, duration = 5000) {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.error-toast');
  existingToasts.forEach(toast => toast.remove());
  
  const toast = document.createElement('div');
  toast.className = 'error-toast fixed top-4 right-4 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-[9999] max-w-md animate-slide-in';
  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <div class="flex-1">
        <p class="font-semibold">Ошибка</p>
        <p class="text-sm opacity-90 mt-1">${escapeHTML(message)}</p>
      </div>
      <button class="ml-2 hover:opacity-75" onclick="this.parentElement.parentElement.remove()">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Show success toast notification
 * @param {string} message - Success message
 * @param {number} duration - Duration in ms
 */
export function showSuccessToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'success-toast fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-[9999] max-w-md animate-slide-in';
  toast.innerHTML = `
    <div class="flex items-start gap-3">
      <svg class="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="flex-1">${escapeHTML(message)}</p>
      <button class="ml-2 hover:opacity-75" onclick="this.parentElement.parentElement.remove()">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Handle API errors
 * @param {Error} error - Error object
 */
export function handleAPIError(error) {
  logger.error('API Error:', error);
  
  if (error instanceof APIError) {
    switch (error.status) {
      case 400:
        showErrorToast('Неверные параметры запроса');
        break;
      case 401:
        showErrorToast('Требуется авторизация');
        // Redirect to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        break;
      case 403:
        showErrorToast('Доступ запрещён');
        break;
      case 404:
        showErrorToast('Данные не найдены');
        break;
      case 500:
        showErrorToast('Ошибка сервера. Попробуйте позже');
        break;
      default:
        showErrorToast(error.message || 'Произошла ошибка');
    }
  } else if (error.name === 'AbortError') {
    showErrorToast('Превышено время ожидания');
  } else if (error.name === 'TypeError') {
    showErrorToast('Ошибка сети. Проверьте подключение');
  } else {
    showErrorToast('Произошла неизвестная ошибка');
  }
}

/**
 * Global error handlers
 */
export function initErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection:', event.reason);
    handleAPIError(event.reason);
    event.preventDefault();
  });
  
  // Handle global errors
  window.addEventListener('error', (event) => {
    logger.error('Global error:', event.error);
  });
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
  
  .error-toast, .success-toast {
    transition: all 0.3s ease-out;
  }
`;
document.head.appendChild(style);
