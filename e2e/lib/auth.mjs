import { By, until } from "selenium-webdriver";
import { getBodyText, openPath, waitForReactApp } from "./helpers.mjs";

export const TEST_STUDENT = {
  email: process.env.E2E_STUDENT_EMAIL || "alice.student@university.edu",
  password: process.env.E2E_STUDENT_PASSWORD || "password123",
};

export const TEST_INSTRUCTOR = {
  email: process.env.E2E_INSTRUCTOR_EMAIL || "john.instructor@university.edu",
  password: process.env.E2E_INSTRUCTOR_PASSWORD || "password123",
};

/**
 * Login lewat /auth/login menggunakan akun seed database test.
 */
export async function loginWithCredentials(
  driver,
  { email, password },
  { urlMustInclude, timeout = 45000 }
) {
  await openPath(driver, "/auth/login");
  await waitForReactApp(driver);

  const emailEl = await driver.wait(
    until.elementLocated(By.css('input[name="email"]')),
    20000,
    'Form login input[name="email"] tidak ditemukan'
  );
  const passEl = await driver.wait(
    until.elementLocated(By.css('input[name="password"]')),
    20000,
    'Form login input[name="password"] tidak ditemukan'
  );
  await driver.wait(until.elementIsVisible(emailEl), 20000);
  await driver.wait(until.elementIsVisible(passEl), 20000);

  await emailEl.click();
  await emailEl.clear();
  await emailEl.sendKeys(email);
  await passEl.click();
  await passEl.clear();
  await passEl.sendKeys(password);

  const submit = await driver.findElement(By.css('form button[type="submit"]'));
  await submit.click();
  await driver.sleep(150);

  let result;
  try {
    result = await driver.wait(
      async () => {
        const u = await driver.getCurrentUrl();
        if (urlMustInclude.some((part) => u.includes(part))) {
          return { ok: true, reason: "url", url: u };
        }

        const session = await driver.executeScript(() => ({
          token: localStorage.getItem("token"),
          user: localStorage.getItem("user"),
          sessionId: localStorage.getItem("sessionId"),
        }));
        if (session?.token && session?.user) {
          return { ok: true, reason: "session", url: u };
        }

        const text = await getBodyText(driver);
        if (/Login Gagal|Unauthorized|Invalid|credentials|gagal|salah|berakhir/i.test(text)) {
          return { ok: false, reason: "error", url: u, text };
        }

        return false;
      },
      timeout,
      `Setelah login, URL harus mengandung salah satu: ${urlMustInclude.join(", ")}`
    );
  } catch (error) {
    const url = await driver.getCurrentUrl().catch(() => "(unknown-url)");
    const text = await getBodyText(driver).catch(() => "");
    const session = await driver
      .executeScript(() => ({
        hasToken: !!localStorage.getItem("token"),
        hasUser: !!localStorage.getItem("user"),
        hasSessionId: !!localStorage.getItem("sessionId"),
      }))
      .catch(() => ({}));
    throw new Error(
      `${error.message}. Debug login: email=${email}, URL=${url}, session=${JSON.stringify(
        session
      )}, body=${String(text).slice(0, 500)}`
    );
  }

  if (result && result.ok === false) {
    throw new Error(
      `Login gagal setelah submit. URL=${result.url}. Body=${String(result.text || "").slice(0, 400)}`
    );
  }

  if (result?.reason === "session") {
    const currentUrl = await driver.getCurrentUrl();
    if (!urlMustInclude.some((part) => currentUrl.includes(part))) {
      await openPath(driver, urlMustInclude[0]);
    }
  }

  await waitForReactApp(driver);
}

export async function loginAsTestStudent(driver) {
  await loginWithCredentials(driver, TEST_STUDENT, {
    urlMustInclude: ["/dashboard/overview", "/dashboard"],
  });
}

export async function loginAsTestInstructor(driver) {
  await loginWithCredentials(driver, TEST_INSTRUCTOR, {
    urlMustInclude: ["/instructor/dashboard"],
  });
}
