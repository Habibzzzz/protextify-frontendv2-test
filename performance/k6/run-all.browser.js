import { browser } from "k6/browser";
import { check, sleep } from "k6";
import { runCase } from "./lib/caseMetrics.js";
import {
  AUTH_PAGES,
  LEGACY_REDIRECTS,
  NOT_FOUND,
  PROTECTED_REDIRECT_PATHS,
  PUBLIC_PAGES,
  STANDALONE_APP_ROUTES,
} from "./routes.manifest.js";

const BASE_URL = __ENV.BASE_URL || "http://localhost:5173";
/** Pakai `PERF_RUN_ALL_DURATION` (bukan `PERF_DURATION`) agar tidak ketimpa 30s dari tes home/auth pendek. */
const DURATION = __ENV.PERF_RUN_ALL_DURATION || "18m";
const VUS = Number(__ENV.PERF_VUS || 1);
const ADMIN_USER = __ENV.E2E_ADMIN_USER || "admin@protextify.id";
const ADMIN_PASS = __ENV.E2E_ADMIN_PASS || "password123";

/**
 * Satu suite saja (debug tanpa run full): `all` | `public` | `auth` | `legacy` | `protected` | `notfound` | `standalone` | `admin`
 * Contoh: `k6 run -e K6_RUN_ALL_SUITE=public performance/k6/run-all.browser.js`
 */
const RUN_ALL_SUITE = String(__ENV.K6_RUN_ALL_SUITE || "all")
  .toLowerCase()
  .trim();
const RUN_ALL_SUITE_IDS = [
  "all",
  "public",
  "auth",
  "legacy",
  "protected",
  "notfound",
  "standalone",
  "admin",
];
if (!RUN_ALL_SUITE_IDS.includes(RUN_ALL_SUITE)) {
  throw new Error(
    `K6_RUN_ALL_SUITE="${__ENV.K6_RUN_ALL_SUITE}" tidak valid. Pilihan: ${RUN_ALL_SUITE_IDS.join(", ")}`,
  );
}

const scenarioName =
  RUN_ALL_SUITE === "all" ? "browser_run_all" : `browser_run_all_${RUN_ALL_SUITE}`;

export const options = {
  scenarios: {
    [scenarioName]: {
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

function includeCheck(text, expected) {
  return typeof text === "string" && text.includes(expected);
}

function includeAnyCheck(text, expectedList) {
  if (typeof text !== "string" || !Array.isArray(expectedList)) return false;
  return expectedList.some((item) => text.includes(item));
}

function httpStatusOk(response) {
  if (!response) return false;
  const s =
    typeof response.status === "function" ? response.status() : response.status;
  return typeof s === "number" && s >= 200 && s < 400;
}

/**
 * Di k6 browser, `page.goto` kadang mengembalikan `null` walau navigasi sukses (perilaku dokumentasi k6 untuk beberapa kasus SPA).
 * Kalau body sudah memuat `needle` / salah satu `needles`, anggap navigasi layak.
 */
function navigationOk(response, bodyText, { includes, includesAny } = {}) {
  if (httpStatusOk(response)) return true;
  if (response != null) return false;
  if (typeof bodyText !== "string") return false;
  if (includes != null && includeCheck(bodyText, includes)) return true;
  if (includesAny != null && includeAnyCheck(bodyText, includesAny)) return true;
  return false;
}

/**
 * Tunggu SPA: `body` bisa ada duluan sebelum React mengisi teks (umum ke VPS / jaringan lambat).
 */
async function openAndReadBody(page, path, options = {}) {
  const navTimeoutMs = Number(__ENV.K6_GOTO_TIMEOUT_MS || 60000);
  const pollMs = Number(__ENV.K6_SPA_SETTLE_POLL_MS || 250);
  const waitBudgetMs = Math.min(navTimeoutMs, 45000);
  const response = await page.goto(`${BASE_URL}${path}`, {
    waitUntil: "load",
    timeout: navTimeoutMs,
  });
  await page.waitForSelector("body", { timeout: waitBudgetMs });

  const deadline = Date.now() + waitBudgetMs;
  let bodyText = await page.locator("body").textContent();
  let currentUrl = page.url();

  const needsContentWait =
    options.includes != null ||
    options.includesAny != null ||
    options.waitForUrlIncludes != null;

  if (needsContentWait) {
    while (Date.now() < deadline) {
      bodyText = await page.locator("body").textContent();
      currentUrl = page.url();
      if (
        options.waitForUrlIncludes != null &&
        typeof currentUrl === "string" &&
        currentUrl.includes(options.waitForUrlIncludes)
      ) {
        break;
      }
      if (options.includes != null && includeCheck(bodyText, options.includes)) {
        break;
      }
      if (options.includesAny != null && includeAnyCheck(bodyText, options.includesAny)) {
        break;
      }
      if (
        options.orLoginUrl &&
        typeof currentUrl === "string" &&
        currentUrl.includes("/auth/login")
      ) {
        break;
      }
      await page.waitForTimeout(pollMs);
    }
  }

  bodyText = await page.locator("body").textContent();
  currentUrl = page.url();
  return { response, bodyText, currentUrl };
}

async function runPublicCases(page) {
  for (const item of PUBLIC_PAGES) {
    await runCase(`public:${item.id}`, async () => {
      const { response, bodyText } = await openAndReadBody(page, item.path, {
        includes: item.includes,
      });
      const statusOk = check(
        { response, bodyText, includes: item.includes },
        {
          [`public:${item.id}:status`]: (ctx) =>
            navigationOk(ctx.response, ctx.bodyText, { includes: ctx.includes }),
        },
      );
      const includeOk = check(bodyText, {
        [`public:${item.id}:includes`]: (txt) => includeCheck(txt, item.includes),
      });
      return statusOk && includeOk;
    });
  }
}

async function runAuthCases(page) {
  for (const item of AUTH_PAGES) {
    await runCase(`auth:${item.id}`, async () => {
      const waitOpts = {};
      if (item.includes) waitOpts.includes = item.includes;
      if (item.includesAny) {
        waitOpts.includesAny = item.includesAny;
        waitOpts.orLoginUrl = true;
      }
      const { response, bodyText, currentUrl } = await openAndReadBody(page, item.path, waitOpts);
      const authIncludes = item.includes || "";
      const authIncludesAny = item.includesAny || null;
      const statusOk = check(
        { response, bodyText, currentUrl, authIncludes, authIncludesAny },
        {
          [`auth:${item.id}:status`]: (ctx) => {
            if (httpStatusOk(ctx.response)) return true;
            if (ctx.response != null) return false;
            if (typeof ctx.bodyText !== "string") return false;
            if (ctx.authIncludes && includeCheck(ctx.bodyText, ctx.authIncludes)) return true;
            if (
              Array.isArray(ctx.authIncludesAny) &&
              (includeAnyCheck(ctx.bodyText, ctx.authIncludesAny) ||
                (typeof ctx.currentUrl === "string" && ctx.currentUrl.includes("/auth/login")))
            ) {
              return true;
            }
            return false;
          },
        },
      );
      let ok = statusOk;
      if (item.includes) {
        ok =
          check(bodyText, {
            [`auth:${item.id}:includes`]: (txt) => includeCheck(txt, item.includes),
          }) && ok;
      }
      if (item.includesAny) {
        ok =
          check({ bodyText, currentUrl }, {
            [`auth:${item.id}:includesAny`]: (ctx) =>
              includeAnyCheck(ctx.bodyText, item.includesAny) ||
              (typeof ctx.currentUrl === "string" && ctx.currentUrl.includes("/auth/login")),
          }) && ok;
      }
      return ok;
    });
  }
}

async function runLegacyRedirectCases(page) {
  for (const item of LEGACY_REDIRECTS) {
    await runCase(`legacy:${item.id}`, async () => {
      await openAndReadBody(page, item.path, { waitForUrlIncludes: item.expectUrlPart });
      return check(page.url(), {
        [`legacy:${item.id}:redirect`]: (url) =>
          typeof url === "string" && url.includes(item.expectUrlPart),
      });
    });
  }
}

async function runProtectedRedirectCases(page) {
  for (const item of PROTECTED_REDIRECT_PATHS) {
    await runCase(`protected:${item.id}`, async () => {
      await openAndReadBody(page, item.path, { waitForUrlIncludes: "/auth/login" });
      return check(page.url(), {
        [`protected:${item.id}:redirect_login`]: (url) =>
          typeof url === "string" && url.includes("/auth/login"),
      });
    });
  }
}

async function runNotFoundCase(page) {
  await runCase("not-found", async () => {
    const { bodyText } = await openAndReadBody(page, NOT_FOUND.path, {
      includes: NOT_FOUND.includes,
    });
    return check(bodyText, { ["not-found:includes"]: (txt) => includeCheck(txt, NOT_FOUND.includes) });
  });
}

async function runStandaloneCases(page) {
  for (const item of STANDALONE_APP_ROUTES) {
    await runCase(`standalone:${item.id}`, async () => {
      const { bodyText } = await openAndReadBody(page, item.path, {
        includesAny: item.includesAny,
      });
      return check(bodyText, {
        [`standalone:${item.id}:content`]: (txt) => includeAnyCheck(txt, item.includesAny),
      });
    });
  }
}

async function runAdminCases(page) {
  await runCase("admin:monitoring", async () => {
    await openAndReadBody(page, "/admin/login", { includes: "Masuk sebagai Admin" });
    await page.locator('input[name="username"]').fill(ADMIN_USER);
    await page.locator('input[name="password"]').fill(ADMIN_PASS);
    await page.locator('//button[contains(., "Masuk sebagai Admin")]').click();
    await page.waitForLoadState("load");
    const redirectOk = check(page.url(), {
      "admin:monitoring:redirect": (url) => typeof url === "string" && url.includes("/admin/monitoring"),
    });
    const monitoringBody = await page.locator("body").textContent();
    const contentOk = check(monitoringBody, {
      "admin:monitoring:content": (txt) =>
        includeAnyCheck(txt, ["Monitoring", "Admin", "Kelola", "Pengguna"]),
    });
    return redirectOk && contentOk;
  });
  await runCase("admin:users", async () => {
    const { bodyText: usersBody } = await openAndReadBody(page, "/admin/users", {
      includes: "Kelola Pengguna",
    });
    return check(usersBody, {
      "admin:users:content": (txt) => includeCheck(txt, "Kelola Pengguna"),
    });
  });
}

async function runFullSuite(page, skipAdmin) {
  await runPublicCases(page);
  await runAuthCases(page);
  await runLegacyRedirectCases(page);
  await runProtectedRedirectCases(page);
  await runNotFoundCase(page);
  await runStandaloneCases(page);
  if (!skipAdmin) {
    await runAdminCases(page);
  }
}

async function runSingleSuite(page, suite, skipAdmin) {
  if (suite === "admin" && skipAdmin) {
    console.warn("[run-all] SKIP_K6_ADMIN aktif — blok admin dilewati.");
    return;
  }
  switch (suite) {
    case "public":
      return runPublicCases(page);
    case "auth":
      return runAuthCases(page);
    case "legacy":
      return runLegacyRedirectCases(page);
    case "protected":
      return runProtectedRedirectCases(page);
    case "notfound":
      return runNotFoundCase(page);
    case "standalone":
      return runStandaloneCases(page);
    case "admin":
      return runAdminCases(page);
    default:
      throw new Error(`suite tidak didukung: ${suite}`);
  }
}

export default async function () {
  const page = await browser.newPage();
  const skipAdmin =
    __ENV.SKIP_K6_ADMIN === "1" ||
    __ENV.SKIP_K6_ADMIN === "true" ||
    __ENV.SKIP_K6_ADMIN === "yes";
  try {
    if (RUN_ALL_SUITE === "all") {
      await runFullSuite(page, skipAdmin);
    } else {
      await runSingleSuite(page, RUN_ALL_SUITE, skipAdmin);
    }
    sleep(1);
  } finally {
    await page.close();
  }
}
