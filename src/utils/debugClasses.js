/**
 * Debug Classes Utility
 * Provides debugging functions for classes-related issues
 */

/**
 * Debug classes data
 */
export const debugClasses = () => {
  console.groupCollapsed("📚 Classes Debug Info");

  // Check localStorage for any cached data
  const cachedData = localStorage.getItem('classesData');
  console.log("--- Cached Classes Data ---");
  console.log("Cached Data:", cachedData ? JSON.parse(cachedData) : "No cached data");

  // Check session storage
  const sessionData = sessionStorage.getItem('classesData');
  console.log("--- Session Storage Data ---");
  console.log("Session Data:", sessionData ? JSON.parse(sessionData) : "No session data");

  // Check current URL and state
  console.log("--- Current State ---");
  console.log("Current URL:", window.location.href);
  console.log("Current Path:", window.location.pathname);
  console.log("Current Search:", window.location.search);
  console.log("Current Hash:", window.location.hash);

  // Check for any global classes state
  if (window.classesState) {
    console.log("--- Global Classes State ---");
    console.log("Classes State:", window.classesState);
  }

  console.groupEnd();
};

/**
 * Force refresh classes
 */
export const forceRefreshClasses = () => {
  console.log("🔄 Force refreshing classes...");
  
  // Clear any cached data
  localStorage.removeItem('classesData');
  sessionStorage.removeItem('classesData');
  
  // Clear any global state
  if (window.classesState) {
    delete window.classesState;
  }
  
  // Force page reload
  window.location.reload();
};

/**
 * Check classes API response
 */
export const checkClassesAPI = async () => {
  console.log("🔍 Checking classes API...");
  
  try {
    const response = await fetch('/api/classes', {
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
      console.log("Classes Count:", data.length);
      data.forEach((cls, index) => {
        console.log(`Class ${index + 1}:`, {
          id: cls.id,
          name: cls.name,
          assignments: cls.assignments?.length || 0,
          enrollments: cls.enrollments?.length || 0,
          instructor: cls.instructor?.fullName
        });
      });
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
 * Debug assignment creation
 */
export const debugAssignmentCreation = () => {
  console.groupCollapsed("📝 Assignment Creation Debug Info");
  
  // Check if there are any pending assignment creations
  const pendingCreations = localStorage.getItem('pendingAssignmentCreations');
  console.log("--- Pending Assignment Creations ---");
  console.log("Pending:", pendingCreations ? JSON.parse(pendingCreations) : "None");
  
  // Check recent API calls
  console.log("--- Recent API Calls ---");
  if (window.recentAPICalls) {
    console.log("Recent API Calls:", window.recentAPICalls);
  }
  
  // Check current user info
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    console.log("--- Current User Info ---");
    console.log("User:", userData);
    console.log("User Role:", userData.role);
    console.log("User ID:", userData.id);
  }
  
  console.groupEnd();
};

/**
 * Clear all classes data
 */
export const clearClassesData = () => {
  console.log("🧹 Clearing all classes data...");
  
  // Clear localStorage
  localStorage.removeItem('classesData');
  localStorage.removeItem('classes');
  localStorage.removeItem('recentClasses');
  
  // Clear sessionStorage
  sessionStorage.removeItem('classesData');
  sessionStorage.removeItem('classes');
  sessionStorage.removeItem('recentClasses');
  
  // Clear any global state
  if (window.classesState) {
    delete window.classesState;
  }
  
  // Clear caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('classes') || name.includes('assignments')) {
          caches.delete(name);
        }
      });
    });
  }
  
  console.log("✅ Classes data cleared");
};

// Make available globally for debugging
if (import.meta.env.DEV) {
  window.debugClasses = debugClasses;
  window.forceRefreshClasses = forceRefreshClasses;
  window.checkClassesAPI = checkClassesAPI;
  window.debugAssignmentCreation = debugAssignmentCreation;
  window.clearClassesData = clearClassesData;
}
