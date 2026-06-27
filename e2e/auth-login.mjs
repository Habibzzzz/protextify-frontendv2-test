/**
 * E2E khusus /auth/login: form + submit + redirect student / instructor.
 *
 * Menguji login terhadap backend test dan data seed database.
 *
 *   npm run test:e2e:auth-login
 *
 * Opsional: HEADLESS=1  BASE_URL=http://localhost:5173
 */
import { By, until } from "selenium-webdriver";
import { createDriver, BASE_URL } from "./lib/driver.mjs";
import {
  openPath,
  waitForReactApp,
  clearBrowserSession,
  getBodyText,
} from "./lib/helpers.mjs";
import {
  loginAsTestStudent,
  loginAsTestInstructor,
  TEST_STUDENT,
} from "./lib/auth.mjs";

let passed = 0;
let failed = 0;

function ok(id, detail = "") {
  passed += 1;
  console.log(`[e2e:login] ✓ ${id}${detail ? ` — ${detail}` : ""}`);
}

function fail(id, err) {
  failed += 1;
  console.error(`[e2e:login] ✗ ${id}:`, err?.message || err);
}

async function assertBodyMatches(driver, pattern, label, timeout = 20000) {
  await driver.wait(
    async () => pattern.test(await getBodyText(driver)),
    timeout,
    async () => {
      const url = await driver.getCurrentUrl().catch(() => "(unknown-url)");
      const text = await getBodyText(driver).catch(() => "");
      return `${label}: pola ${pattern} tidak ditemukan. URL=${url}. Body=${text.slice(0, 300)}`;
    }
  );
}

async function waitForLoginForm(driver) {
  const email = await driver.wait(
    until.elementLocated(By.css('input[name="email"]')),
    20000,
    'Form login input[name="email"] tidak ditemukan'
  );
  const password = await driver.wait(
    until.elementLocated(By.css('input[name="password"]')),
    20000,
    'Form login input[name="password"] tidak ditemukan'
  );
  await driver.wait(until.elementIsVisible(email), 20000);
  await driver.wait(until.elementIsVisible(password), 20000);
  return { email, password };
}

async function run(driver) {
  await clearBrowserSession(driver);

  await openPath(driver, "/auth/login");
  await waitForReactApp(driver);
  await assertBodyMatches(driver, /Masuk ke Akun Anda|Masuk|Login|Akun/i, "judul-login");
  await waitForLoginForm(driver);
  ok("auth-login-form", "email + password + judul");

  await openPath(driver, "/auth/login");
  await waitForReactApp(driver);
  const invalidForm = await waitForLoginForm(driver);
  await invalidForm.email.sendKeys(TEST_STUDENT.email);
  await invalidForm.password.sendKeys("password-salah");
  await driver.findElement(By.css('form button[type="submit"]')).click();
  await driver.wait(
    async () => {
      const text = await driver.findElement(By.css("body")).getText();
      const url = await driver.getCurrentUrl();
      return url.includes("/auth/login") && /Login Gagal|password salah|credentials|invalid|gagal/i.test(text);
    },
    15000,
    "Login invalid tidak menampilkan feedback error"
  );
  ok("auth-login-invalid", "kredensial salah ditolak");

  await openPath(driver, "/auth/login");
  await waitForReactApp(driver);
  const validForm = await waitForLoginForm(driver);
  await validForm.email.sendKeys(TEST_STUDENT.email);
  await validForm.password.sendKeys(TEST_STUDENT.password);
  const loadingSubmit = await driver.findElement(By.css('form button[type="submit"]'));
  await loadingSubmit.click();
  await driver.wait(
    async () => {
      const url = await driver.getCurrentUrl();
      const text = await loadingSubmit.getText().catch(() => "");
      const disabled = await loadingSubmit.getAttribute("disabled").catch(() => null);
      return url.includes("/dashboard") || text.includes("Memproses") || disabled !== null;
    },
    15000,
    "Submit login tidak menunjukkan proses atau redirect"
  );
  ok("auth-login-loading-submit", "submit memproses login/redirect");

  await clearBrowserSession(driver);
  await loginAsTestStudent(driver);
  ok("auth-login-student", "redirect ke dashboard mahasiswa");

  await clearBrowserSession(driver);
  await loginAsTestInstructor(driver);
  ok("auth-login-instructor", "redirect ke dashboard instruktur");
}

async function main() {
  const driver = await createDriver();
  try {
    await run(driver);
  } catch (e) {
    fail("auth-login-suite", e);
  } finally {
    await driver.quit();
  }

  console.log(
    `\n[e2e:login] Selesai: ${passed} lulus, ${failed} gagal (total ${passed + failed})`
  );
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("[e2e:login] Fatal:", e);
  process.exitCode = 1;
});
