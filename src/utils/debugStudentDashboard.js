/**
 * Debug Student Dashboard Utility
 * Provides debugging functions for student dashboard issues
 */

/**
 * Debug student dashboard data
 */
export const debugStudentDashboard = () => {
  console.groupCollapsed("📚 Student Dashboard Debug Info");

  // Check localStorage for any cached data
  const cachedData = localStorage.getItem('studentDashboardData');
  console.log("--- Cached Student Dashboard Data ---");
  console.log("Cached Data:", cachedData ? JSON.parse(cachedData) : "No cached data");

  // Check session storage
  const sessionData = sessionStorage.getItem('studentDashboardData');
  console.log("--- Session Storage Data ---");
  console.log("Session Data:", sessionData ? JSON.parse(sessionData) : "No session data");

  // Check current URL and state
  console.log("--- Current State ---");
  console.log("Current URL:", window.location.href);
  console.log("Current Path:", window.location.pathname);
  console.log("Current Search:", window.location.search);
  console.log("Current Hash:", window.location.hash);

  // Check for any global dashboard state
  if (window.studentDashboardState) {
    console.log("--- Global Student Dashboard State ---");
    console.log("Dashboard State:", window.studentDashboardState);
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
 * Force refresh student dashboard
 */
export const forceRefreshStudentDashboard = () => {
  console.log("🔄 Force refreshing student dashboard...");
  
  // Clear any cached data
  localStorage.removeItem('studentDashboardData');
  sessionStorage.removeItem('studentDashboardData');
  
  // Clear any global state
  if (window.studentDashboardState) {
    delete window.studentDashboardState;
  }
  
  // Force page reload
  window.location.reload();
};

/**
 * Check student classes API response
 */
export const checkStudentClassesAPI = async () => {
  console.log("🔍 Checking student classes API...");
  
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
          instructor: cls.instructor?.fullName,
          enrollments: cls.enrollments?.length || 0,
          currentUserEnrollment: cls.currentUserEnrollment
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
 * Debug class enrollment
 */
export const debugClassEnrollment = () => {
  console.groupCollapsed("🎓 Class Enrollment Debug Info");
  
  // Check if there are any pending enrollments
  const pendingEnrollments = localStorage.getItem('pendingEnrollments');
  console.log("--- Pending Enrollments ---");
  console.log("Pending:", pendingEnrollments ? JSON.parse(pendingEnrollments) : "None");
  
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
 * Clear all student dashboard data
 */
export const clearStudentDashboardData = () => {
  console.log("🧹 Clearing all student dashboard data...");
  
  // Clear localStorage
  localStorage.removeItem('studentDashboardData');
  localStorage.removeItem('classes');
  localStorage.removeItem('recentClasses');
  
  // Clear sessionStorage
  sessionStorage.removeItem('studentDashboardData');
  sessionStorage.removeItem('classes');
  sessionStorage.removeItem('recentClasses');
  
  // Clear any global state
  if (window.studentDashboardState) {
    delete window.studentDashboardState;
  }
  
  // Clear caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('student') || name.includes('dashboard') || name.includes('classes')) {
          caches.delete(name);
        }
      });
    });
  }
  
  console.log("✅ Student dashboard data cleared");
};

// Make available globally for debugging
if (import.meta.env.DEV) {
  window.debugStudentDashboard = debugStudentDashboard;
  window.forceRefreshStudentDashboard = forceRefreshStudentDashboard;
  window.checkStudentClassesAPI = checkStudentClassesAPI;
  window.debugClassEnrollment = debugClassEnrollment;
  window.clearStudentDashboardData = clearStudentDashboardData;
}
