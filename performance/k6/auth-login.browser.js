import { browser } from "k6/browser";
import { check, sleep } from "k6";
import { runCase } from "./lib/caseMetrics.js";
import {
  isPostLoginAppUrl,
  waitUntilLeavesAuthLogin,
} from "./lib/postLoginUrl.js";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5173";
const EMAIL = __ENV.E2E_STUDENT_EMAIL || "alice.student@university.edu";
const PASSWORD = __ENV.E2E_STUDENT_PASSWORD || "password123";
const DURATION = __ENV.PERF_DURATION || "30s";
const VUS = Number(__ENV.PERF_VUS || 1);

export const options = {
  scenarios: {
    browser_auth_login: {
      executor: "constant-vus",
      vus: VUS,
      duration: DURATION,
      options: {
        browser: {
          type: "chromium",
        },
      },
    },
  },
  thresholds: {
    checks: ["rate>0.99"],
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    await runCase("LOG-01", async () => {
      const response = await page.goto(`${BASE_URL}/auth/login`, {
        waitUntil: "load",
      });

      const statusOk = check(response, {
        "login page status is 200": (r) => r && r.status() === 200,
      });

      await page.waitForSelector('input[name="email"]', { timeout: 15000 });
      await page.waitForSelector('input[name="password"]', { timeout: 15000 });

      await page.locator('input[name="email"]').fill(EMAIL);
      await page.locator('input[name="password"]').fill(PASSWORD);
      await page.locator('form button[type="submit"]').click();

      const currentUrl = await waitUntilLeavesAuthLogin(page);

      const redirectOk = check(currentUrl, {
        "redirects after login": isPostLoginAppUrl,
      });

      return statusOk && redirectOk;
    });

    sleep(1);
  } finally {
    await page.close();
  }
}
