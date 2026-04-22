/**
 * Session Management Utility
 * Handles session isolation and cache busting for production
 */

import { AUTH_STORAGE_KEYS, CACHE_BUSTING } from "./constants";

/**
 * Generate unique session ID
 * @returns {string} Unique session identifier
 */
export const generateSessionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `session_${timestamp}_${random}`;
};

/**
 * Clear all session data
 */
export const clearSessionData = () => {
  // Clear localStorage
  Object.values(AUTH_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear any cached data
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
};

/**
 * Validate session consistency
 * @param {object} currentUser - Current user from API
 * @param {object} storedUser - User data from localStorage
 * @returns {boolean} Whether session is consistent
 */
export const validateSessionConsistency = (currentUser, storedUser) => {
  if (!currentUser || !storedUser) {
    return false;
  }
  
  // Check if user IDs match
  if (currentUser.id !== storedUser.id) {
    console.warn("Session inconsistency: User ID mismatch");
    return false;
  }
  
  // Check if email matches (additional validation)
  if (currentUser.email !== storedUser.email) {
    console.warn("Session inconsistency: Email mismatch");
    return false;
  }
  
  return true;
};

/**
 * Get session info for debugging
 * @returns {object} Session information
 */
export const getSessionInfo = () => {
  return {
    sessionId: localStorage.getItem(AUTH_STORAGE_KEYS.SESSION_ID),
    hasToken: !!localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN),
    hasUser: !!localStorage.getItem(AUTH_STORAGE_KEYS.USER),
    cacheBusting: CACHE_BUSTING,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Force session refresh (for production cache issues)
 */
export const forceSessionRefresh = () => {
  if (CACHE_BUSTING.ENABLED) {
    // Add cache busting parameter to current URL
    const url = new URL(window.location);
    url.searchParams.set('_cb', CACHE_BUSTING.TIMESTAMP);
    window.location.href = url.toString();
  } else {
    // Simple reload for development
    window.location.reload();
  }
};

/**
 * Check if session is valid
 * @returns {boolean} Whether current session is valid
 */
export const isSessionValid = () => {
  const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
  const sessionId = localStorage.getItem(AUTH_STORAGE_KEYS.SESSION_ID);
  const user = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
  
  return !!(token && sessionId && user);
};

/**
 * Initialize session with proper cleanup
 * @param {object} userData - User data from login
 * @param {string} token - Authentication token
 * @returns {string} Generated session ID
 */
export const initializeSession = (userData, token) => {
  // Clear any existing session first
  clearSessionData();
  
  // Generate new session ID
  const sessionId = generateSessionId();
  
  // Store session data
  localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.SESSION_ID, sessionId);
  localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(userData));
  
  return sessionId;
};

/**
 * Session manager object
 */
export const sessionManager = {
  generateSessionId,
  clearSessionData,
  validateSessionConsistency,
  getSessionInfo,
  forceSessionRefresh,
  isSessionValid,
  initializeSession,
};
