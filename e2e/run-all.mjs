/**
 * E2E Selenium — halaman publik, auth form, redirect login, admin, dll.
 *
 * Terminal 1: npm run dev
 * Terminal 2: npm run test:e2e
 *
 * Login app + redirect per role: npm run test:e2e:auth-login
 * Jelajah halaman setelah login: npm run test:e2e:auth
 *
 * Opsional: HEADLESS=1  BASE_URL=http://localhost:5173
 */
import { By, until } from "selenium-webdriver";
import { createDriver, BASE_URL } from "./lib/driver.mjs";
import {
  openPath,
  waitForReactApp,
  waitForReactOrLoginRedirect,
  getBodyText,
  clearBrowserSession,
  waitForMainLoginPage,
  assertBodyIncludes,
  assertBodyIncludesAny,
} from "./lib/helpers.mjs";
import {
  PUBLIC_PAGES,
  AUTH_PAGES,
  PROTECTED_REDIRECT_PATHS,
  NOT_FOUND,
  LEGACY_REDIRECTS,
  STANDALONE_APP_ROUTES,
} from "./routes.manifest.mjs";

const ADMIN_USER = process.env.E2E_ADMIN_USER || "admin@protextify.id";
const ADMIN_PASS = process.env.E2E_ADMIN_PASS || "password123";

let passed = 0;
let failed = 0;

function ok(id, detail = "") {
  passed += 1;
  console.log(`[e2e] ✓ ${id}${detail ? ` — ${detail}` : ""}`);
}

function fail(id, err) {
  failed += 1;
  console.error(`[e2e] ✗ ${id}:`, err?.message || err);
}

async function runPublic(driver, page) {
  await openPath(driver, page.path);
  await waitForReactApp(driver);
  if (page.includesAny) {
    await assertBodyIncludesAny(driver, page.includesAny, page.id);
  } else {
    await assertBodyIncludes(driver, page.includes, page.id);
  }
  ok(page.id, page.path);
}

async function runAuthPage(driver, page) {
  await openPath(driver, page.path);
  await waitForReactApp(driver);
  if (page.selector) {
    await driver.wait(
      until.elementLocated(By.css(page.selector)),
      20000,
      `Selector ${page.selector}`
    );
  }
  if (page.includes) {
    await assertBodyIncludes(driver, page.includes, page.id);
  }
  if (page.includesAny) {
    await assertBodyIncludesAny(driver, page.includesAny, page.id);
  }
  if (page.id === "auth-login") {
    await driver.wait(
      until.elementLocated(By.css('input[name="password"]')),
      15000,
      'Form login: input[name="password"]'
    );
    const submits = await driver.findElements(
      By.css('form button[type="submit"]')
    );
    if (submits.length === 0) {
      throw new Error(`${page.id}: tidak ada button submit di dalam <form>`);
    }
    const body = await getBodyText(driver);
    if (!body.includes("Masuk") || !body.includes("Google")) {
      throw new Error(
        `${page.id}: teks tombol Masuk / Google tidak terbaca di halaman`
      );
    }
  }
  ok(page.id, page.path);
}

/** OAuth callback: sering redirect ke login sebelum #root terisi penuh */
async function runOAuthLikePage(driver, page) {
  await openPath(driver, page.path);
  await waitForReactOrLoginRedirect(driver);
  await driver.wait(
    async () => {
      const url = await driver.getCurrentUrl();
      const text = (await getBodyText(driver)) || "";
      return (
        url.includes("/auth/login") ||
        text.includes("Memproses") ||
        text.includes("Memverifikasi") ||
        text.includes("Masuk ke Akun") ||
        text.includes("Token")
      );
    },
    15000,
    "Callback tidak redirect / tidak render"
  );
  ok(page.id, page.path);
}

async function runProtectedRedirect(driver, item) {
  await openPath(driver, item.path);
  await waitForReactApp(driver);
  await waitForMainLoginPage(driver);
  ok(item.id, `→ /auth/login dari ${item.path}`);
}

async function runLegacyRedirect(driver, item) {
  await openPath(driver, item.path);
  await waitForReactApp(driver);
  await driver.wait(
    async () => {
      const u = await driver.getCurrentUrl();
      return u.includes(item.expectUrlPart);
    },
    20000,
    `Redirect ke ${item.expectUrlPart}`
  );
  ok(item.id, item.expectUrlPart);
}

async function runNotFound(driver) {
  await openPath(driver, "/about");
  await waitForReactApp(driver);
  await openPath(driver, NOT_FOUND.path);
  await waitForReactApp(driver);
  await assertBodyIncludes(driver, NOT_FOUND.includes, NOT_FOUND.id);
  ok(NOT_FOUND.id, NOT_FOUND.path);

  const backButton = await driver.findElement(
    By.xpath("//button[contains(., 'Kembali')]")
  );
  await backButton.click();
  await driver.wait(
    async () => (await driver.getCurrentUrl()).includes("/about"),
    15000,
    "Tombol kembali 404 tidak mengarah ke halaman sebelumnya"
  );
  ok("not-found-back-button", "kembali dari 404");
}

async function runStandalone(driver, page) {
  await openPath(driver, page.path);
  await waitForReactApp(driver);
  await driver.wait(
    async () => {
      const t = ((await getBodyText(driver)) || "").toLowerCase();
      if (
        t.includes("tugas") ||
        t.includes("memuat") ||
        t.includes("submission") ||
        t.includes("gagal") ||
        t.includes("menulis")
      ) {
        return true;
      }
      const spinners = await driver.findElements(By.css(".animate-spin"));
      return spinners.length > 0;
    },
    25000,
    "Write assignment: tidak ada konten / spinner"
  );
  ok(page.id, page.path);
}

async function runAdminFlow(driver) {
  await openPath(driver, "/admin/login");
  await waitForReactApp(driver);
  await assertBodyIncludesAny(driver, ["Admin Login", "Login Admin", "panel administrasi"], "admin-login-page");
  ok("admin-login-page", "/admin/login");

  const userEl = await driver.findElement(By.css('input[name="email"]'));
  const passEl = await driver.findElement(By.css('input[name="password"]'));
  await userEl.clear();
  await userEl.sendKeys(ADMIN_USER);
  await passEl.clear();
  await passEl.sendKeys(ADMIN_PASS);

  const submit = await driver.findElement(
    By.xpath("//button[contains(., 'Masuk sebagai Admin')]")
  );
  await submit.click();

  await driver.wait(
    async () => {
      const url = await driver.getCurrentUrl();
      return url.includes("/admin/dashboard") || url.includes("/admin/monitoring");
    },
    20000,
    "Admin tidak masuk ke dashboard admin"
  );
  await waitForReactApp(driver);
  await assertBodyIncludesAny(driver, ["Dashboard", "Monitoring", "Statistik", "Admin"], "admin-dashboard");
  ok("admin-dashboard", "/admin/dashboard");

  await openPath(driver, "/admin/users");
  await waitForReactApp(driver);
  await assertBodyIncludes(driver, "Kelola Pengguna", "admin-users");
  ok("admin-users", "/admin/users");
}

async function main() {
  // console.log("[e2e] Base URL:", BASE_URL);
  console.log("[e2e] Mulai suite penuh…\n");

  const driver = await createDriver();

  try {
    await clearBrowserSession(driver);

    console.log("[e2e] — Publik (RootLayout) —");
    for (const page of PUBLIC_PAGES) {
      try {
        await runPublic(driver, page);
      } catch (e) {
        fail(page.id, e);
      }
    }

    console.log("\n[e2e] — Auth (form / halaman) —");
    for (const page of AUTH_PAGES) {
      try {
        if (
          page.id === "auth-callback" ||
          page.id === "auth-google-callback"
        ) {
          await runOAuthLikePage(driver, page);
        } else {
          await runAuthPage(driver, page);
        }
      } catch (e) {
        fail(page.id, e);
      }
    }

    console.log("\n[e2e] — Legacy redirect —");
    for (const item of LEGACY_REDIRECTS) {
      try {
        await runLegacyRedirect(driver, item);
      } catch (e) {
        fail(item.id, e);
      }
    }

    console.log("\n[e2e] — Terproteksi → redirect login —");
    for (const item of PROTECTED_REDIRECT_PATHS) {
      try {
        await runProtectedRedirect(driver, item);
      } catch (e) {
        fail(item.id, e);
      }
    }

    console.log("\n[e2e] — 404 —");
    try {
      await runNotFound(driver);
    } catch (e) {
      fail(NOT_FOUND.id, e);
    }

    console.log("\n[e2e] — Rute standalone (tanpa guard) —");
    for (const page of STANDALONE_APP_ROUTES) {
      try {
        await runStandalone(driver, page);
      } catch (e) {
        fail(page.id, e);
      }
    }

    // console.log("\n[e2e] — Admin —");
    try {
      await runAdminFlow(driver);
    } catch (e) {
      fail("admin-flow", e);
    }
  } finally {
    await driver.quit();
  }

  console.log(
    `\n[e2e] Selesai: ${passed} lulus, ${failed} gagal (total ${passed + failed})`
  );
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("[e2e] Fatal:", e);
  process.exitCode = 1;
});
