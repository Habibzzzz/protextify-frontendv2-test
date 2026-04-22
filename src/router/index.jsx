import { createBrowserRouter, Navigate } from "react-router-dom";
import { USER_ROLES } from "../utils/constants";

// Layouts
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

// Public Pages
import {
  Home,
  About,
  Pricing,
  Help,
  Docs,
  Privacy,
  Terms,
  NotFound,
} from "../pages/public";

// Auth Pages
import {
  Login,
  Register,
  EmailVerification,
  GoogleCallback,
  ForgotPassword,
  ResetPassword,
} from "../pages/auth";

// Student Pages
import {
  StudentDashboard,
  StudentClasses,
  JoinClass,
  StudentAssignments,
  StudentSubmissions,
  WriteAssignment,
  StudentClassDetail,
  StudentProfile,
  SubmissionDetail,
  PlagiarismReport,
  StorageHealth,
  ClassAssignments,
  AssignmentDetail, // <-- dari student
} from "../pages/student";

// Instructor Pages
import {
  InstructorDashboard,
  InstructorClasses,
  CreateClass,
  ClassDetail,
  ClassSettings,
  CreateAssignment,
  MonitorSubmissions,
  GradeSubmission,
  InstructorAnalytics,
  InstructorSettings,
  BulkGrade,
  AssignmentAnalytics,
  InstructorAssignmentDetail, // <-- gunakan alias
  PlagiarismAnalysis,
  TransactionHistory,
  TransactionDetail,
  ClassHistory,
} from "../pages/instructor";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "pricing", element: <Pricing /> },
      { path: "help", element: <Help /> },
      { path: "docs", element: <Docs /> },
      { path: "privacy", element: <Privacy /> },
      { path: "terms", element: <Terms /> },
      // Auth routes (only for non-authenticated users)
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: (
              <PublicRoute>
                <Login />
              </PublicRoute>
            ),
          },
          {
            path: "register",
            element: (
              <PublicRoute>
                <Register />
              </PublicRoute>
            ),
          },
          {
            path: "email-verification",
            element: (
              <PublicRoute>
                <EmailVerification />
              </PublicRoute>
            ),
          },
          {
            path: "callback",
            element: (
              <PublicRoute>
                <GoogleCallback />
              </PublicRoute>
            ),
          },
          {
            path: "google/callback",
            element: (
              <PublicRoute>
                <GoogleCallback />
              </PublicRoute>
            ),
          },
          {
            path: "forgot-password",
            element: (
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            ),
          },
          {
            path: "reset-password",
            element: (
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            ),
          },
        ],
      },
      { path: "verify-email", element: <EmailVerification /> },
    ],
  },

  // Student dashboard routes
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: "overview", element: <StudentDashboard /> },
      { path: "classes", element: <StudentClasses /> },
      { path: "classes/:classId/assignments", element: <ClassAssignments /> },
      { path: "join-class", element: <JoinClass /> },
      { path: "assignments", element: <StudentAssignments /> },
      { path: "assignments/:assignmentId", element: <AssignmentDetail /> },
      { path: "assignments/:id/write", element: <WriteAssignment /> },
      { path: "submissions", element: <StudentSubmissions /> },
      { path: "submissions/:id", element: <SubmissionDetail /> },
      {
        path: "submissions/:id/plagiarism-report",
        element: <PlagiarismReport />,
      },
      { path: "classes/:classId", element: <StudentClassDetail /> },
      { path: "profile", element: <StudentProfile /> },
      { path: "storage-health", element: <StorageHealth /> },
    ],
  },

  // Instructor dashboard routes
  {
    path: "/instructor",
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.INSTRUCTOR]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      {
        path: "dashboard",
        element: <InstructorDashboard />,
      },
      {
        path: "analytics",
        element: <InstructorAnalytics />,
      },
      {
        path: "classes",
        element: <InstructorClasses />,
      },
      {
        path: "create-class",
        element: <CreateClass />,
      },
      {
        path: "classes/:classId",
        element: <ClassDetail />,
      },
      {
        path: "classes/:classId/history",
        element: <ClassHistory />,
      },
      {
        path: "classes/:classId/settings",
        element: <ClassSettings />,
      },
      {
        path: "classes/:classId/create-assignment",
        element: <CreateAssignment />,
      },
      {
        path: "assignments/:assignmentId",
        element: <InstructorAssignmentDetail />,
      },
      {
        path: "assignments/:assignmentId/monitor",
        element: <MonitorSubmissions />,
      },
      {
        path: "assignments/:assignmentId/bulk-grade",
        element: <BulkGrade />,
      },
      {
        path: "assignments/:assignmentId/analytics",
        element: <AssignmentAnalytics />,
      },
      {
        path: "assignments/:assignmentId/submissions",
        element: <MonitorSubmissions />,
      },
      {
        path: "submissions/:submissionId/plagiarism",
        element: <PlagiarismAnalysis />,
      },
      {
        path: "submissions/:submissionId/grade",
        element: <GradeSubmission />,
      },
      { path: "transactions", element: <TransactionHistory /> },
      { path: "transactions/:transactionId", element: <TransactionDetail /> },
      {
        path: "settings",
        element: <InstructorSettings />,
      },
    ],
  },

  // Standalone profile route (accessible for any authenticated user)
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <StudentProfile /> }],
  },

  // Legacy redirects
  { path: "login", element: <Navigate to="/auth/login" replace /> },
  { path: "register", element: <Navigate to="/auth/register" replace /> },
  { path: "reset-password", element: <ResetPassword /> }, // Direct access for query params
  {
    path: "classes/:classId/assignments/:assignmentId/write",
    element: <WriteAssignment />,
  },

  // 404 fallback
  { path: "*", element: <NotFound /> },
]);

export default router;
