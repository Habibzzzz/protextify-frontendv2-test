/** True jika URL sudah di area aplikasi setelah login (bukan lagi halaman login). */
export function isPostLoginAppUrl(url) {
  if (typeof url !== "string") return false;
  const lower = url.toLowerCase();
  if (lower.includes("/auth/login")) return false;
  return lower.includes("/dashboard") || lower.includes("/instructor");
}

/**
 * Setelah klik submit login: tunggu URL berhenti di /auth/login (navigasi klien / jaringan lambat).
 * Penting untuk uji ke VPS; `waitForLoadState("load")` saja sering terlalu cepat untuk SPA.
 */
export async function waitUntilLeavesAuthLogin(page, options = {}) {
  const timeoutMs = options.timeoutMs ?? 45000;
  const pollMs = options.pollMs ?? 400;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const url = page.url();
    if (!url.toLowerCase().includes("/auth/login")) break;
    await page.waitForTimeout(pollMs);
  }

  try {
    await page.waitForLoadState("load");
  } catch (_) {
    /* navigasi klien tidak selalu memicu load event kedua */
  }
  await page.waitForTimeout(options.settleMs ?? 800);
  return page.url();
}
