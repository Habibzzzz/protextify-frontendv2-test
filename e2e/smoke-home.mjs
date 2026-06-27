/**
 * Smoke test cepat — hanya halaman utama.
 * Suite penuh: npm run test:e2e
 */
import { By, until } from "selenium-webdriver";
import { createDriver, BASE_URL } from "./lib/driver.mjs";
import { getBodyText, openPath, waitForReactApp } from "./lib/helpers.mjs";

let driver;

try {
  driver = await createDriver();
  await openPath(driver, "/");
  await waitForReactApp(driver);
  await driver.wait(until.elementLocated(By.css("body")), 15000);

  const title = await driver.getTitle();
  await driver.wait(
    async () => {
      const text = await getBodyText(driver);
      return /Protextify|Masuk|Daftar|Dashboard/i.test(text) || text.trim().length > 40;
    },
    20000,
    "Konten halaman utama tidak terdeteksi"
  );

  console.log("[e2e] OK — halaman terbuka");
  console.log("[e2e]   URL:", BASE_URL);
  console.log("[e2e]   Judul:", title?.trim() || "(kosong, diabaikan)");
  console.log("[e2e] Smoke test lulus.");
} catch (err) {
  console.error("[e2e] Gagal:", err.message);
  process.exitCode = 1;
} finally {
  if (driver) {
    await driver.quit();
  }
}
