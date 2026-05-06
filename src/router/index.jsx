import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { USER_ROLES } from "../utils/constants";
import LoadingSpinner from "../components/ui/LoadingSpinner";

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
  Privacy,
  Terms,
  NotFound,
} from "../pages/public";

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const EmailVerification = lazy(() =>
  import("../pages/auth/EmailVerification")
);
const GoogleCallback = lazy(() => import("../pages/auth/GoogleCallback"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));

const StudentDashboard = lazy(() => import("../pages/student/Dashboard"));
const StudentClasses = lazy(() => import("../pages/student/Classes"));
const JoinClass = lazy(() => import("../pages/student/JoinClass"));
const StudentAssignments = lazy(() => import("../pages/student/Assignments"));
const StudentSubmissions = lazy(() => import("../pages/student/Submissions"));
const WriteAssignment = lazy(() => import("../pages/student/WriteAssignment"));
const StudentClassDetail = lazy(() =>
  import("../pages/student/StudentClassDetail")
);
const StudentProfile = lazy(() => import("../pages/student/Profile"));
const SubmissionDetail = lazy(() => import("../pages/student/SubmissionDetail"));
const PlagiarismReport = lazy(() =>
  import("../pages/student/PlagiarismReport")
);
const StorageHealth = lazy(() => import("../pages/student/StorageHealth"));
const ClassAssignments = lazy(() => import("../pages/student/ClassAssignments"));
const AssignmentDetail = lazy(() => import("../pages/student/AssignmentDetail"));

const InstructorDashboard = lazy(() => import("../pages/instructor/Dashboard"));
const InstructorClasses = lazy(() => import("../pages/instructor/Classes"));
const CreateClass = lazy(() => import("../pages/instructor/CreateClass"));
const ClassDetail = lazy(() => import("../pages/instructor/ClassDetail"));
const ClassSettings = lazy(() => import("../pages/instructor/ClassSettings"));
const CreateAssignment = lazy(() =>
  import("../pages/instructor/CreateAssignment")
);
const MonitorSubmissions = lazy(() =>
  import("../pages/instructor/MonitorSubmissions")
);
const GradeSubmission = lazy(() => import("../pages/instructor/GradeSubmission"));
const InstructorAnalytics = lazy(() => import("../pages/instructor/Analytics"));
const InstructorSettings = lazy(() => import("../pages/instructor/Settings"));
const BulkGrade = lazy(() => import("../pages/instructor/BulkGrade"));
const AssignmentAnalytics = lazy(() =>
  import("../pages/instructor/AssignmentAnalytics")
);
const InstructorAssignmentDetail = lazy(() =>
  import("../pages/instructor/AssignmentDetail")
);
const PlagiarismAnalysis = lazy(() =>
  import("../pages/instructor/PlagiarismAnalysis")
);
const TransactionHistory = lazy(() =>
  import("../pages/instructor/TransactionHistory")
);
const TransactionDetail = lazy(() =>
  import("../pages/instructor/TransactionDetail")
);
const ClassHistory = lazy(() => import("../pages/instructor/ClassHistory"));

const renderLazy = (Component) => (
  <Suspense
    fallback={
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }
  >
    <Component />
  </Suspense>
);

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
                {renderLazy(Login)}
              </PublicRoute>
            ),
          },
          {
            path: "register",
            element: (
              <PublicRoute>
                {renderLazy(Register)}
              </PublicRoute>
            ),
          },
          {
            path: "email-verification",
            element: (
              <PublicRoute>
                {renderLazy(EmailVerification)}
              </PublicRoute>
            ),
          },
          {
            path: "callback",
            element: (
              <PublicRoute>
                {renderLazy(GoogleCallback)}
              </PublicRoute>
            ),
          },
          {
            path: "google/callback",
            element: (
              <PublicRoute>
                {renderLazy(GoogleCallback)}
              </PublicRoute>
            ),
          },
          {
            path: "forgot-password",
            element: (
              <PublicRoute>
                {renderLazy(ForgotPassword)}
              </PublicRoute>
            ),
          },
          {
            path: "reset-password",
            element: (
              <PublicRoute>
                {renderLazy(ResetPassword)}
              </PublicRoute>
            ),
          },
        ],
      },
      {
        path: "admin/login",
        element: (
          <PublicRoute redirectTo="/admin/dashboard">
            {renderLazy(AdminLogin)}
          </PublicRoute>
        ),
      },
      {
        path: "payment/success",
        element: <Navigate to="/instructor/transactions" replace />,
      },
      {
        path: "payment/pending",
        element: <Navigate to="/instructor/transactions" replace />,
      },
      {
        path: "payment/error",
        element: <Navigate to="/instructor/transactions" replace />,
      },
      { path: "verify-email", element: renderLazy(EmailVerification) },
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
      { path: "overview", element: renderLazy(StudentDashboard) },
      { path: "classes", element: renderLazy(StudentClasses) },
      { path: "classes/:classId/assignments", element: renderLazy(ClassAssignments) },
      { path: "join-class", element: renderLazy(JoinClass) },
      { path: "assignments", element: renderLazy(StudentAssignments) },
      { path: "assignments/:assignmentId", element: renderLazy(AssignmentDetail) },
      { path: "assignments/:id/write", element: renderLazy(WriteAssignment) },
      { path: "submissions", element: renderLazy(StudentSubmissions) },
      { path: "submissions/:id", element: renderLazy(SubmissionDetail) },
      {
        path: "submissions/:id/plagiarism-report",
        element: renderLazy(PlagiarismReport),
      },
      { path: "classes/:classId", element: renderLazy(StudentClassDetail) },
      { path: "profile", element: renderLazy(StudentProfile) },
      { path: "storage-health", element: renderLazy(StorageHealth) },
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
        element: renderLazy(InstructorDashboard),
      },
      {
        path: "analytics",
        element: renderLazy(InstructorAnalytics),
      },
      {
        path: "classes",
        element: renderLazy(InstructorClasses),
      },
      {
        path: "create-class",
        element: renderLazy(CreateClass),
      },
      {
        path: "classes/:classId",
        element: renderLazy(ClassDetail),
      },
      {
        path: "classes/:classId/history",
        element: renderLazy(ClassHistory),
      },
      {
        path: "classes/:classId/settings",
        element: renderLazy(ClassSettings),
      },
      {
        path: "classes/:classId/create-assignment",
        element: renderLazy(CreateAssignment),
      },
      {
        path: "assignments/:assignmentId",
        element: renderLazy(InstructorAssignmentDetail),
      },
      {
        path: "assignments/:assignmentId/monitor",
        element: renderLazy(MonitorSubmissions),
      },
      {
        path: "assignments/:assignmentId/bulk-grade",
        element: renderLazy(BulkGrade),
      },
      {
        path: "assignments/:assignmentId/analytics",
        element: renderLazy(AssignmentAnalytics),
      },
      {
        path: "assignments/:assignmentId/submissions",
        element: renderLazy(MonitorSubmissions),
      },
      {
        path: "submissions/:submissionId/plagiarism",
        element: renderLazy(PlagiarismAnalysis),
      },
      {
        path: "submissions/:submissionId/grade",
        element: renderLazy(GradeSubmission),
      },
      { path: "transactions", element: renderLazy(TransactionHistory) },
      { path: "transactions/:transactionId", element: renderLazy(TransactionDetail) },
      {
        path: "settings",
        element: renderLazy(InstructorSettings),
      },
    ],
  },

  // Admin dashboard routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: renderLazy(AdminDashboard) },
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
    children: [{ index: true, element: renderLazy(StudentProfile) }],
  },

  // Legacy redirects
  { path: "login", element: <Navigate to="/auth/login" replace /> },
  { path: "register", element: <Navigate to="/auth/register" replace /> },
  { path: "reset-password", element: renderLazy(ResetPassword) }, // Direct access for query params
  {
    path: "classes/:classId/assignments/:assignmentId/write",
    element: renderLazy(WriteAssignment),
  },

  // 404 fallback
  { path: "*", element: <NotFound /> },
]);

export default router;
