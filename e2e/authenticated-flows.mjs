/**
 * E2E alur SETELAH login — jelajah rute student & instructor memakai data seed DB test.
 *
 * Wajib: target frontend test aktif dan terhubung ke backend test.
 * Jalankan: npm run test:e2e:auth
 *
 * Login saja: npm run test:e2e:auth-login
 * Suite umum: npm run test:e2e
 *
 * ID seed selaras dengan prisma/seed.ts pada backend test.
 *
 * Opsional: HEADLESS=1 BASE_URL=... kredensial E2E_* .
 */
import { By, Key, until } from "selenium-webdriver";
import { createDriver, BASE_URL } from "./lib/driver.mjs";
import {
  openPath,
  waitForReactApp,
  getBodyText,
  clearBrowserSession,
  assertBodyIncludes,
} from "./lib/helpers.mjs";
import {
  loginAsTestStudent,
  loginAsTestInstructor,
} from "./lib/auth.mjs";

/** Harus sama dengan seed database test. */
const SEED = {
  classId: process.env.E2E_CLASS_ID || "class-1",
  assignmentId: process.env.E2E_ASSIGNMENT_ID || "assignment-1",
  submissionId: process.env.E2E_SUBMISSION_ID || "submission-1",
  transactionId: process.env.E2E_TRANSACTION_ID || "transaction-1",
};

let passed = 0;
let failed = 0;

function ok(id, detail = "") {
  passed += 1;
  console.log(`[e2e:auth] ✓ ${id}${detail ? ` — ${detail}` : ""}`);
}

function fail(id, err) {
  failed += 1;
  console.error(`[e2e:auth] ✗ ${id}:`, err?.message || err);
}

async function assertPage(driver, path, substring, label) {
  await openPath(driver, path);
  await waitForReactApp(driver);
  await assertBodyIncludes(driver, substring, label);
}

async function assertPageRegex(driver, path, pattern, label) {
  await openPath(driver, path);
  await waitForReactApp(driver);
  const t = await getBodyText(driver);
  if (!pattern.test(t)) {
    throw new Error(`${label}: tidak cocok /${pattern.source}/`);
  }
}

async function runStep(id, detail, fn) {
  try {
    await fn();
    ok(id, detail);
  } catch (e) {
    fail(id, e);
  }
}

async function runStudentFlows(driver) {
  await clearBrowserSession(driver);
  await loginAsTestStudent(driver);
  ok("login-student", "masuk dashboard");

  const { classId, assignmentId, submissionId } = SEED;

  await runStep("student-overview", "/dashboard/overview", () =>
    assertPage(driver, "/dashboard/overview", "Dashboard Student", "student-overview")
  );

  await runStep("student-dashboard-index", "/dashboard", () =>
    assertPage(driver, "/dashboard", "Dashboard Student", "student-dashboard-index")
  );

  await runStep("student-classes", "/dashboard/classes", () =>
    assertPage(driver, "/dashboard/classes", "Kelas Saya", "student-classes")
  );

  await runStep("student-assignments", "/dashboard/assignments", () =>
    assertPage(driver, "/dashboard/assignments", "Tugas Saya", "student-assignments")
  );

  await runStep("student-join-class", "/dashboard/join-class", () =>
    assertPage(driver, "/dashboard/join-class", "Gabung Kelas", "student-join-class")
  );

  await runStep("student-class-detail", `/dashboard/classes/${classId}`, () =>
    assertPage(
      driver,
      `/dashboard/classes/${classId}`,
      "Detail Kelas",
      "student-class-detail"
    )
  );

  await runStep(
    "student-class-assignments",
    `/dashboard/classes/${classId}/assignments`,
    () =>
      assertPage(
        driver,
        `/dashboard/classes/${classId}/assignments`,
        "Daftar Tugas Kelas",
        "student-class-assignments"
      )
  );

  await runStep("student-assignment-detail", `/dashboard/assignments/${assignmentId}`, () =>
    assertPage(
      driver,
      `/dashboard/assignments/${assignmentId}`,
      "Detail Tugas",
      "student-assignment-detail"
    )
  );

  await runStep("student-write-assignment", `/dashboard/assignments/${assignmentId}/write`, async () => {
    await openPath(driver, `/dashboard/assignments/${assignmentId}/write`);
    await waitForReactApp(driver);
    const t = await getBodyText(driver);
    if (
      !/tugas|menulis|draft|editor|memuat|integritas/i.test(t) &&
      !t.includes("Protextify")
    ) {
      throw new Error("Halaman tulis tugas tidak terlihat konten yang diharapkan");
    }
  });

  await runStep("student-submissions", "/dashboard/submissions", () =>
    assertPage(driver, "/dashboard/submissions", "Riwayat", "student-submissions")
  );

  await runStep("student-submission-detail", `/dashboard/submissions/${submissionId}`, () =>
    assertPage(
      driver,
      `/dashboard/submissions/${submissionId}`,
      "Detail Submission",
      "student-submission-detail"
    )
  );

  await runStep(
    "student-plagiarism-report",
    `/dashboard/submissions/${submissionId}/plagiarism-report`,
    () =>
      assertPage(
        driver,
        `/dashboard/submissions/${submissionId}/plagiarism-report`,
        "Laporan Plagiarisme",
        "student-plagiarism-report"
      )
  );

  await runStep("student-profile", "/dashboard/profile", () =>
    assertPage(
      driver,
      "/dashboard/profile",
      "Profil Akun Student",
      "student-profile"
    )
  );

  await runStep("student-profile-standalone", "/profile", () =>
    assertPage(driver, "/profile", "Profil Akun Student", "student-profile-standalone")
  );

  await runStep("student-storage-health", "/dashboard/storage-health", () =>
    assertPage(
      driver,
      "/dashboard/storage-health",
      "Status Storage Akun",
      "student-storage-health"
    )
  );

  await runStep("student-forbidden-instructor-route", "/instructor/dashboard", () =>
    assertPage(driver, "/instructor/dashboard", "Akses Ditolak", "student-forbidden-instructor-route")
  );

  await runStep("student-write-paste-monitor", `/dashboard/assignments/${assignmentId}/write`, async () => {
    await openPath(driver, `/dashboard/assignments/${assignmentId}/write`);
    await waitForReactApp(driver);
    await driver.wait(
      until.elementLocated(By.css(".editor-input")),
      25000,
      "Editor Lexical tidak ditemukan"
    );
    await assertBodyIncludes(driver, "Total Paste", "student-write-paste-monitor");
    const editor = await driver.findElement(By.css(".editor-input"));
    const e2eHookTriggered = await driver.wait(
      async () =>
        driver.executeScript(() => {
          const trigger = window.__PROTEXTIFY_E2E_TRIGGER_PASTE__;
          if (typeof trigger !== "function") return false;
          trigger("kata ".repeat(140));
          return true;
        }),
      8000,
      "Hook E2E paste monitor tidak tersedia"
    );
    const clipboardPaste = e2eHookTriggered
      ? false
      : await driver.executeAsyncScript((done) => {
      const text = "kata ".repeat(140);
      navigator.clipboard
        ?.writeText(text)
        .then(() => done(true))
        .catch(() => done(false));
      });
    if (!e2eHookTriggered && clipboardPaste) {
      await driver.executeScript((element) => {
        element.scrollIntoView({ block: "center", inline: "nearest" });
        element.focus();
      }, editor);
      await editor.sendKeys(Key.chord(Key.CONTROL, "v"));
    } else if (!e2eHookTriggered) {
      await driver.executeScript(() => {
      const text = "kata ".repeat(140);
      const clipboardData = {
        getData: (type) => (type === "text/plain" ? text : ""),
      };
      const targets = [
        document.querySelector(".editor-input"),
        document.querySelector('[contenteditable="true"]'),
      ].filter(Boolean);

      for (const target of targets) {
        let event;
        try {
          const data = new DataTransfer();
          data.setData("text/plain", text);
          event = new ClipboardEvent("paste", {
            bubbles: true,
            cancelable: true,
            clipboardData: data,
          });
        } catch {
          event = new Event("paste", { bubbles: true, cancelable: true });
        }
        Object.defineProperty(event, "clipboardData", {
          configurable: true,
          value: clipboardData,
        });
        target.dispatchEvent(event);
      }
      });
    }
    await driver.wait(
      async () => {
        const text = await getBodyText(driver);
        return /[1-9]\d*\s+Total Paste|Terdeteksi paste teks/i.test(text);
      },
      15000,
      "Monitor paste tidak mencatat aktivitas paste"
    );
  });

}

async function runInstructorFlows(driver) {
  await clearBrowserSession(driver);
  await loginAsTestInstructor(driver);
  ok("login-instructor", "masuk dashboard instruktur");

  const { classId, assignmentId, submissionId, transactionId } = SEED;

  await runStep("instructor-dashboard", "/instructor/dashboard", () =>
    assertPage(
      driver,
      "/instructor/dashboard",
      "Dashboard Instructor",
      "instructor-dashboard"
    )
  );

  await runStep("instructor-classes", "/instructor/classes", () =>
    assertPage(driver, "/instructor/classes", "Kelas", "instructor-classes")
  );

  await runStep("instructor-create-class", "/instructor/create-class", () =>
    assertPage(driver, "/instructor/create-class", "Buat", "instructor-create-class")
  );

  await runStep("instructor-class-detail", `/instructor/classes/${classId}`, () =>
    assertPageRegex(
      driver,
      `/instructor/classes/${classId}`,
      /Token Kelas|Buat Tugas|Pemrograman Web/i,
      "instructor-class-detail"
    )
  );

  await runStep("instructor-class-history", `/instructor/classes/${classId}/history`, () =>
    assertPage(
      driver,
      `/instructor/classes/${classId}/history`,
      "Riwayat Submission Kelas",
      "instructor-class-history"
    )
  );

  await runStep("instructor-class-settings", `/instructor/classes/${classId}/settings`, () =>
    assertPage(
      driver,
      `/instructor/classes/${classId}/settings`,
      "Pengaturan Kelas",
      "instructor-class-settings"
    )
  );

  await runStep(
    "instructor-create-assignment",
    `/instructor/classes/${classId}/create-assignment`,
    () =>
      assertPage(
        driver,
        `/instructor/classes/${classId}/create-assignment`,
        "Buat Tugas Baru",
        "instructor-create-assignment"
      )
  );

  await runStep(
    "instructor-assignment-detail",
    `/instructor/assignments/${assignmentId}`,
    () =>
      assertPageRegex(
        driver,
        `/instructor/assignments/${assignmentId}`,
        /Essay Integritas|Deadline|siswa submit/i,
        "instructor-assignment-detail"
      )
  );

  await runStep(
    "instructor-assignment-monitor",
    `/instructor/assignments/${assignmentId}/monitor`,
    () =>
      assertPage(
        driver,
        `/instructor/assignments/${assignmentId}/monitor`,
        "Monitor Submission",
        "instructor-assignment-monitor"
      )
  );

  await runStep(
    "instructor-assignment-submissions",
    `/instructor/assignments/${assignmentId}/submissions`,
    () =>
      assertPage(
        driver,
        `/instructor/assignments/${assignmentId}/submissions`,
        "Monitor Submission",
        "instructor-assignment-submissions"
      )
  );

  await runStep(
    "instructor-assignment-bulk-grade",
    `/instructor/assignments/${assignmentId}/bulk-grade`,
    () =>
      assertPage(
        driver,
        `/instructor/assignments/${assignmentId}/bulk-grade`,
        "Nilai Massal",
        "instructor-assignment-bulk-grade"
      )
  );

  await runStep(
    "instructor-assignment-analytics",
    `/instructor/assignments/${assignmentId}/analytics`,
    () =>
      assertPageRegex(
        driver,
        `/instructor/assignments/${assignmentId}/analytics`,
        /Ringkasan performa|Total Submission|Analytics Tugas/i,
        "instructor-assignment-analytics"
      )
  );

  await runStep(
    "instructor-submission-plagiarism",
    `/instructor/submissions/${submissionId}/plagiarism`,
    () =>
      assertPage(
        driver,
        `/instructor/submissions/${submissionId}/plagiarism`,
        "Analisis Plagiarisme",
        "instructor-submission-plagiarism"
      )
  );

  await runStep(
    "instructor-submission-grade",
    `/instructor/submissions/${submissionId}/grade`,
    () =>
      assertPage(
        driver,
        `/instructor/submissions/${submissionId}/grade`,
        "Beri Nilai Tugas",
        "instructor-submission-grade"
      )
  );

  await runStep("instructor-analytics", "/instructor/analytics", () =>
    assertPage(driver, "/instructor/analytics", "Analytics", "instructor-analytics")
  );

  await runStep("instructor-transactions", "/instructor/transactions", () =>
    assertPage(driver, "/instructor/transactions", "Transaksi", "instructor-transactions")
  );

  await runStep(
    "instructor-transaction-detail",
    `/instructor/transactions/${transactionId}`,
    () =>
      assertPage(
        driver,
        `/instructor/transactions/${transactionId}`,
        "Detail Transaksi",
        "instructor-transaction-detail"
      )
  );

  await runStep("instructor-settings", "/instructor/settings", () =>
    assertPage(
      driver,
      "/instructor/settings",
      "Pengaturan Akun",
      "instructor-settings"
    )
  );

  await runStep("instructor-class-search", "/instructor/classes", async () => {
    await openPath(driver, "/instructor/classes");
    await waitForReactApp(driver);
    const search = await driver.wait(
      until.elementLocated(By.css('input[placeholder*="Cari nama kelas"]')),
      20000,
      "Input pencarian kelas tidak ditemukan"
    );
    await search.clear();
    await search.sendKeys("__kelas_tidak_ada_e2e__");
    await assertBodyIncludes(driver, "Tidak Ada Kelas yang Ditemukan", "instructor-class-search");
  });

  await runStep("instructor-class-sorting", "/instructor/classes", async () => {
    await openPath(driver, "/instructor/classes");
    await waitForReactApp(driver);
    const sortButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'A-Z') or contains(., 'Z-A')]")),
      20000,
      "Tombol sorting kelas tidak ditemukan"
    );
    await sortButton.click();
    await driver.wait(
      async () => (await getBodyText(driver)).includes("Z-A"),
      15000,
      "Tombol sorting tidak berubah ke Z-A"
    );
  });

  await runStep("instructor-class-edit-form", `/instructor/classes/${classId}/settings`, async () => {
    await openPath(driver, `/instructor/classes/${classId}/settings`);
    await waitForReactApp(driver);
    const nameInput = await driver.wait(
      until.elementLocated(By.css('input[name="name"]')),
      20000,
      "Input nama kelas tidak ditemukan"
    );
    await nameInput.clear();
    await nameInput.sendKeys("Pemrograman Web Dummy E2E");
    const saveButton = await driver.findElement(By.xpath("//button[contains(., 'Simpan Perubahan')]"));
    await driver.wait(async () => saveButton.isEnabled(), 15000, "Tombol simpan perubahan tidak aktif");
  });

  await runStep("instructor-class-delete-modal", `/instructor/classes/${classId}/settings`, async () => {
    await openPath(driver, `/instructor/classes/${classId}/settings`);
    await waitForReactApp(driver);
    const deleteButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Hapus Kelas Ini')]")),
      20000,
      "Tombol hapus kelas tidak ditemukan"
    );
    await deleteButton.click();
    await assertBodyIncludes(driver, "Konfirmasi Hapus Kelas", "instructor-class-delete-modal");
    const cancelButton = await driver.findElement(By.xpath("//button[contains(., 'Batal')]"));
    await cancelButton.click();
  });

  await runStep("instructor-logout", "/instructor/dashboard", async () => {
    await openPath(driver, "/instructor/dashboard");
    await waitForReactApp(driver);
    const profileButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Instruktur Dummy')]")),
      20000,
      "Tombol menu profil tidak ditemukan"
    );
    await profileButton.click();
    const logoutButton = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(., 'Logout')]")),
      15000,
      "Tombol logout tidak ditemukan"
    );
    await logoutButton.click();
    await driver.wait(
      async () => {
        const url = await driver.getCurrentUrl();
        const token = await driver.executeScript(() => localStorage.getItem("token"));
        return !url.includes("/instructor") && !token;
      },
      15000,
      "Logout tidak menghapus sesi dan kembali ke beranda"
    );
  });
}

async function main() {
  // console.log("[e2e:auth] Base URL:", BASE_URL);
  // console.log(
  //   "[e2e:auth] Wajib: target frontend test aktif dan kredensial DB seed tersedia\n"
  // );

  const driver = await createDriver();

  try {
    // console.log("[e2e:auth] — Mahasiswa —");
    await runStudentFlows(driver);

    // console.log("\n[e2e:auth] — Instruktur —");
    await runInstructorFlows(driver);
  } finally {
    await driver.quit();
  }

  console.log(
    `\n[e2e:auth] Selesai: ${passed} lulus, ${failed} gagal (total ${passed + failed})`
  );
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("[e2e:auth] Fatal:", e);
  process.exitCode = 1;
});
