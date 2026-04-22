/**
 * Debug Dashboard Utility
 * Provides debugging functions for dashboard issues
 */

/**
 * Debug dashboard data
 */
export const debugDashboard = () => {
  console.groupCollapsed("📊 Dashboard Debug Info");

  // Check localStorage for any cached data
  const cachedData = localStorage.getItem('dashboardData');
  console.log("--- Cached Dashboard Data ---");
  console.log("Cached Data:", cachedData ? JSON.parse(cachedData) : "No cached data");

  // Check session storage
  const sessionData = sessionStorage.getItem('dashboardData');
  console.log("--- Session Storage Data ---");
  console.log("Session Data:", sessionData ? JSON.parse(sessionData) : "No session data");

  // Check current URL and state
  console.log("--- Current State ---");
  console.log("Current URL:", window.location.href);
  console.log("Current Path:", window.location.pathname);
  console.log("Current Search:", window.location.search);
  console.log("Current Hash:", window.location.hash);

  // Check for any global dashboard state
  if (window.dashboardState) {
    console.log("--- Global Dashboard State ---");
    console.log("Dashboard State:", window.dashboardState);
  }

  // Check for any errors in console
  console.log("--- Console Errors ---");
  const errors = [];
  const originalError = console.error;
  console.error = (...args) => {
    errors.push(args);
    originalError.apply(console, args);
  };

  console.groupEnd();
};

/**
 * Force refresh dashboard
 */
export const forceRefreshDashboard = () => {
  console.log("🔄 Force refreshing dashboard...");
  
  // Clear any cached data
  localStorage.removeItem('dashboardData');
  sessionStorage.removeItem('dashboardData');
  
  // Clear any global state
  if (window.dashboardState) {
    delete window.dashboardState;
  }
  
  // Force page reload
  window.location.reload();
};

/**
 * Check dashboard API response
 */
export const checkDashboardAPI = async () => {
  console.log("🔍 Checking dashboard API...");
  
  try {
    const response = await fetch('/api/instructor/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log("API Response Status:", response.status);
    console.log("API Response Headers:", response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log("API Response Data:", data);
      return data;
    } else {
      console.error("API Error:", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("API Request Failed:", error);
    return null;
  }
};

/**
 * Debug class creation
 */
export const debugClassCreation = () => {
  console.groupCollapsed("🎓 Class Creation Debug Info");
  
  // Check if there are any pending class creations
  const pendingCreations = localStorage.getItem('pendingClassCreations');
  console.log("--- Pending Class Creations ---");
  console.log("Pending:", pendingCreations ? JSON.parse(pendingCreations) : "None");
  
  // Check recent API calls
  console.log("--- Recent API Calls ---");
  if (window.recentAPICalls) {
    console.log("Recent API Calls:", window.recentAPICalls);
  }
  
  console.groupEnd();
};

// Make available globally for debugging
if (import.meta.env.DEV) {
  window.debugDashboard = debugDashboard;
  window.forceRefreshDashboard = forceRefreshDashboard;
  window.checkDashboardAPI = checkDashboardAPI;
  window.debugClassCreation = debugClassCreation;
}
