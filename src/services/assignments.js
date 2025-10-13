// src/services/assignments.js
import api from "./api";

/**
 * Mendapat semua assignment (admin/instructor only)
 */
const assignmentsService = {
  getAssignments: async () => {
    try {
      const response = await api.get("/assignments");
      return Array.isArray(response) ? response : [];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Membuat assignment baru di kelas (instructor only)
   * @param {string} classId
   * @param {object} assignmentData
   * @returns {object} response sesuai BE
   */
  createAssignment: async (classId, assignmentData) => {
    try {
      const response = await api.post(
        `/classes/${classId}/assignments`,
        assignmentData
      );
      // Response sudah sesuai BE, tidak perlu mapping
      return response;
    } catch (error) {
      if (error.response?.status === 422) {
        throw {
          ...error,
          message: "Data assignment tidak valid. Periksa kembali form Anda.",
        };
      } else if (error.response?.status === 403) {
        throw {
          ...error,
          message:
            "Anda tidak memiliki akses untuk membuat assignment di kelas ini.",
        };
      }
      throw error;
    }
  },

  /**
   * Mendapat detail assignment by ID (untuk detail assignment global)
   * @param {string} id
   * @returns {object} assignment detail
   */
  getAssignmentById: async (id) => {
    try {
      const response = await api.get(`/assignments/${id}`);
      // Mapping sesuai BE jika perlu
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapat daftar assignment terbaru untuk student dashboard
   * @param {number} limit
   * @returns {Array} array assignment sesuai BE
   */
  getRecentAssignments: async (limit = 3) => {
    try {
      const response = await api.get("/assignments/recent", {
        params: { limit },
      });

      if (!Array.isArray(response)) return [];

      // Mapping sesuai BE
      return response.map((item) => ({
        id: item.id,
        title: item.title,
        instructions: item.instructions,
        deadline: item.deadline,
        classId: item.classId,
        class: item.class ? { name: item.class.name } : { name: "" },
        expectedStudentCount: item.expectedStudentCount,
        active: !!item.active,
        createdAt: item.createdAt,
        submissions: Array.isArray(item.submissions) ? item.submissions : [],
        _count: item._count || { submissions: 0 },
      }));
    } catch (error) {
      console.error("Error fetching recent assignments:", error);
      return [];
    }
  },

  /**
   * Mendapat daftar semua assignment di kelas tertentu
   * @param {string} classId
   * @returns {Array} array assignment sesuai BE
   */
  getClassAssignments: async (classId) => {
    try {
      const response = await api.get(`/classes/${classId}/assignments`);
      if (!Array.isArray(response)) return [];
      return response.map((item) => ({
        id: item.id,
        title: item.title,
        instructions: item.instructions,
        deadline: item.deadline,
        classId: item.classId,
        expectedStudentCount: item.expectedStudentCount,
        active: !!item.active,
        createdAt: item.createdAt,
        submissions: Array.isArray(item.submissions) ? item.submissions : [],
        _count: item._count || { submissions: 0 },
      }));
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapat detail assignment by classId dan assignmentId (untuk halaman tulis tugas)
   * @param {string} classId
   * @param {string} assignmentId
   * @returns {object} assignment detail
   */
  getAssignmentDetail: async (classId, assignmentId) => {
    try {
      const response = await api.get(
        `/classes/${classId}/assignments/${assignmentId}`
      );
      // Mapping sesuai BE jika perlu
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mendapat data analytics untuk assignment tertentu.
   * @param {string} assignmentId
   * @returns {Promise<object>} Data analytics dari backend.
   */
  getAssignmentAnalytics: async (assignmentId) => {
    try {
      const response = await api.get(`/assignments/${assignmentId}/analytics`);
      return response;
    } catch (error) {
      console.error(
        `Failed to fetch analytics for assignment ${assignmentId}:`,
        error
      );
      throw error;
    }
  },

  /**
   * Mendapat overview submission untuk assignment tertentu (detail, stats, submissions).
   * @param {string} assignmentId
   * @returns {Promise<object>} Data overview dari backend.
   */
  getAssignmentSubmissionsOverview: async (assignmentId) => {
    try {
      const response = await api.get(
        `/assignments/${assignmentId}/submissions-overview`
      );
      return response;
    } catch (error) {
      console.error(
        `Failed to fetch submissions overview for assignment ${assignmentId}:`,
        error
      );
      throw error;
    }
  },
};

export default assignmentsService;
