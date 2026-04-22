import api from "./api";
import { sessionManager } from "../utils/sessionManager";

/**
 * Login dengan email dan password
 * @param {object} credentials { email, password }
 * @returns {object} { accessToken, user }
 */
const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    
    // Initialize session with proper cleanup
    if (response.accessToken) {
      sessionManager.initializeSession(response.user, response.accessToken);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Register user baru
 * @param {object} userData { email, password, fullName, role, institution }
 * @returns {object} { message, user }
 */
const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {object} user profile
 */
const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/me");
    
    // Validate session consistency
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const parsedStoredUser = JSON.parse(storedUser);
      
      // Use session manager for validation
      if (!sessionManager.validateSessionConsistency(response, parsedStoredUser)) {
        console.warn("Session inconsistency detected, clearing session");
        clearSession();
        throw new Error("Session data inconsistent");
      }
      
      // Update stored user data with fresh data from server
      localStorage.setItem("user", JSON.stringify(response));
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile (fullName, institution)
 * @param {object} userData { fullName?, institution? }
 * @returns {object} updated user profile
 */
const updateProfile = async (userData) => {
  try {
    const response = await api.patch("/users/me", userData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Send email verification
 * @param {string} email
 * @returns {object} { message }
 */
const sendVerification = async (email) => {
  try {
    const response = await api.post("/auth/send-verification", { email });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify email with token
 * @param {string} token
 * @returns {object} { message }
 */
const verifyEmail = async (token) => {
  try {
    const response = await api.post("/auth/verify-email", { token });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Google OAuth login (redirect)
 */
const googleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
};

/**
 * Get Google user after login (JWT required)
 * @returns {object} { accessToken, user }
 */
const getGoogleUser = async () => {
  try {
    const response = await api.get("/auth/google/user");
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Get Google callback response as JSON (for ?format=json)
 * @returns {object} { accessToken, user }
 */
const getGoogleCallbackJson = async () => {
  try {
    const response = await api.get("/auth/google/callback?format=json");
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Endpoint khusus instructor (role guard)
 * @returns {object} { message }
 */
const getInstructorOnly = async () => {
  try {
    const response = await api.get("/auth/instructor-only");
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout (clear local data)
 */
const logout = () => {
  // Use session manager for comprehensive cleanup
  sessionManager.clearSessionData();
  
  // Redirect to login instead of reload
  window.location.href = '/auth/login';
};

/**
 * Clear session data without redirect (for internal use)
 */
const clearSession = () => {
  // Use session manager for comprehensive cleanup
  sessionManager.clearSessionData();
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

/**
 * Get token from localStorage
 * @returns {string|null}
 */
const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Refresh token (if backend supports it)
 * @returns {object} { accessToken }
 */
const refreshToken = async () => {
  try {
    const response = await api.post("/auth/refresh");
    if (response.accessToken) {
      localStorage.setItem("token", response.accessToken);
    }
    return response;
  } catch (error) {
    logout();
    throw error;
  }
};

/**
 * Forgot password (send reset link)
 * @param {string} email
 * @returns {object} { message }
 */
const forgotPassword = async (email) => {
  return await api.post("/auth/forgot-password", { email });
};

/**
 * Reset password with token
 * @param {object} payload { token, newPassword }
 * @returns {object} { message }
 */
const resetPassword = async ({ token, newPassword }) => {
  return await api.post("/auth/reset-password", { token, newPassword });
};

const authService = {
  login,
  register,
  getCurrentUser,
  updateProfile,
  sendVerification,
  verifyEmail,
  googleLogin,
  getGoogleUser,
  getGoogleCallbackJson,
  getInstructorOnly,
  logout,
  clearSession,
  isAuthenticated,
  getToken,
  refreshToken,
  forgotPassword,
  resetPassword,
};

export default authService;
