import { browser } from "k6/browser";
import { check, sleep } from "k6";
import { runCase } from "./lib/caseMetrics.js";
import {
  isPostLoginAppUrl,
  waitUntilLeavesAuthLogin,
} from "./lib/postLoginUrl.js";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5173";
/** Pakai `PERF_AUTH_FLOWS_DURATION` — hindari `PERF_DURATION` pendek memutus suite ini. */
const DURATION = __ENV.PERF_AUTH_FLOWS_DURATION || "25m";
const VUS = Number(__ENV.PERF_VUS || 1);

const STUDENT_EMAIL = __ENV.E2E_STUDENT_EMAIL || "alice.student@university.edu";
const STUDENT_PASSWORD = __ENV.E2E_STUDENT_PASSWORD || "password123";
const INSTRUCTOR_EMAIL = __ENV.E2E_INSTRUCTOR_EMAIL || "john.instructor@university.edu";
const INSTRUCTOR_PASSWORD = __ENV.E2E_INSTRUCTOR_PASSWORD || "password123";

const SEED = {
  classId: __ENV.E2E_CLASS_ID || "class-1",
  assignmentId: __ENV.E2E_ASSIGNMENT_ID || "assignment-1",
  submissionId: __ENV.E2E_SUBMISSION_ID || "submission-1",
  transactionId: __ENV.E2E_TRANSACTION_ID || "transaction-1",
};

const STUDENT_CASES = [
  { id: "student-overview", path: "/dashboard/overview", includes: "Dashboard Student" },
  { id: "student-classes", path: "/dashboard/classes", includes: "Kelas Saya" },
  { id: "student-assignments", path: "/dashboard/assignments", includes: "Tugas Saya" },
  { id: "student-join-class", path: "/dashboard/join-class", includes: "Gabung Kelas" },
  {
    id: "student-class-detail",
    path: `/dashboard/classes/${SEED.classId}`,
    includes: "Detail Kelas",
  },
  {
    id: "student-class-assignments",
    path: `/dashboard/classes/${SEED.classId}/assignments`,
    includes: "Daftar Tugas Kelas",
  },
  {
    id: "student-assignment-detail",
    path: `/dashboard/assignments/${SEED.assignmentId}`,
    includes: "Detail Tugas",
  },
  {
    id: "student-write-assignment",
    path: `/dashboard/assignments/${SEED.assignmentId}/write`,
    includesAny: ["Tugas", "menulis", "draft", "editor", "Protextify"],
  },
  { id: "student-submissions", path: "/dashboard/submissions", includes: "Riwayat" },
  {
    id: "student-submission-detail",
    path: `/dashboard/submissions/${SEED.submissionId}`,
    includes: "Detail Submission",
  },
  {
    id: "student-plagiarism-report",
    path: `/dashboard/submissions/${SEED.submissionId}/plagiarism-report`,
    includes: "Laporan Plagiarisme",
  },
  { id: "student-profile", path: "/dashboard/profile", includes: "Profil Akun Student" },
  { id: "student-profile-standalone", path: "/profile", includes: "Profil Akun Student" },
  { id: "student-storage-health", path: "/dashboard/storage-health", includes: "Status Storage Akun" },
];

const INSTRUCTOR_CASES = [
  { id: "instructor-dashboard", path: "/instructor/dashboard", includes: "Dashboard Instructor" },
  { id: "instructor-classes", path: "/instructor/classes", includes: "Kelas" },
  { id: "instructor-create-class", path: "/instructor/create-class", includes: "Buat" },
  {
    id: "instructor-class-detail",
    path: `/instructor/classes/${SEED.classId}`,
    includesAny: ["Token Kelas", "Buat Tugas", "Pemrograman Web"],
  },
  {
    id: "instructor-class-history",
    path: `/instructor/classes/${SEED.classId}/history`,
    includes: "Riwayat Submission Kelas",
  },
  {
    id: "instructor-class-settings",
    path: `/instructor/classes/${SEED.classId}/settings`,
    includes: "Pengaturan Kelas",
  },
  {
    id: "instructor-create-assignment",
    path: `/instructor/classes/${SEED.classId}/create-assignment`,
    includes: "Buat Tugas Baru",
  },
  {
    id: "instructor-assignment-detail",
    path: `/instructor/assignments/${SEED.assignmentId}`,
    includesAny: ["Essay Integritas", "Deadline", "siswa submit"],
  },
  {
    id: "instructor-assignment-monitor",
    path: `/instructor/assignments/${SEED.assignmentId}/monitor`,
    includes: "Monitor Submission",
  },
  {
    id: "instructor-assignment-submissions",
    path: `/instructor/assignments/${SEED.assignmentId}/submissions`,
    includes: "Monitor Submission",
  },
  {
    id: "instructor-assignment-bulk-grade",
    path: `/instructor/assignments/${SEED.assignmentId}/bulk-grade`,
    includes: "Nilai Massal",
  },
  {
    id: "instructor-assignment-analytics",
    path: `/instructor/assignments/${SEED.assignmentId}/analytics`,
    includesAny: ["Ringkasan performa", "Total Submission", "Analytics Tugas"],
  },
  {
    id: "instructor-submission-plagiarism",
    path: `/instructor/submissions/${SEED.submissionId}/plagiarism`,
    includes: "Analisis Plagiarisme",
  },
  {
    id: "instructor-submission-grade",
    path: `/instructor/submissions/${SEED.submissionId}/grade`,
    includes: "Beri Nilai Tugas",
  },
  { id: "instructor-analytics", path: "/instructor/analytics", includes: "Analytics" },
  { id: "instructor-transactions", path: "/instructor/transactions", includes: "Transaksi" },
  {
    id: "instructor-transaction-detail",
    path: `/instructor/transactions/${SEED.transactionId}`,
    includes: "Detail Transaksi",
  },
  { id: "instructor-settings", path: "/instructor/settings", includes: "Pengaturan Akun" },
];

export const options = {
  scenarios: {
    browser_authenticated_flows: {
      executor: "per-vu-iterations",
      vus: VUS,
      iterations: 1,
      maxDuration: DURATION,
      options: { browser: { type: "chromium" } },
    },
  },
  thresholds: {
    checks: ["rate>0.99"],
  },
};

function includes(text, token) {
  return typeof text === "string" && text.includes(token);
}

function includesAny(text, list) {
  if (typeof text !== "string") return false;
  return Array.isArray(list) && list.some((token) => text.includes(token));
}

function httpStatusOk(response) {
  if (!response) return false;
  const status = typeof response.status === "function" ? response.status() : response.status;
  return typeof status === "number" && status >= 200 && status < 400;
}

function navigationOk(response, bodyText, item) {
  if (httpStatusOk(response)) return true;
  if (response != null) return false;
  if (item.includes) return includes(bodyText, item.includes);
  if (item.includesAny) return includesAny(bodyText, item.includesAny);
  return typeof bodyText === "string" && bodyText.trim().length > 40;
}

async function openAndGetBody(page, path, item = {}) {
  const response = await page.goto(`${BASE_URL}${path}`, {
    waitUntil: "load",
    timeout: Number(__ENV.K6_GOTO_TIMEOUT_MS || 60000),
  });
  await page.waitForSelector("body", { timeout: 30000 });

  const deadline = Date.now() + 45000;
  let bodyText = await page.locator("body").textContent();
  while (Date.now() < deadline) {
    bodyText = await page.locator("body").textContent();
    if (item.includes && includes(bodyText, item.includes)) break;
    if (item.includesAny && includesAny(bodyText, item.includesAny)) break;
    if (!item.includes && !item.includesAny && bodyText.trim().length > 40) break;
    await page.waitForTimeout(250);
  }

  return { response, bodyText };
}

async function login(page, email, password, roleId) {
  await runCase(`${roleId}:login`, async () => {
    const { response, bodyText } = await openAndGetBody(page, "/auth/login");
    const statusOk = check(response, { [`${roleId}:login-status`]: (r) => r && r.status() === 200 });
    const contentOk = check(bodyText, {
      [`${roleId}:login-page-content`]: (txt) =>
        includesAny(txt, ["Masuk", "Login", "Akun", "Google"]),
    });

    await page.waitForSelector('input[name="email"]', { timeout: 15000 });
    await page.waitForSelector('input[name="password"]', { timeout: 15000 });

    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('form button[type="submit"]').click();

    const urlAfterLogin = await waitUntilLeavesAuthLogin(page);

    const redirectOk = check(urlAfterLogin, {
      [`${roleId}:login-redirect`]: isPostLoginAppUrl,
    });
    return statusOk && contentOk && redirectOk;
  });
}

async function runCases(page, cases, groupId) {
  for (const item of cases) {
    await runCase(`${groupId}:${item.id}`, async () => {
      const { response, bodyText } = await openAndGetBody(page, item.path, item);
      let ok = check(
        { response, bodyText, item },
        {
          [`${groupId}:${item.id}:status`]: (ctx) =>
            navigationOk(ctx.response, ctx.bodyText, ctx.item),
        },
      );
      if (item.includes) {
        ok =
          check(bodyText, {
            [`${groupId}:${item.id}:includes`]: (txt) => includes(txt, item.includes),
          }) && ok;
      }
      if (item.includesAny) {
        ok =
          check(bodyText, {
            [`${groupId}:${item.id}:includesAny`]: (txt) => includesAny(txt, item.includesAny),
          }) && ok;
      }
      return ok;
    });
  }
}

export default async function () {
  let context;
  let page;
  try {
    // Student flow in isolated context.
    context = await browser.newContext();
    page = await context.newPage();
    await login(page, STUDENT_EMAIL, STUDENT_PASSWORD, "student");
    await runCases(page, STUDENT_CASES, "student");
    await page.close();
    await context.close();
    page = null;
    context = null;

    // Instructor flow in a fresh isolated context.
    context = await browser.newContext();
    page = await context.newPage();
    await login(page, INSTRUCTOR_EMAIL, INSTRUCTOR_PASSWORD, "instructor");
    await runCases(page, INSTRUCTOR_CASES, "instructor");
    sleep(1);
  } finally {
    if (page) {
      await page.close();
    }
    if (context) {
      await context.close();
    }
  }
}
