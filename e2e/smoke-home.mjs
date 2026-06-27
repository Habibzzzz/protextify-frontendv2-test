/**
 * Smoke test cepat — hanya halaman utama.
 * Suite penuh: npm run test:e2e
 */
import { mkdir, writeFile } from "node:fs/promises";
import { By, until } from "selenium-webdriver";
import { createDriver } from "./lib/driver.mjs";
import { openPath, waitForReactApp } from "./lib/helpers.mjs";

let driver;
let passed = 0;

function ok(id, detail = "") {
  passed += 1;
  console.log(`[e2e] ✓ ${id}${detail ? ` — ${detail}` : ""}`);
}

try {
  driver = await createDriver();
  await openPath(driver, "/");
  await waitForReactApp(driver);
  await driver.wait(until.elementLocated(By.css("body")), 15000);
  ok("smoke-page-open", "halaman utama terbuka");

  const title = await driver.getTitle();
  let rootInfo = null;
  await driver.wait(
    async () => {
      rootInfo = await driver.executeScript(() => {
        const root = document.getElementById("root");
        const bodyText = (document.body?.innerText || "")
          .replace(/\s+/g, " ")
          .trim();
        const rootRect = root?.getBoundingClientRect();
        const visible = (element) => {
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number(style.opacity) !== 0
          );
        };
        const visibleHeadings = [...document.querySelectorAll("h1")]
          .filter(visible)
          .map((element) => element.innerText.replace(/\s+/g, " ").trim());
        const visibleActions = [
          ...document.querySelectorAll("a[href], button"),
        ].filter(visible);

        return {
          rootMounted: Boolean(root && root.children.length > 0),
          rootChildren: root?.children.length || 0,
          rootHeight: Math.round(rootRect?.height || 0),
          bodyHeight: Math.round(document.body?.scrollHeight || 0),
          bodyTextLength: bodyText.length,
          heading: visibleHeadings[0] || "",
          visibleActions: visibleActions.length,
          preview: bodyText.slice(0, 180),
        };
      });

      const hasHomeHero =
        /Platform Deteksi|Plagiarisme|Dunia Akademik Modern/i.test(
          rootInfo.heading
        ) &&
        /Protextify|Mulai Gratis Sekarang|Lihat Demo/i.test(rootInfo.preview);

      return (
        rootInfo.rootMounted &&
        Math.max(rootInfo.rootHeight, rootInfo.bodyHeight) >= 500 &&
        rootInfo.bodyTextLength >= 120 &&
        rootInfo.visibleActions >= 2 &&
        hasHomeHero
      );
    },
    20000,
    "Halaman utama belum benar-benar render"
  );
  const currentUrl = await driver.getCurrentUrl();
  const screenshotPath = "e2e/artifacts/smoke-home.png";
  await mkdir("e2e/artifacts", { recursive: true });
  await writeFile(screenshotPath, await driver.takeScreenshot(), "base64");
  ok("smoke-home-render", "hero home visible dan screenshot tersimpan");

  console.log("[e2e] OK — halaman terbuka");
  console.log("[e2e]   URL:", currentUrl);
  console.log("[e2e]   Judul:", title?.trim() || "(kosong, diabaikan)");
  console.log(
    "[e2e]   Render:",
    rootInfo.rootMounted
      ? `OK (#root ${rootInfo.rootChildren} node, tinggi ${Math.max(rootInfo.rootHeight, rootInfo.bodyHeight)}px, ${rootInfo.bodyTextLength} karakter teks, ${rootInfo.visibleActions} aksi visible)`
      : "GAGAL (#root kosong)"
  );
  console.log("[e2e]   Heading:", rootInfo.heading || "(heading tidak terlihat)");
  console.log("[e2e]   Preview:", rootInfo.preview || "(body kosong)");
  console.log("[e2e]   Screenshot:", screenshotPath);
  console.log(`\n[e2e] Smoke test lulus: ${passed} lulus, 0 gagal (total ${passed})`);
} catch (err) {
  console.error("[e2e] Gagal:", err.message);
  process.exitCode = 1;
} finally {
  if (driver) {
    await driver.quit();
  }
}
