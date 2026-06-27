# Dokumentasi Alur Frontend Protextify

Dokumen ini menjelaskan alur implementasi frontend untuk lima bagian utama:
anti copy-paste, route protection/RBAC, lazy loading, Context API, dan
arsitektur frontend.

## 1. Implementasi Anti Copy-Paste

Fitur anti copy-paste dipakai pada halaman pengerjaan tugas student. Tujuannya
adalah mencegah student menempelkan jawaban langsung ke editor saat submission
masih berstatus draft.

### File utama

- `src/pages/student/WriteAssignment.jsx`
- `src/components/forms/RichTextEditor.jsx`
- `src/hooks/useCopyPasteMonitor.js`
- `src/components/editor/CopyPasteMonitor.jsx`
- `src/components/editor/index.js`

### Alur kerja

1. Student membuka halaman tulis tugas:
   `src/pages/student/WriteAssignment.jsx`
2. Halaman ini me-render editor:
   `src/components/forms/RichTextEditor.jsx`
3. Saat submission masih `DRAFT`, prop berikut dikirim ke editor:
   `disablePaste={submission.status === "DRAFT"}`
4. Di dalam `RichTextEditor.jsx`, `PasteControlPlugin` mendaftarkan listener
   Lexical untuk `PASTE_COMMAND`.
5. Jika `disablePaste` bernilai `true`, event paste dihentikan dengan:
   `event.preventDefault()`
6. User mendapat toast error:
   `Menyalin dan menempelkan konten tidak diizinkan.`
7. `CopyPasteMonitor` juga dipakai untuk memantau aktivitas paste dan pola
   pengetikan yang mencurigakan.

### File dan fungsi penting

- `WriteAssignment.jsx`
  Mengatur kapan anti paste aktif dan mengirim `disablePaste` ke editor.

- `RichTextEditor.jsx`
  Berisi `PasteControlPlugin`, yaitu plugin Lexical yang benar-benar memblokir
  paste.

- `useCopyPasteMonitor.js`
  Hook untuk mendeteksi paste, panjang teks paste, HTML formatting, sumber
  paste, dan pola mengetik yang terlalu cepat.

- `CopyPasteMonitor.jsx`
  Komponen UI untuk menampilkan statistik paste dan aktivitas mencurigakan.

### Catatan implementasi

Anti copy-paste yang paling kuat saat ini ada di `PasteControlPlugin` karena
langsung mencegah event paste masuk ke editor. `useCopyPasteMonitor` lebih
berfungsi sebagai lapisan monitoring dan peringatan.

## 2. Route Protection / RBAC

RBAC digunakan untuk memastikan hanya role tertentu yang dapat membuka route
tertentu. Role utama yang digunakan adalah `ADMIN`, `INSTRUCTOR`, dan `STUDENT`.

### File utama

- `src/router/index.jsx`
- `src/router/ProtectedRoute.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/utils/constants.js`
- `src/contexts/AuthContext.jsx`

### Alur kerja

1. User login dan data user disimpan ke `AuthContext`.
2. Router mendefinisikan route berdasarkan role.
3. Route yang membutuhkan login dibungkus dengan `ProtectedRoute`.
4. `ProtectedRoute` membaca data auth dari `useAuth()`.
5. Jika user belum login, user diarahkan ke `/auth/login`.
6. Jika user login tetapi role tidak sesuai, halaman menampilkan pesan
   `Akses Ditolak`.
7. Jika role sesuai, route akan menampilkan layout dan page yang diminta.

### Mapping role route

File: `src/router/index.jsx`

- Student:
  `/dashboard`
  memakai `allowedRoles={[USER_ROLES.STUDENT]}`

- Instructor:
  `/instructor`
  memakai `allowedRoles={[USER_ROLES.INSTRUCTOR]}`

- Admin:
  `/admin`
  memakai `allowedRoles={[USER_ROLES.ADMIN]}`

### File constants

File: `src/utils/constants.js`

Role didefinisikan di:

```js
export const USER_ROLES = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
};
```

Default route per role didefinisikan di:

```js
export const ROLE_ROUTES = {
  [USER_ROLES.ADMIN]: "/admin/dashboard",
  [USER_ROLES.STUDENT]: "/dashboard/overview",
  [USER_ROLES.INSTRUCTOR]: "/instructor/dashboard",
};
```

## 3. Lazy Loading

Lazy loading dipakai agar page dashboard tidak dimuat sekaligus di awal. Ini
membantu memperkecil bundle awal dan mempercepat first load.

### File utama

- `src/router/index.jsx`
- `src/router/AppRouter.jsx`

### Alur kerja

1. Page di-import memakai `lazy()` dari React.
2. Komponen lazy dibungkus oleh helper `renderLazy`.
3. `renderLazy` memakai `Suspense` dan `LoadingSpinner`.
4. Saat page belum selesai dimuat, UI menampilkan spinner.
5. Setelah chunk page selesai dimuat, page baru ditampilkan.

### Contoh implementasi

File: `src/router/index.jsx`

```js
const StudentDashboard = lazy(() => import("../pages/student/Dashboard"));
const InstructorDashboard = lazy(() => import("../pages/instructor/Dashboard"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
```

Helper:

```js
const renderLazy = (Component) => (
  <Suspense fallback={<LoadingSpinner size="lg" />}>
    <Component />
  </Suspense>
);
```

### Page yang dilazy-load

- Auth pages:
  `Login`, `Register`, `ForgotPassword`, `ResetPassword`, `GoogleCallback`

- Student pages:
  `Dashboard`, `Classes`, `Assignments`, `WriteAssignment`, `SubmissionDetail`

- Instructor pages:
  `Dashboard`, `Classes`, `CreateAssignment`, `MonitorSubmissions`,
  `GradeSubmission`, `Analytics`

- Admin pages:
  `AdminLogin`, `AdminDashboard`, `AdminUsers`

## 4. Context API

Context API digunakan terutama untuk autentikasi global. Dengan Context API,
komponen mana pun dapat membaca user login, role, token, loading state, dan
fungsi auth tanpa prop drilling.

### File utama

- `src/contexts/AuthContext.jsx`
- `src/contexts/index.js`
- `src/hooks/useAuth.js`
- `src/main.jsx`
- `src/services/auth.js`
- `src/utils/sessionManager.js`

### Alur kerja

1. `main.jsx` membungkus seluruh aplikasi dengan `AuthProvider`.
2. `AuthProvider` menyimpan state auth memakai `useReducer`.
3. Saat aplikasi pertama kali dibuka, `checkAuthStatus()` dijalankan.
4. `checkAuthStatus()` mengecek token dan session.
5. Jika valid, user diambil dari backend lewat `authService.getCurrentUser()`.
6. Jika tidak valid, session dibersihkan dan user dianggap logout.
7. Komponen lain memakai `useAuth()` untuk membaca state auth.

### State utama AuthContext

File: `src/contexts/AuthContext.jsx`

- `user`
- `token`
- `isAuthenticated`
- `loading`
- `error`

### Action reducer

- `SET_LOADING`
- `LOGIN_START`
- `LOGIN_SUCCESS`
- `LOGIN_ERROR`
- `LOGOUT`
- `UPDATE_USER`
- `CLEAR_ERROR`

### Fungsi yang diekspos

- `login`
- `loginAdmin`
- `register`
- `logout`
- `updateUser`
- `clearError`
- `checkAuthStatus`

### Hook pembungkus

File: `src/hooks/useAuth.js`

Hook ini membungkus `useContext(AuthContext)` supaya pemakaian di komponen lebih
rapi.

## 5. Arsitektur Frontend

Frontend Protextify memakai React, Vite, React Router, Context API, Axios,
Tailwind CSS, dan komponen UI internal.

### Entry point aplikasi

- `src/main.jsx`
  Entry utama aplikasi. Me-render `RouterProvider`, `AuthProvider`, dan
  `Toaster`.

- `src/App.jsx`
  Wrapper alternatif yang juga membungkus app dengan `AuthProvider` dan router.

### Struktur folder utama

- `src/pages`
  Berisi halaman berdasarkan domain: public, auth, student, instructor, admin.

- `src/components`
  Berisi komponen reusable, UI primitives, layout, editor, dashboard, upload,
  export, payment, plagiarism, dan submission components.

- `src/layouts`
  Berisi layout utama: `RootLayout`, `AuthLayout`, `DashboardLayout`.

- `src/router`
  Berisi definisi route, lazy loading, protected route, dan router export.

- `src/contexts`
  Berisi Context API, terutama `AuthContext`.

- `src/hooks`
  Berisi custom hooks seperti `useAuth`, `useCopyPasteMonitor`,
  `useAsyncData`, `useDebounce`, `useDraftManager`.

- `src/services`
  Berisi layer komunikasi API ke backend.

- `src/utils`
  Berisi konstanta, helper, session manager, validation, formatter, dan utilitas
  pendukung.

- `src/styles`
  Berisi style global dan style editor.

### Alur request API

1. Page atau hook memanggil service, misalnya `assignmentsService`.
2. Service memanggil `api` dari `src/services/api.js`.
3. `api.js` menambahkan token ke header `Authorization`.
4. Backend menerima request.
5. Response dikembalikan ke service.
6. Service melakukan mapping data jika diperlukan.
7. Page menerima data dan me-render UI.

### File API penting

- `src/services/api.js`
  Axios instance, base URL, request interceptor, response interceptor, dan
  handling error global.

- `src/services/index.js`
  Export semua service agar import lebih mudah.

- `src/utils/constants.js`
  Berisi `API_BASE_URL`, `WS_URL`, `USER_ROLES`, route constants, status
  constants, dan design constants.

### Layout utama

- `src/layouts/RootLayout.jsx`
  Layout untuk public pages.

- `src/layouts/AuthLayout.jsx`
  Layout untuk halaman login/register/auth.

- `src/layouts/DashboardLayout.jsx`
  Layout untuk dashboard student, instructor, dan admin.

### Navigasi dashboard

- `src/components/layout/Sidebar.jsx`
  Menentukan menu berdasarkan role user.

- `src/components/layout/DashboardHeader.jsx`
  Header dashboard desktop.

- `src/components/layout/MobileBottomNav.jsx`
  Navigasi mobile untuk user authenticated.

### Ringkasan alur besar

```text
main.jsx
  -> AuthProvider
  -> RouterProvider
  -> router/index.jsx
  -> PublicRoute atau ProtectedRoute
  -> Layout
  -> Page
  -> Service
  -> api.js
  -> Backend
```

## Daftar File Penting

### Anti copy-paste

- `src/pages/student/WriteAssignment.jsx`
- `src/components/forms/RichTextEditor.jsx`
- `src/hooks/useCopyPasteMonitor.js`
- `src/components/editor/CopyPasteMonitor.jsx`

### RBAC dan route protection

- `src/router/index.jsx`
- `src/router/ProtectedRoute.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/utils/constants.js`

### Lazy loading

- `src/router/index.jsx`
- `src/router/AppRouter.jsx`
- `src/components/ui/LoadingSpinner.jsx`

### Context API

- `src/contexts/AuthContext.jsx`
- `src/contexts/index.js`
- `src/hooks/useAuth.js`
- `src/main.jsx`

### Arsitektur frontend

- `src/main.jsx`
- `src/router/index.jsx`
- `src/layouts/DashboardLayout.jsx`
- `src/components/layout/Sidebar.jsx`
- `src/services/api.js`
- `src/services/index.js`
- `src/utils/constants.js`
