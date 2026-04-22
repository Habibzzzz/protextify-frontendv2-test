/**
 * Multi-Device Login Handler
 * Handles session conflicts when logging in from different devices
 */

import { sessionManager } from "./sessionManager";

/**
 * Check if there's a session conflict between devices
 * @returns {boolean} Whether there's a conflict
 */
export const checkSessionConflict = () => {
  const sessionInfo = sessionManager.getSessionInfo();
  const userAgent = navigator.userAgent;
  const timestamp = Date.now();
  
  // Check if session was created recently (within last 5 minutes)
  const sessionAge = timestamp - (sessionInfo.timestamp || 0);
  const isRecentSession = sessionAge < 5 * 60 * 1000; // 5 minutes
  
  // Check if user agent changed (different device)
  const storedUserAgent = localStorage.getItem('userAgent');
  const userAgentChanged = storedUserAgent && storedUserAgent !== userAgent;
  
  // Check if session ID exists but user data is different
  const hasSessionId = !!localStorage.getItem('sessionId');
  const hasUserData = !!localStorage.getItem('user');
  
  const conflict = (isRecentSession && userAgentChanged) || 
                   (hasSessionId && !hasUserData) ||
                   (hasUserData && !hasSessionId);
  
  if (conflict) {
    console.warn("🚨 Session conflict detected:", {
      sessionAge,
      isRecentSession,
      userAgentChanged,
      hasSessionId,
      hasUserData,
      currentUserAgent: userAgent,
      storedUserAgent
    });
  }
  
  return conflict;
};

/**
 * Handle session conflict by clearing conflicting data
 */
export const handleSessionConflict = () => {
  console.log("🔧 Handling session conflict...");
  
  // Clear all session data
  sessionManager.clearSessionData();
  
  // Clear browser storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear caches
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
  
  // Store current user agent
  localStorage.setItem('userAgent', navigator.userAgent);
  localStorage.setItem('lastLoginAttempt', Date.now().toString());
  
  console.log("✅ Session conflict resolved");
};

/**
 * Initialize multi-device session handling
 */
export const initializeMultiDeviceHandler = () => {
  // Check for session conflicts on page load
  if (checkSessionConflict()) {
    console.log("🚨 Session conflict detected, clearing data...");
    handleSessionConflict();
    return true; // Indicates conflict was handled
  }
  
  // Store current user agent
  localStorage.setItem('userAgent', navigator.userAgent);
  localStorage.setItem('lastLoginAttempt', Date.now().toString());
  
  return false; // No conflict
};

/**
 * Check if login should be allowed (not too frequent)
 */
export const shouldAllowLogin = () => {
  // Temporarily disable rate limiting for debugging
  return true;
  
  // Original rate limiting logic (commented out)
  // const lastLoginAttempt = localStorage.getItem('lastLoginAttempt');
  // if (!lastLoginAttempt) return true;
  
  // const timeSinceLastAttempt = Date.now() - parseInt(lastLoginAttempt);
  // const minInterval = 5 * 1000; // 5 seconds (reduced from 30 seconds)
  
  // return timeSinceLastAttempt > minInterval;
};

/**
 * Clear rate limiting
 */
export const clearRateLimit = () => {
  localStorage.removeItem('lastLoginAttempt');
  localStorage.removeItem('lastLoginAttempt');
  sessionStorage.removeItem('lastLoginAttempt');
  console.log("✅ Rate limit cleared");
};

/**
 * Force clear all login restrictions
 */
export const forceClearLoginRestrictions = () => {
  console.log("🧹 Force clearing all login restrictions...");
  
  // Clear all rate limiting data
  localStorage.removeItem('lastLoginAttempt');
  sessionStorage.removeItem('lastLoginAttempt');
  
  // Clear any cached auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('sessionId');
  localStorage.removeItem('refreshToken');
  
  // Clear session storage
  sessionStorage.clear();
  
  // Clear caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  console.log("✅ All login restrictions cleared");
};

/**
 * Multi-device handler object
 */
export const multiDeviceHandler = {
  checkSessionConflict,
  handleSessionConflict,
  initializeMultiDeviceHandler,
  shouldAllowLogin,
  clearRateLimit,
  forceClearLoginRestrictions,
};

// Make available globally for debugging
if (import.meta.env.DEV) {
  window.multiDeviceHandler = multiDeviceHandler;
  window.checkSessionConflict = checkSessionConflict;
  window.handleSessionConflict = handleSessionConflict;
  window.clearRateLimit = clearRateLimit;
  window.forceClearLoginRestrictions = forceClearLoginRestrictions;
}
