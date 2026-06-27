# E2E Frontend Test

Suite ini menjalankan pengujian Selenium terhadap frontend test yang terhubung ke backend dan database test.

## Target

```bash
export BASE_URL="http://157.10.252.236:5174"
```

## Data DB Seed

| Data | Nilai |
|---|---|
| Student | `alice.student@university.edu` / `password123` |
| Instructor | `john.instructor@university.edu` / `password123` |
| Admin | `admin@protextify.id` / `password123` |
| Class ID | `class-1` |
| Assignment ID | `assignment-1` |
| Submission ID | `submission-1` |
| Transaction ID | `transaction-1` |
| Join token | `WEBDEV2025` |

## Environment

```bash
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
export HEADLESS=1
```

## Perintah

```bash
npm run test:e2e:smoke
npm run test:e2e
npm run test:e2e:auth-login
npm run test:e2e:auth
npm run test:e2e:critical
```

`test:e2e:critical` default berjalan dalam mode baca. Jika ingin menguji aksi yang mengubah database test:

```bash
E2E_ALLOW_MUTATION=1 npm run test:e2e:critical
```
