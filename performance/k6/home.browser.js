import { browser } from "k6/browser";
import { check, sleep } from "k6";
import { runCase } from "./lib/caseMetrics.js";
import { parseDurationMs } from "./lib/parseDurationMs.js";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5173";
const DURATION = __ENV.PERF_DURATION || "30s";
const VUS = Number(__ENV.PERF_VUS || 1);

/** One Chromium per VU for the whole run; inner loop repeats the case (avoids restart storms on low RAM). */
const BROWSER_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
];

export const options = {
  scenarios: {
    browser_home: {
      executor: "per-vu-iterations",
      vus: VUS,
      iterations: 1,
      maxDuration: DURATION,
      options: {
        browser: {
          type: "chromium",
          args: BROWSER_ARGS,
        },
      },
    },
  },
  thresholds: {
    checks: ["rate>0.99"],
  },
};

async function runHomeCase(page) {
  return await runCase("SMK-01", async () => {
    const response = await page.goto(`${BASE_URL}/`, {
      // "load" avoids dev HMR keeping the page "busy" forever vs networkidle,
      // and lowers memory spikes vs waiting for full network quiet.
      waitUntil: "load",
    });

    const statusOk = check(response, {
      "home status is 200": (r) => r && r.status() === 200,
    });

    await page.waitForSelector("body", { timeout: 15000 });

    const bodyText = await page.locator("body").textContent();
    const contentOk = check(bodyText, {
      "home content rendered": (txt) =>
        typeof txt === "string" &&
        txt.toLowerCase().includes("protextify") &&
        /Platform Deteksi|Plagiarisme|Dunia Akademik Modern/i.test(txt),
    });

    return statusOk && contentOk;
  });
}

export default async function () {
  const durationMs = parseDurationMs(DURATION);
  const deadline = Date.now() + durationMs - 1500;
  const page = await browser.newPage();

  try {
    while (Date.now() < deadline) {
      await runHomeCase(page);
      sleep(1);
    }
  } finally {
    await page.close();
  }
}
