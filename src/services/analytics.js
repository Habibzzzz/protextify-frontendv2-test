import api from "./api";

/**
 * Mengambil data agregat untuk dasbor instruktur.
 * @returns {Promise<object>} Data dashboard dari backend.
 */
const getInstructorDashboardData = async () => {
  try {
    const response = await api.get("/instructor/dashboard");
    return response;
  } catch (error) {
    console.error("Failed to fetch instructor dashboard data:", error);
    throw error;
  }
};

/**
 * Mengambil data analytics untuk instruktur berdasarkan range waktu.
 * @param {string} range - Range waktu (7d, 30d, 90d)
 * @returns {Promise<object>} Data analytics dari backend.
 */
const getInstructorAnalytics = async (range = "7d") => {
  try {
    const data = await api.get(`/instructor/analytics?range=${range}`);
    console.log("Raw response from analytics API:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch instructor analytics data:", error);
    throw error;
  }
};

const analyticsService = {
  getInstructorDashboardData,
  getInstructorAnalytics,
};

export default analyticsService;
