import { USER_ROLES } from "../utils/constants";

export const ROUTES = {
  // Public routes
  HOME: "/",
  ABOUT: "/about",
  PRICING: "/pricing",
  HELP: "/help",
  PRIVACY: "/privacy",
  TERMS: "/terms",

  // Auth routes
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    EMAIL_VERIFICATION: "/auth/email-verification",
    GOOGLE_CALLBACK: "/auth/google/callback",
  },

  // Legacy auth routes (for backward compatibility)
  LOGIN: "/login", // redirects to /auth/login
  REGISTER: "/register", // redirects to /auth/register

  // Student routes
  STUDENT: {
    DASHBOARD: "/dashboard/overview",
    CLASSES: "/dashboard/classes",
    JOIN_CLASS: "/dashboard/join-class",
    ASSIGNMENTS: "/dashboard/assignments",
    WRITE_ASSIGNMENT: (assignmentId) =>
      `/dashboard/assignments/${assignmentId}/write`,
    SUBMISSIONS: "/dashboard/submissions",
  },

  // Instructor routes
  INSTRUCTOR: {
    DASHBOARD: "/instructor/dashboard",
    CLASSES: "/instructor/classes",
    CREATE_CLASS: "/instructor/create-class",
    TRANSACTIONS: "/instructor/transactions",
    ANALYTICS: "/instructor/analytics",
  },
};

export const getPublicRoutes = () => [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.PRICING,
  ROUTES.HELP,
  ROUTES.PRIVACY,
  ROUTES.TERMS,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.EMAIL_VERIFICATION,
  ROUTES.AUTH.GOOGLE_CALLBACK,
  ROUTES.LOGIN, // legacy
  ROUTES.REGISTER, // legacy
];

export default ROUTES;
