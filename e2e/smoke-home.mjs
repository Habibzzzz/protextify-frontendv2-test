/**
 * Smoke test cepat — hanya halaman utama.
 * Suite penuh: npm run test:e2e
 */
import { By, until } from "selenium-webdriver";
import { createDriver, BASE_URL } from "./lib/driver.mjs";
import { openPath, waitForReactApp } from "./lib/helpers.mjs";

let driver;

try {
  driver = await createDriver();
  await openPath(driver, "/");
  await waitForReactApp(driver);
  await driver.wait(until.elementLocated(By.css("body")), 15000);

  const title = await driver.getTitle();
  if (!title || !title.trim()) {
    throw new Error("Judul halaman kosong");
  }

  console.log("[e2e] OK — halaman terbuka");
  
  console.log("[e2e]   Judul:", title.trim());
  console.log("[e2e] Smoke test lulus.");
} catch (err) {
  console.error("[e2e] Gagal:", err.message);
  process.exitCode = 1;
} finally {
  if (driver) {
    await driver.quit();
  }
}
