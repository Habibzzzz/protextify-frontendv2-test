// src/services/submissions.js
import api from "./api";

/**
 * Membuat submission baru untuk assignment (student only)
 * @param {string} assignmentId
 * @param {object} submissionData { content }
 * @returns {object} submission sesuai BE
 */
const createSubmission = async (assignmentId, submissionData) => {
  try {
    const response = await api.post(
      `/assignments/${assignmentId}/submissions`,
      submissionData
    );
    return {
      id: response.id,
      assignmentId: response.assignmentId,
      studentId: response.studentId,
      content: response.content,
      status: response.status,
      createdAt: response.createdAt,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat detail submission by ID
 * @param {string} submissionId
 * @returns {object} detail submission sesuai BE
 */
const getSubmissionById = async (submissionId) => {
  try {
    const response = await api.get(`/submissions/${submissionId}`);
    return {
      id: response.id,
      assignmentId: response.assignmentId,
      studentId: response.studentId,
      content: response.content,
      status: response.status,
      grade: response.grade,
      feedback: response.feedback,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
      submittedAt: response.submittedAt,
      assignment: response.assignment
        ? {
            id: response.assignment.id,
            title: response.assignment.title,
            deadline: response.assignment.deadline,
            class: response.assignment.class
              ? {
                  id: response.assignment.class.id,
                  name: response.assignment.class.name,
                  instructorId: response.assignment.class.instructorId,
                }
              : undefined,
          }
        : undefined,
      plagiarismChecks: response.plagiarismChecks || null,
      student: response.student
        ? {
            id: response.student.id,
            fullName: response.student.fullName,
          }
        : undefined,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update submission content (auto-save)
 * @param {string} submissionId
 * @param {string} content
 * @returns {object} updated submission sesuai BE
 */
const updateSubmissionContent = async (submissionId, content) => {
  try {
    const response = await api.patch(`/submissions/${submissionId}/content`, {
      content,
    });
    return {
      id: response.id,
      content: response.content,
      status: response.status,
      updatedAt: response.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Submit final submission (student only)
 * @param {string} submissionId
 * @returns {object} { id, status, submittedAt }
 */
const submitSubmission = async (submissionId) => {
  try {
    const response = await api.post(`/submissions/${submissionId}/submit`);
    return {
      id: response.id,
      status: response.status,
      submittedAt: response.submittedAt,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Grade submission (instructor only)
 * @param {string} submissionId
 * @param {object} gradeData { grade }
 * @returns {object} { id, grade, status, updatedAt }
 */
const gradeSubmission = async (submissionId, gradeData) => {
  try {
    const response = await api.patch(
      `/submissions/${submissionId}/grade`,
      gradeData
    );
    return {
      id: response.id,
      grade: response.grade,
      status: response.status,
      updatedAt: response.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Memberikan nilai dan feedback ke beberapa submission sekaligus.
 * @param {object} bulkData - Payload berisi array grades.
 * @param {Array<object>} bulkData.grades - Array of { submissionId, grade, feedback }.
 * @returns {Promise<object>} Response dari backend.
 */
const bulkGradeSubmissions = async (bulkData) => {
  try {
    const response = await api.patch("/submissions/bulk-grade", bulkData);
    return response;
  } catch (error) {
    console.error("Failed to bulk grade submissions:", error);
    throw error;
  }
};

/**
 * Mengunduh beberapa submission sekaligus (ZIP/CSV).
 * @param {string[]} submissionIds - Array of submission IDs.
 * @param {string} format - "zip" or "csv".
 * @returns {Promise<object>} Response dari backend { downloadUrl, expiresAt, fileCount, filename }.
 */
const bulkDownloadSubmissions = async (submissionIds, format) => {
  try {
    const response = await api.post("/submissions/bulk-download", {
      submissionIds,
      format,
    });
    return response;
  } catch (error) {
    console.error("Failed to bulk download submissions:", error);
    throw error;
  }
};

/**
 * Mendapat riwayat submission untuk student
 * @returns {Array} array submission sesuai BE
 */
const getHistory = async () => {
  try {
    const response = await api.get("/submissions/history");
    if (!Array.isArray(response)) return [];

    return response.map((item) => ({
      id: item.id,
      assignmentId: item.assignmentId,
      content: item.content,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      submittedAt: item.submittedAt || null,
      grade: typeof item.grade === "number" ? item.grade : null,
      plagiarismScore:
        item.plagiarismChecks?.score ??
        (typeof item.plagiarismScore === "number"
          ? item.plagiarismScore
          : null),
      assignment: item.assignment
        ? {
            id: item.assignment.id,
            title: item.assignment.title,
            deadline: item.assignment.deadline,
            class: item.assignment.class
              ? { name: item.assignment.class.name }
              : undefined,
          }
        : undefined,
      plagiarismChecks: item.plagiarismChecks || null,
    }));
  } catch (error) {
    console.error("Error fetching submissions history:", error);
    return [];
  }
};

/**
 * Download submission sebagai PDF/DOCX
 * @param {string} submissionId
 * @param {string} format pdf|docx (default: pdf)
 * @returns {object} { filename, url, size }
 */
const downloadSubmission = async (submissionId, format = "pdf") => {
  try {
    const response = await api.get(`/submissions/${submissionId}/download`, {
      params: { format },
    });
    // Response: { filename, url, size }
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat semua versi konten submission
 * @param {string} submissionId
 * @returns {Array} array versi submission
 */
const getSubmissionVersions = async (submissionId) => {
  try {
    const response = await api.get(`/submissions/${submissionId}/versions`);
    return Array.isArray(response)
      ? response.map((v) => ({
          version: v.version,
          content: v.content,
          updatedAt: v.updatedAt,
        }))
      : [];
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat detail versi spesifik dari submission
 * @param {string} submissionId
 * @param {number} version
 * @returns {object} versi submission
 */
const getSubmissionVersionById = async (submissionId, version) => {
  try {
    const response = await api.get(
      `/submissions/${submissionId}/versions/${version}`
    );
    return {
      version: response.version,
      content: response.content,
      updatedAt: response.updatedAt,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Monitoring submission untuk assignment tertentu (instructor only)
 * @param {string} classId
 * @param {string} assignmentId
 * @returns {Array} array submission sesuai BE
 */
const getAssignmentSubmissions = async (classId, assignmentId) => {
  try {
    const response = await api.get(
      `/classes/${classId}/assignments/${assignmentId}/submissions`
    );
    return Array.isArray(response)
      ? response.map((item) => ({
          id: item.id,
          student: item.student,
          status: item.status,
          updatedAt: item.updatedAt,
          plagiarismChecks: item.plagiarismChecks || null,
        }))
      : [];
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat riwayat submission di kelas (instructor only)
 * @param {string} classId
 * @returns {Array} array submission sesuai BE
 */
const getClassHistory = async (classId) => {
  try {
    const response = await api.get(`/classes/${classId}/history`);
    return Array.isArray(response)
      ? response.map((item) => ({
          id: item.id,
          student: item.student,
          assignment: item.assignment,
          status: item.status,
          createdAt: item.createdAt,
        }))
      : [];
  } catch (error) {
    throw error;
  }
};

/**
 * Mendapat submission milik student untuk assignment tertentu
 * @param {string} assignmentId
 * @returns {object|null} submission milik student (jika ada)
 */
const getSubmissionByAssignmentId = async (assignmentId) => {
  try {
    // Ambil riwayat submission student
    const history = await getHistory();
    // Cari submission dengan assignmentId yang sesuai
    return history.find((s) => s.assignmentId === assignmentId) || null;
  } catch (error) {
    throw error;
  }
};

// const logPasteEvent = async (submissionId, event) => {
//   return await api.post(`/submissions/${submissionId}/paste-events`, event);
// };

const submissionsService = {
  createSubmission,
  getSubmissionById,
  updateSubmissionContent,
  submitSubmission,
  gradeSubmission,
  bulkGradeSubmissions,
  bulkDownloadSubmissions, // <-- Tambahkan fungsi baru di sini
  getHistory,
  downloadSubmission,
  getSubmissionVersions,
  getSubmissionVersionById,
  getAssignmentSubmissions,
  getClassHistory,
  getSubmissionByAssignmentId, // <-- tambahkan ini
};

export default submissionsService;
