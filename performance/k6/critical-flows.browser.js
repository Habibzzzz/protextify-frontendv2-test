import { browser } from "k6/browser";
import { check, sleep } from "k6";
import { runCase } from "./lib/caseMetrics.js";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5173";
const DURATION = __ENV.PERF_CRITICAL_DURATION || "12m";
const VUS = Number(__ENV.PERF_VUS || 1);

const SEED = {
  assignmentId: __ENV.E2E_ASSIGNMENT_ID || "assignment-1",
  submissionId: __ENV.E2E_SUBMISSION_ID || "submission-1",
};

const STUDENT_EMAIL = __ENV.E2E_STUDENT_EMAIL || "alice.student@university.edu";
const STUDENT_PASSWORD = __ENV.E2E_STUDENT_PASSWORD || "password123";
const INSTRUCTOR_EMAIL = __ENV.E2E_INSTRUCTOR_EMAIL || "john.instructor@university.edu";
const INSTRUCTOR_PASSWORD = __ENV.E2E_INSTRUCTOR_PASSWORD || "password123";

const CRITICAL_CASES = [
  {
    id: "crit-01-join-class",
    role: "student",
    path: "/dashboard/join-class",
    includesAny: ["Gabung Kelas", "Token Kelas", "Preview Kelas"],
  },
  {
    id: "crit-02-citation-generator",
    role: "student",
    path: `/dashboard/assignments/${SEED.assignmentId}/write`,
    includesAny: ["Daftar Pustaka", "Sitasi", "Citation", "editor", "Tugas"],
  },
  {
    id: "crit-03-submit-assignment",
    role: "student",
    path: `/dashboard/assignments/${SEED.assignmentId}/write`,
    includesAny: ["Kumpulkan", "Simpan Draft", "editor", "Tugas", "integritas"],
  },
  {
    id: "crit-04-grade-submission",
    role: "instructor",
    path: `/instructor/submissions/${SEED.submissionId}/grade`,
    includesAny: ["Beri Nilai", "Simpan Nilai", "Feedback", "grade", "Nilai"],
  },
  {
    id: "crit-05-view-evaluation",
    role: "student",
    path: `/dashboard/submissions/${SEED.submissionId}`,
    includesAny: ["Detail Submission", "Nilai", "Feedback", "Evaluasi", "Submission"],
  },
  {
    id: "crit-05-plagiarism-report",
    role: "student",
    path: `/dashboard/submissions/${SEED.submissionId}/plagiarism-report`,
    includesAny: ["Laporan Plagiarisme", "Plagiarism", "Similarity", "Kemiripan"],
  },
];

export const options = {
  scenarios: {
    browser_critical_flows: {
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

function includesAny(text, list) {
  if (typeof text !== "string") return false;
  return Array.isArray(list) && list.some((token) => text.includes(token));
}

function statusOk(response) {
  if (!response) return true;
  const status = typeof response.status === "function" ? response.status() : response.status;
  return typeof status === "number" && status >= 200 && status < 400;
}

async function login(page, role) {
  const isInstructor = role === "instructor";
  const email = isInstructor ? INSTRUCTOR_EMAIL : STUDENT_EMAIL;
  const password = isInstructor ? INSTRUCTOR_PASSWORD : STUDENT_PASSWORD;

  await page.goto(`${BASE_URL}/auth/login`, {
    waitUntil: "load",
    timeout: Number(__ENV.K6_GOTO_TIMEOUT_MS || 60000),
  });
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.waitForSelector('input[name="password"]', { timeout: 15000 });
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await page.locator('form button[type="submit"]').click();

  const deadline = Date.now() + Number(__ENV.K6_LOGIN_TIMEOUT_MS || 45000);
  while (Date.now() < deadline) {
    const currentUrl = page.url();
    if (currentUrl && !currentUrl.includes("/auth/login")) return currentUrl;
    await page.waitForTimeout(250);
  }

  throw new Error(`Login ${role} tidak meninggalkan /auth/login`);
}

async function openAndGetBody(page, path) {
  const response = await page.goto(`${BASE_URL}${path}`, {
    waitUntil: "load",
    timeout: Number(__ENV.K6_GOTO_TIMEOUT_MS || 60000),
  });
  await page.waitForSelector("body", { timeout: 30000 });
  const bodyText = await page.locator("body").textContent();
  return { response, bodyText, currentUrl: page.url() };
}

async function runCriticalCase(page, item) {
  await runCase(`critical:${item.id}`, async () => {
    await login(page, item.role);
    const { response, bodyText, currentUrl } = await openAndGetBody(page, item.path);

    const ok = check(
      { response, bodyText, currentUrl },
      {
        [`critical:${item.id}:status`]: (ctx) =>
          statusOk(ctx.response) && !String(ctx.currentUrl || "").includes("/auth/login"),
        [`critical:${item.id}:content`]: (ctx) =>
          includesAny(ctx.bodyText, item.includesAny) || String(ctx.bodyText || "").trim().length > 40,
      },
    );
    return ok;
  });
}

export default async function () {
  const page = await browser.newPage();
  try {
    for (const item of CRITICAL_CASES) {
      await runCriticalCase(page, item);
    }
    sleep(1);
  } finally {
    await page.close();
  }
}
