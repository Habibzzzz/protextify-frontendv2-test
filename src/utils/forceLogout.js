/**
 * Force Logout Utility
 * Clears all session data and forces a complete logout
 */

import { sessionManager } from "./sessionManager";

/**
 * Force logout and clear all data
 */
export const forceLogout = () => {
  console.log("🧹 Force logout initiated...");
  
  // Clear all session data
  sessionManager.clearSessionData();
  
  // Clear any cached data
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  // Clear service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
    });
  }
  
  // Force redirect to login
  window.location.href = '/auth/login';
};

/**
 * Force clear session for multi-device login
 */
export const forceClearSession = () => {
  console.log("🧹 Force clear session for multi-device login...");
  
  // Clear all session data
  sessionManager.clearSessionData();
  
  // Clear any cached data
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  // Clear service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
    });
  }
  
  // Clear browser storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Force reload to clear any cached state
  window.location.reload();
};

/**
 * Clear all data without redirect
 */
export const clearAllData = () => {
  console.log("🧹 Clearing all data...");
  
  // Clear all session data
  sessionManager.clearSessionData();
  
  // Clear any cached data
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  // Clear service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
    });
  }
};

// Make available globally for debugging
if (import.meta.env.DEV) {
  window.forceLogout = forceLogout;
  window.forceClearSession = forceClearSession;
  window.clearAllData = clearAllData;
}
