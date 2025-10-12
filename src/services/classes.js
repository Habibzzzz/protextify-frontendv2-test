// src/services/classes.js
import api from "./api";

/**
 * Mendapat daftar semua kelas untuk user saat ini (student/instructor)
 * @returns {Array} array kelas sesuai struktur BE
 */
const getClasses = async () => {
  try {
    const response = await api.get("/classes");
    const data = Array.isArray(response) ? response : [];

    // Transform response sesuai struktur BE terbaru
    return data.map((classObj) => ({
      id: classObj.id,
      name: classObj.name,
      description: classObj.description,
      classToken: classObj.classToken,
      instructorId: classObj.instructorId,
      createdAt: classObj.createdAt,
      updatedAt: classObj.updatedAt,
      instructor: classObj.instructor
        ? {
            id: classObj.instructor.id,
            fullName: classObj.instructor.fullName,
            institution: classObj.instructor.institution,
          }
        : undefined,
      enrollments: Array.isArray(classObj.enrollments)
        ? classObj.enrollments.map((e) => ({
            student: {
              id: e.student?.id,
              fullName: e.student?.fullName,
            },
          }))
        : [],
      assignments: Array.isArray(classObj.assignments)
        ? classObj.assignments.map((a) => ({
            id: a.id,
            title: a.title,
            instructions: a.instructions,
            deadline: a.deadline,
            active: a.active,
            createdAt: a.createdAt,
          }))
        : [],
      currentUserEnrollment: classObj.currentUserEnrollment
        ? {
            id: classObj.currentUserEnrollment.id,
            joinedAt: classObj.currentUserEnrollment.joinedAt,
          }
        : undefined,
    }));
  } catch (error) {
    console.error("Error fetching classes:", error);
    throw error;
  }
};

/**
 * Mendapat detail kelas berdasarkan ID
 * @param {string} id
 * @returns {object} detail kelas sesuai BE
 */
const getClassById = async (id) => {
  try {
    const response = await api.get(`/classes/${id}`);
    // Mapping sesuai BE
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      classToken: response.classToken,
      instructorId: response.instructorId,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      instructor: response.instructor
        ? {
            id: response.instructor.id,
            fullName: response.instructor.fullName,
            institution: response.instructor.institution,
          }
        : undefined,
      enrollments: Array.isArray(response.enrollments)
        ? response.enrollments.map((e) => ({
            student: {
              id: e.student?.id,
              fullName: e.student?.fullName,
            },
          }))
        : [],
      assignments: Array.isArray(response.assignments)
        ? response.assignments.map((a) => ({
            id: a.id,
            title: a.title,
            instructions: a.instructions,
            deadline: a.deadline,
            active: a.active,
            createdAt: a.createdAt,
          }))
        : [],
      currentUserEnrollment: response.currentUserEnrollment
        ? {
            id: response.currentUserEnrollment.id,
            joinedAt: response.currentUserEnrollment.joinedAt,
          }
        : undefined,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Membuat kelas baru (instructor only)
 * @param {object} classData { name, description }
 * @returns {object} kelas baru sesuai BE
 */
const createClass = async (classData) => {
  try {
    const response = await api.post("/classes", classData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Student bergabung ke kelas menggunakan token
 * @param {string} classToken
 * @returns {object} { message, class }
 */
const joinClass = async (classToken) => {
  try {
    const response = await api.post("/classes/join", { classToken });
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      throw {
        ...error,
        message:
          "Token kelas tidak ditemukan. Periksa kembali token yang dimasukkan.",
      };
    } else if (error.response?.status === 409) {
      throw {
        ...error,
        message: "Anda sudah bergabung di kelas ini.",
      };
    } else if (error.response?.status === 400) {
      throw {
        ...error,
        message: "Format token tidak valid. Token harus 8 karakter.",
      };
    }
    throw error;
  }
};

/**
 * Preview informasi kelas sebelum bergabung (public endpoint)
 * @param {string} classToken
 * @returns {object} preview kelas sesuai BE
 */
const previewClass = async (classToken) => {
  try {
    const response = await api.get(`/classes/preview/${classToken}`);
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      instructor: response.instructor
        ? {
            id: response.instructor.id,
            fullName: response.instructor.fullName,
            institution: response.instructor.institution,
          }
        : undefined,
      studentsCount: response.studentsCount,
      assignmentsCount: response.assignmentsCount,
      createdAt: response.createdAt,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat daftar assignment di kelas tertentu
 * @param {string} classId
 * @returns {Array} array assignment sesuai BE
 */
const getClassAssignments = async (classId) => {
  try {
    const response = await api.get(`/classes/${classId}/assignments`);
    return Array.isArray(response)
      ? response.map((item) => ({
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
        }))
      : [];
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat riwayat submission di kelas (instructor only)
 * @param {string} classId
 * @param {object} params - Query params for pagination, filtering, sorting
 * @returns {Promise<object>} { data, page, limit, total, totalPages }
 */
const getClassHistory = async (classId, params) => {
  try {
    // The api instance will automatically handle the params object.
    // The response is now an object, so we return it directly.
    const response = await api.get(`/classes/${classId}/history`, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update kelas (instructor only)
 * @param {string} classId
 * @param {object} updateData
 * @returns {object} kelas yang diupdate
 */
const updateClass = async (classId, updateData) => {
  try {
    const response = await api.patch(`/classes/${classId}`, updateData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Hapus kelas (instructor only)
 * @param {string} classId
 * @returns {object} response BE
 */
const deleteClass = async (classId) => {
  try {
    const response = await api.delete(`/classes/${classId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Regenerate token kelas (instructor only)
 * @param {string} classId
 * @returns {object} response BE
 */
const regenerateClassToken = async (classId) => {
  try {
    const response = await api.post(`/classes/${classId}/regenerate-token`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat feed aktivitas terbaru di kelas (instructor only)
 * @param {string} classId
 * @param {number} limit
 * @returns {Promise<Array>} Array of activity objects.
 */
const getClassActivityFeed = async (classId, limit = 20) => {
  try {
    const response = await api.get(`/classes/${classId}/activity-feed`, {
      params: { limit },
    });
    return response;
  } catch (error) {
    console.error(`Failed to fetch activity feed for class ${classId}:`, error);
    throw error;
  }
};

const classesService = {
  getClasses,
  getClassById,
  createClass,
  joinClass,
  previewClass,
  getClassAssignments,
  getClassHistory,
  updateClass,
  deleteClass,
  regenerateClassToken,
  getClassActivityFeed, // <-- Tambahkan fungsi baru
};

export default classesService;
