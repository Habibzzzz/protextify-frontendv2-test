import { By, until } from "selenium-webdriver";
import { openPath, waitForReactApp } from "./helpers.mjs";

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
    15000
  );
  const passEl = await driver.findElement(By.css('input[name="password"]'));

  await emailEl.click();
  await emailEl.clear();
  await emailEl.sendKeys(email);
  await passEl.click();
  await passEl.clear();
  await passEl.sendKeys(password);

  const submit = await driver.findElement(By.css('form button[type="submit"]'));
  await submit.click();
  await driver.sleep(150);

  await driver.wait(
    async () => {
      const u = await driver.getCurrentUrl();
      return urlMustInclude.some((part) => u.includes(part));
    },
    timeout,
    `Setelah login, URL harus mengandung salah satu: ${urlMustInclude.join(", ")}`
  );

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
