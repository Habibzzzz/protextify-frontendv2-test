# Prosedur Pengujian Selenium dan k6 Browser

Dokumen ini menjelaskan prosedur pengujian Protextify Frontend test menggunakan Selenium WebDriver dan k6 Browser. Pengujian dijalankan dari mesin client-to VPS, sedangkan target aplikasi berada di VPS test.

## 1. Target Pengujian

| Komponen | Nilai |
|---|---|
| Frontend test | `http://157.10.252.236:5174` |
| Backend test | `http://157.10.252.236:3001` |
| Database | PostgreSQL container test dari `protextify-backendv2-test` |
| Data uji | Data seed database test |
| Lokasi script | `protextify-frontendv2-test/e2e` dan `protextify-frontendv2-test/performance/k6` |

Pengujian tidak dijalankan di VPS aplikasi karena storage VPS aplikasi sudah penuh. Browser Selenium, Chromium k6, cache, dan file hasil pengujian harus berada di client-to VPS.

## 2. Data Uji Dari Database

Data berikut berasal dari seed backend test.

| Role/Entitas | Nilai |
|---|---|
| Admin | `admin@protextify.id` / `password123` |
| Instructor | `john.instructor@university.edu` / `password123` |
| Student | `alice.student@university.edu` / `password123` |
| Class ID | `class-1` |
| Assignment ID | `assignment-1` |
| Submission ID | `submission-1` |
| Transaction ID | `transaction-1` |
| Join class token | `WEBDEV2025` |

Jika data seed berubah, sesuaikan environment variable sebelum menjalankan test.

## 3. Persiapan Di Client-To VPS

Masuk ke folder frontend test pada client-to VPS:

```bash
cd /path/ke/protextify-frontendv2-test
```

Install dependency:

```bash
npm install
```

Pastikan Chrome/Chromium dan k6 tersedia:

```bash
google-chrome --version || chromium --version
k6 version
```

Set environment pengujian:

```bash
export BASE_URL="http://157.10.252.236:5174"

export E2E_STUDENT_EMAIL="alice.student@university.edu"
export E2E_STUDENT_PASSWORD="password123"

export E2E_INSTRUCTOR_EMAIL="john.instructor@university.edu"
export E2E_INSTRUCTOR_PASSWORD="password123"

export E2E_ADMIN_USER="admin@protextify.id"
export E2E_ADMIN_PASS="password123"

export E2E_CLASS_ID="class-1"
export E2E_ASSIGNMENT_ID="assignment-1"
export E2E_SUBMISSION_ID="submission-1"
export E2E_TRANSACTION_ID="transaction-1"
export E2E_JOIN_CLASS_TOKEN="WEBDEV2025"
```

Untuk mode headless Selenium:

```bash
export HEADLESS=1
```

## 4. Pengujian Selenium

Selenium digunakan untuk pengujian black box fungsional: membuka halaman, login, validasi redirect, memeriksa tampilan route berdasarkan role, dan memastikan elemen utama tersedia.

Jalankan smoke test:

```bash
npm run test:e2e:smoke
```

Jalankan suite publik, auth, redirect, protected route, 404, standalone route, dan admin:

```bash
npm run test:e2e
```

Jalankan login student dan instructor:

```bash
npm run test:e2e:auth-login
```

Jalankan authenticated flows student dan instructor:

```bash
npm run test:e2e:auth
```

Jalankan critical flows dalam mode baca. Mode ini login memakai data DB, membuka halaman kritis, tetapi tidak menekan aksi mutasi seperti submit/grade:

```bash
npm run test:e2e:critical
```

Jika memang ingin menguji aksi mutasi ke database test, aktifkan:

```bash
E2E_ALLOW_MUTATION=1 npm run test:e2e:critical
```

Gunakan mode mutasi hanya pada database test karena dapat mengubah enrollment, submission, grade, dan feedback.

## 5. Pengujian k6 Browser

k6 Browser menjalankan Chromium untuk mengukur akses halaman, assertion, request browser, dan metrik performa.

Set baseline ringan:

```bash
export PERF_VUS=1
export PERF_DURATION=30s
export PERF_RUN_ALL_DURATION=18m
export PERF_AUTH_FLOWS_DURATION=25m
export PERF_CRITICAL_DURATION=12m
```

Jalankan home performance:

```bash
npm run test:perf:k6:home
```

Jalankan login performance:

```bash
npm run test:perf:k6:auth
```

Jalankan route utama:

```bash
npm run test:perf:k6:run-all
```

Jalankan authenticated flows:

```bash
npm run test:perf:k6:authenticated-flows
```

Jalankan critical flows browser:

```bash
npm run test:perf:k6:critical
```

Hasil k6 tersimpan di:

```text
performance/results/
```

## 6. Kriteria Lulus

| Jenis | Kriteria |
|---|---|
| Selenium | Seluruh suite selesai, jumlah gagal `0`, dan redirect/teks/elemen sesuai ekspektasi. |
| k6 Browser | Threshold `checks` terpenuhi dan tidak ada skenario utama yang gagal karena timeout/login. |

## 7. Catatan Operasional

- Jangan menjalankan Selenium/k6 di VPS aplikasi jika storage masih penuh.
- Jangan mengarah ke `localhost` kecuali test dijalankan pada mesin yang sama dengan frontend.
- Untuk target VPS test, selalu gunakan `BASE_URL=http://157.10.252.236:5174`.
- Jika login gagal, cek seed database test dan pastikan frontend test dibuild dengan `VITE_API_URL=http://157.10.252.236:3001/api`.
- Jika k6 browser gagal karena Chromium, set `K6_BROWSER_EXECUTABLE_PATH` sesuai lokasi Chrome/Chromium di client-to VPS.
