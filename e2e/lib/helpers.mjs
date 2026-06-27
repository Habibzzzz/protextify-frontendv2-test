import { By, until } from "selenium-webdriver";
import { BASE_URL } from "./driver.mjs";

/** Buka path relatif (mis. /about) atau URL penuh */
export async function openPath(driver, path) {
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  await driver.get(url);
}

/** Tunggu React mount: #root punya anak */
export async function waitForReactApp(driver, timeout = 20000) {
  await driver.wait(until.elementLocated(By.css("#root")), timeout);
  await driver.wait(
    async () => {
      const ok = await driver.executeScript(
        `return !!(document.getElementById('root') && document.getElementById('root').children.length > 0)`
      );
      return Boolean(ok);
    },
    timeout,
    "React root tidak terisi"
  );
}

/**
 * Untuk rute yang langsung redirect (mis. OAuth callback): anggap sukses jika
 * sudah di /auth/login atau #root punya konten teks.
 */
export async function waitForReactOrLoginRedirect(driver, timeout = 25000) {
  await driver.wait(until.elementLocated(By.css("#root")), timeout);
  await driver.wait(
    async () => {
      const url = await driver.getCurrentUrl();
      if (url.includes("/auth/login")) return true;
      const len = await driver.executeScript(
        `const r = document.getElementById('root'); return r && r.innerText ? r.innerText.trim().length : 0`
      );
      return Number(len) > 20;
    },
    timeout,
    "Tidak redirect login dan root tanpa konten"
  );
}

export async function getBodyText(driver) {
  const body = await driver.findElement(By.css("body"));
  return body.getText();
}

/** Bersihkan sesi browser (supaya tes redirect login konsisten) */
export async function clearBrowserSession(driver) {
  await openPath(driver, "/");
  await driver.executeScript(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
  });
  await driver.manage().deleteAllCookies();
}

/** Halaman login utama (setelah redirect dari ProtectedRoute) */
export async function waitForMainLoginPage(driver, timeout = 25000) {
  await driver.wait(
    async () => {
      const u = await driver.getCurrentUrl();
      return u.includes("/auth/login");
    },
    timeout,
    "URL tidak mengarah ke /auth/login"
  );
  await driver.wait(
    until.elementLocated(By.css('input[name="email"]')),
    timeout,
    'Form login input[name="email"] tidak ditemukan'
  );
}

export async function assertBodyIncludes(driver, substring, label) {
  const text = await getBodyText(driver);
  if (!text.includes(substring)) {
    throw new Error(
      `${label}: teks "${substring}" tidak ditemukan di halaman`
    );
  }
}
