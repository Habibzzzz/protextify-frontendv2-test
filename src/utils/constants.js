export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://api.protextify.id/api";
export const WS_URL = import.meta.env.VITE_WS_URL || "wss://api.protextify.id";

export const USER_ROLES = {
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
};

// ✅ Perbaiki ROUTES mapping
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard/overview", // Student dashboard
  CLASSES: "/dashboard/classes",
  JOIN_CLASS: "/dashboard/join-class",
  INSTRUCTOR_DASHBOARD: "/instructor/dashboard", // Instructor dashboard
  INSTRUCTOR_CLASSES: "/instructor/classes",
  CREATE_CLASS: "/instructor/create-class",
  GOOGLE_CALLBACK: "/auth/google/callback",
};

// ✅ Perbaiki role-based routing constants
export const ROLE_ROUTES = {
  [USER_ROLES.STUDENT]: "/dashboard/overview", // ✅ Sesuai dengan route definition
  [USER_ROLES.INSTRUCTOR]: "/instructor/dashboard", // ✅ Sesuai dengan route definition
};

// ✅ Pastikan function ini benar
export const getDefaultRoute = (userRole) => {
  const route = ROLE_ROUTES[userRole];
  console.log("getDefaultRoute called:", { userRole, route });
  return route || ROUTES.HOME;
};

export const SUBMISSION_STATUS = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  GRADED: "GRADED",
};

export const ASSIGNMENT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED",
};

// Auth related constants
export const AUTH_STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  REFRESH_TOKEN: "refreshToken",
  SESSION_ID: "sessionId",
};

// Cache busting for production
export const CACHE_BUSTING = {
  ENABLED: import.meta.env.PROD,
  VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",
  TIMESTAMP: Date.now(),
};

export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

// ===== DESIGN SYSTEM CONSTANTS =====
export const BRAND_COLORS = {
  PRIMARY: "#23407a",
  PRIMARY_DARK: "#1a2f5c",
  PRIMARY_LIGHT: "#3b5fa4",
  PRIMARY_LIGHTER: "#4f6bb5",
  SUCCESS: "#10b981",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  INFO: "#3b82f6",
};

export const COLOR_PALETTE = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#23407a", // Main brand
    900: "#1e3a8a",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
};

// API Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Koneksi bermasalah. Periksa internet Anda.",
  UNAUTHORIZED: "Sesi telah berakhir. Silakan login kembali.",
  FORBIDDEN: "Anda tidak memiliki akses untuk melakukan tindakan ini.",
  NOT_FOUND: "Data tidak ditemukan.",
  VALIDATION_ERROR: "Data yang dimasukkan tidak valid.",
  SERVER_ERROR: "Terjadi kesalahan server. Silakan coba lagi.",
  TIMEOUT_ERROR: "Permintaan membutuhkan waktu terlalu lama.",
};

// Feature flags
export const FEATURES = {
  GOOGLE_AUTH: import.meta.env.VITE_ENABLE_GOOGLE_AUTH === "true",
  WEBSOCKET: import.meta.env.VITE_ENABLE_WEBSOCKET === "true",
  PLAGIARISM: import.meta.env.VITE_ENABLE_PLAGIARISM === "true",
};

export const TYPOGRAPHY_SCALE = {
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.625",
  },

  letterSpacing: {
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
};

export const SPACING_SCALE = {
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
};

export const BORDER_RADIUS = {
  none: "0",
  sm: "0.125rem", // 2px
  default: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px",
};

export const BOX_SHADOW = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  default: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  brand: "0 4px 14px 0 rgba(35, 64, 122, 0.15)",
  brandLg: "0 10px 28px 0 rgba(35, 64, 122, 0.2)",
};

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
};

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const ANIMATION_DURATION = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
  slower: "500ms",
};

export const TRANSITION_EASING = {
  ease: "ease",
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  linear: "linear",
};

// Tambahkan ke src/utils/constants.js
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GOOGLE_AUTH: "/auth/google",
  VERIFY_EMAIL: "/auth/verify-email",
  SEND_VERIFICATION: "/auth/send-verification",

  // Users
  CURRENT_USER: "/users/me",
  UPDATE_PROFILE: "/users/me",

  // Classes
  CLASSES: "/classes",
  JOIN_CLASS: "/classes/join",
  CLASS_DETAIL: (id) => `/classes/${id}`,
  CLASS_ASSIGNMENTS: (id) => `/classes/${id}/assignments`,
  CLASS_HISTORY: (id) => `/classes/${id}/history`,

  // Assignments
  CREATE_ASSIGNMENT: (classId) => `/classes/${classId}/assignments`,
  ASSIGNMENT_DETAIL: (id) => `/assignments/${id}`,
  ASSIGNMENT_SUBMISSIONS: (classId, assignmentId) =>
    `/classes/${classId}/assignments/${assignmentId}/submissions`,

  // Submissions
  CREATE_SUBMISSION: (assignmentId) =>
    `/assignments/${assignmentId}/submissions`,
  SUBMISSION_DETAIL: (id) => `/submissions/${id}`,
  UPDATE_CONTENT: (id) => `/submissions/${id}/content`,
  SUBMIT_SUBMISSION: (id) => `/submissions/${id}/submit`,
  GRADE_SUBMISSION: (id) => `/submissions/${id}/grade`,
  SUBMISSION_HISTORY: "/submissions/history",
  DOWNLOAD_SUBMISSION: (id) => `/submissions/${id}/download`,

  // Plagiarism
  CHECK_PLAGIARISM: (id) => `/submissions/${id}/check-plagiarism`,
  PLAGIARISM_REPORT: (id) => `/submissions/${id}/plagiarism-report`,
  QUEUE_STATS: "/plagiarism/queue-stats",

  // Payments
  CREATE_TRANSACTION: "/payments/create-transaction",
  PAYMENT_WEBHOOK: "/payments/webhook",
  TRANSACTION_HISTORY: "/payments/transactions",
  TRANSACTION_DETAIL: (id) => `/payments/transactions/${id}`,
  PAYMENT_STATUS: (orderId) => `/payments/status/${orderId}`,
  ASSIGNMENTS_RECENT: "/assignments/recent", // Tambahkan endpoint baru untuk tugas terbaru
};

// Loading states
export const LOADING_STATES = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

// Request timeout
export const REQUEST_TIMEOUT = 15000;

// Retry configuration
export const RETRY_CONFIG = {
  retries: 3,
  retryDelay: 1000,
  retryCondition: (error) => {
    return error.response?.status >= 500 || error.code === "NETWORK_ERROR";
  },
};

// Tambahkan ke src/utils/constants.js

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: {
    PROFILE_PICTURE: 5 * 1024 * 1024, // 5MB
    SUBMISSION_FILE: 10 * 1024 * 1024, // 10MB
    ASSIGNMENT_DOCUMENT: 20 * 1024 * 1024, // 20MB
  },
  ALLOWED_TYPES: {
    IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    DOCUMENTS: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
    ALL: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
  },
};

// WebSocket Events
export const WS_EVENTS = {
  UPDATE_CONTENT: "updateContent",
  NOTIFICATION: "notification",
  SUBMISSION_UPDATED: "submissionUpdated",
  SUBMISSION_LIST_UPDATED: "submissionListUpdated",
  JOIN_MONITORING: "joinMonitoring",
  LEAVE_MONITORING: "leaveMonitoring",
  JOIN_SUBMISSION: "joinSubmission",
  LEAVE_SUBMISSION: "leaveSubmission",

  // New events
  PLAGIARISM_PROGRESS: "plagiarismProgress",
  PLAGIARISM_COMPLETE: "plagiarismComplete",
  PLAGIARISM_FAILED: "plagiarismFailed",
  JOIN_CLASS: "joinClass",
  LEAVE_CLASS: "leaveClass",
  LEAVE_ALL_ROOMS: "leaveAllRooms",
  PING: "ping",
  PONG: "pong",

  // Connection events
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  RECONNECT: "reconnect",
  CONNECT_ERROR: "connect_error",
  RECONNECT_ERROR: "reconnect_error",
};

// WebSocket Configuration
export const WS_CONFIG = {
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
  CONNECTION_TIMEOUT: 10000, // 10 seconds
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
  AUTO_SAVE_DEBOUNCE: 2000, // 2 seconds
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  PLAGIARISM_COMPLETE: "plagiarism_complete",
  PLAGIARISM_FAILED: "plagiarism_failed",
  PAYMENT_SUCCESS: "payment_success",
  ASSIGNMENT_CREATED: "assignment_created",
  SUBMISSION_GRADED: "submission_graded",
};

// Add to existing constants.js

// Payment Configuration
export const PAYMENT_CONFIG = {
  MIDTRANS: {
    ENVIRONMENT: import.meta.env.VITE_MIDTRANS_ENVIRONMENT || "sandbox",
    CLIENT_KEY: import.meta.env.VITE_MIDTRANS_CLIENT_KEY,
    SNAP_URL: {
      sandbox: "https://app.sandbox.midtrans.com/snap/snap.js",
      production: "https://app.midtrans.com/snap/snap.js",
    },
  },
  ASSIGNMENT_PRICE_PER_STUDENT: 2700,
  CURRENCY: "IDR",
  MIN_STUDENTS: 1,
  MAX_STUDENTS: 100,
  PAYMENT_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  POLLING_INTERVAL: 5000, // 5 seconds
  MAX_POLLING_ATTEMPTS: 60, // 5 minutes total
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
};

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  BANK_TRANSFER: "bank_transfer",
  E_WALLET: "echannel",
  VIRTUAL_ACCOUNT: "bank_transfer",
  CONVENIENCE_STORE: "cstore",
};

// Transaction Types
export const TRANSACTION_TYPES = {
  ASSIGNMENT_PAYMENT: "ASSIGNMENT_PAYMENT",
  CREDIT_PURCHASE: "CREDIT_PURCHASE",
  SUBSCRIPTION: "SUBSCRIPTION",
};
