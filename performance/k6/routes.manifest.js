export const PUBLIC_PAGES = [
  { id: "home", path: "/", includes: "Protextify" },
  { id: "about", path: "/about", includes: "Protextify" },
  { id: "pricing", path: "/pricing", includes: "Protextify" },
  { id: "help", path: "/help", includes: "Protextify" },
  { id: "docs", path: "/docs", includes: "Protextify" },
  { id: "privacy", path: "/privacy", includes: "Privasi" },
  { id: "terms", path: "/terms", includes: "Syarat" },
];

export const AUTH_PAGES = [
  { id: "auth-login", path: "/auth/login", includes: "Masuk" },
  { id: "auth-register", path: "/auth/register", includes: "Daftar" },
  {
    id: "auth-forgot-password",
    path: "/auth/forgot-password",
    includes: "Lupa Password",
  },
  {
    id: "auth-email-verification",
    path: "/auth/email-verification",
    includes: "Verifikasi",
  },
  { id: "auth-reset-password", path: "/auth/reset-password", includes: "Reset Password" },
  { id: "root-reset-password", path: "/reset-password", includes: "Reset Password" },
  { id: "auth-callback", path: "/auth/callback", includesAny: ["Memproses", "Masuk", "Token"] },
  {
    id: "auth-google-callback",
    path: "/auth/google/callback",
    includesAny: ["Memproses", "Masuk", "Token"],
  },
];

export const LEGACY_REDIRECTS = [
  { id: "legacy-login", path: "/login", expectUrlPart: "/auth/login" },
  { id: "legacy-register", path: "/register", expectUrlPart: "/auth/register" },
];

export const PROTECTED_REDIRECT_PATHS = [
  { id: "student-dashboard", path: "/dashboard/overview" },
  { id: "student-classes", path: "/dashboard/classes" },
  { id: "student-join-class", path: "/dashboard/join-class" },
  { id: "student-assignments", path: "/dashboard/assignments" },
  { id: "student-submissions", path: "/dashboard/submissions" },
  { id: "student-profile", path: "/dashboard/profile" },
  { id: "student-storage", path: "/dashboard/storage-health" },
  { id: "instructor-dashboard", path: "/instructor/dashboard" },
  { id: "instructor-classes", path: "/instructor/classes" },
  { id: "instructor-create-class", path: "/instructor/create-class" },
  { id: "instructor-analytics", path: "/instructor/analytics" },
  { id: "instructor-transactions", path: "/instructor/transactions" },
  { id: "instructor-settings", path: "/instructor/settings" },
  { id: "profile-standalone", path: "/profile" },
];

export const NOT_FOUND = {
  id: "not-found",
  path: "/__e2e_route_tidak_ada__",
  includes: "Tidak Ditemukan",
};

export const STANDALONE_APP_ROUTES = [
  {
    id: "write-assignment-legacy",
    path: "/classes/demo-class/assignments/demo-assignment/write",
    includesAny: ["Tugas", "menulis", "submission", "memuat", "Protextify"],
  },
];
