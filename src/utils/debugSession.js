/**
 * Debug Session Utility
 * Helps debug session issues in production
 */

import { sessionManager } from "./sessionManager";

/**
 * Debug session information
 * @returns {object} Debug information
 */
export const debugSession = () => {
  const sessionInfo = sessionManager.getSessionInfo();
  const userAgent = navigator.userAgent;
  const url = window.location.href;
  const timestamp = new Date().toISOString();
  
  const debugInfo = {
    ...sessionInfo,
    userAgent,
    url,
    timestamp,
    localStorage: {
      keys: Object.keys(localStorage),
      size: JSON.stringify(localStorage).length,
    },
    sessionStorage: {
      keys: Object.keys(sessionStorage),
      size: JSON.stringify(sessionStorage).length,
    },
  };
  
  console.group("🔍 Session Debug Info");
  console.log("Session Info:", debugInfo);
  console.log("Full localStorage:", localStorage);
  console.log("Full sessionStorage:", sessionStorage);
  console.groupEnd();
  
  return debugInfo;
};

/**
 * Clear all data and force refresh (for debugging)
 */
export const forceClearAllData = () => {
  console.log("🧹 Force clearing all data...");
  
  // Clear all storage
  sessionManager.clearSessionData();
  
  // Clear any service worker caches
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
    });
  }
  
  // Force refresh
  sessionManager.forceSessionRefresh();
};

/**
 * Check for session conflicts
 * @returns {object} Conflict information
 */
export const checkSessionConflicts = () => {
  const conflicts = [];
  
  // Check for multiple user data
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log("Current stored user:", user);
    } catch (e) {
      conflicts.push("Invalid user data in localStorage");
    }
  }
  
  // Check for session ID consistency
  const sessionId = localStorage.getItem("sessionId");
  if (!sessionId) {
    conflicts.push("No session ID found");
  }
  
  // Check for token consistency
  const token = localStorage.getItem("token");
  if (!token) {
    conflicts.push("No token found");
  }
  
  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    sessionInfo: sessionManager.getSessionInfo(),
  };
};

/**
 * Debug utilities object
 */
export const debugUtils = {
  debugSession,
  forceClearAllData,
  checkSessionConflicts,
};

// Make debug utilities available globally in development
if (import.meta.env.DEV) {
  window.debugSession = debugSession;
  window.forceClearAllData = forceClearAllData;
  window.checkSessionConflicts = checkSessionConflicts;
  window.sessionManager = sessionManager;
}
