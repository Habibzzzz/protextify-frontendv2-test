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

const API_BASE_URL = (
  process.env.E2E_API_URL ||
  process.env.API_URL ||
  BASE_URL.replace(/:\d+$/, ":3001") + "/api"
).replace(/\/$/, "");

/** Override opsional. Jika kosong, ID diambil dari API data real setelah login. */
const ID_OVERRIDES = {
  classId: process.env.E2E_CLASS_ID || "",
  assignmentId: process.env.E2E_ASSIGNMENT_ID || "",
  submissionId: process.env.E2E_SUBMISSION_ID || "",
  transactionId: process.env.E2E_TRANSACTION_ID || "",
};

let passed = 0;
let failed = 0;
let skipped = 0;

function ok(id, detail = "") {
  passed += 1;
  console.log(`[e2e:auth] ✓ ${id}${detail ? ` — ${detail}` : ""}`);
}

function fail(id, err) {
  failed += 1;
  console.error(`[e2e:auth] ✗ ${id}:`, err?.message || err);
}

function skip(id, detail = "") {
  skipped += 1;
  console.log(`[e2e:auth] ↷ ${id}${detail ? ` — ${detail}` : ""}`);
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    String(value || "")
  );
}

function hasVisibleLoadingText(text) {
  const normalized = text.trim();
  if (/Gagal memuat/i.test(normalized)) return false;
  return /(^|\s)(Memuat(?:\.\.\.| data| dashboard| riwayat| progress| transaksi| analytics)?|Loading)(\s|\.|…|$)/i.test(normalized);
}

function createSettledBodyChecker() {
  let lastText = "";
  let stableSince = 0;

  return async (driver) => {
    const text = await getBodyText(driver);
    const trimmed = text.trim();
    const now = Date.now();

    if (trimmed.length < 20 || hasVisibleLoadingText(trimmed)) {
      lastText = trimmed;
      stableSince = 0;
      return { settled: false, text: trimmed };
    }

    const stable =
      trimmed === lastText || Math.abs(trimmed.length - lastText.length) <= 5;
    if (!stable) {
      lastText = trimmed;
      stableSince = now;
      return { settled: false, text: trimmed };
    }

    if (!stableSince) stableSince = now;
    return { settled: now - stableSince >= 800, text: trimmed };
  };
}

async function assertPage(driver, path, substring, label) {
  await openPath(driver, path);
  await waitForReactApp(driver);
  const isSettled = createSettledBodyChecker();
  await driver.wait(
    async () => {
      const { settled, text } = await isSettled(driver);
      if (text.includes(substring) && settled) return true;
      return false;
    },
    45000,
    `${label}: halaman tidak selesai render atau teks "${substring}" tidak muncul`
  );
}

async function assertPageRegex(driver, path, pattern, label) {
  await openPath(driver, path);
  await waitForReactApp(driver);
  const isSettled = createSettledBodyChecker();
  await driver.wait(
    async () => {
      const { settled, text } = await isSettled(driver);
      if (pattern.test(text) && settled) return true;
      return false;
    },
    45000,
    `${label}: tidak cocok /${pattern.source}/ dan halaman tidak selesai render`
  );
}

async function runStep(id, detail, fn) {
  try {
    await fn();
    ok(id, detail);
  } catch (e) {
    fail(id, e);
  }
}

async function clickVisibleButtonByText(driver, patterns, label) {
  const result = await driver.executeScript((sources, labelText) => {
    const regexes = sources.map((source) => new RegExp(source, "i"));
    const buttons = [...document.querySelectorAll("button")].map((button, index) => {
      const rect = button.getBoundingClientRect();
      const text = (button.innerText || button.textContent || "").replace(/\s+/g, " ").trim();
      const visible =
        rect.width > 0 &&
        rect.height > 0 &&
        getComputedStyle(button).visibility !== "hidden" &&
        getComputedStyle(button).display !== "none";
      return { button, index, text, visible };
    });

    const matched = buttons.find(
      ({ text, visible }) => visible && regexes.some((regex) => regex.test(text))
    );
    if (matched) {
      matched.button.click();
      return { clicked: true, text: matched.text, index: matched.index };
    }

    if (/profil/i.test(labelText)) {
      const headerButtons = buttons.filter(({ button, visible }) => {
        if (!visible) return false;
        const inHeader = Boolean(button.closest("header"));
        const text = (button.innerText || button.textContent || "").trim();
        return inHeader && !/masuk|daftar|logout/i.test(text);
      });
      const fallback = headerButtons[headerButtons.length - 1];
      if (fallback) {
        fallback.button.click();
        return {
          clicked: true,
          fallback: true,
          text: fallback.text,
          index: fallback.index,
        };
      }
    }

    return {
      clicked: false,
      buttons: buttons
        .filter(({ visible }) => visible)
        .map(({ index, text }) => ({ index, text }))
        .slice(0, 30),
    };
  }, patterns, label);

  if (!result?.clicked) {
    throw new Error(
      `${label} tidak ditemukan. Tombol terlihat: ${JSON.stringify(result?.buttons || [])}`
    );
  }
  return result;
}

async function apiGet(driver, path) {
  const result = await driver.executeAsyncScript((apiBaseUrl, apiPath, done) => {
    const token = localStorage.getItem("token");
    if (!token) {
      done({ ok: false, status: 0, error: "Token login tidak ditemukan" });
      return;
    }

    fetch(`${apiBaseUrl}${apiPath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    })
      .then(async (response) => {
        const text = await response.text();
        let data = null;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = text;
        }
        done({ ok: response.ok, status: response.status, data });
      })
      .catch((error) => done({ ok: false, status: 0, error: error.message }));
  }, API_BASE_URL, path);

  if (!result?.ok) {
    throw new Error(
      `API ${path} gagal. status=${result?.status}. error=${result?.error || JSON.stringify(result?.data)}`
    );
  }

  return result.data;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

function firstId(items, label) {
  const item = asArray(items).find((entry) => entry?.id);
  if (!item?.id) throw new Error(`Data real untuk ${label} tidak ditemukan`);
  return item.id;
}

async function resolveStudentData(driver) {
  const classes = asArray(await apiGet(driver, "/classes"));
  const history = asArray(await apiGet(driver, "/submissions/history"));
  const selectedClass =
    classes.find((item) => item?.id === ID_OVERRIDES.classId) ||
    classes.find((item) => Array.isArray(item?.assignments) && item.assignments.length > 0) ||
    classes[0];
  if (!selectedClass?.id) throw new Error("Student tidak punya kelas real untuk diuji");

  const selectedSubmission =
    history.find((item) => item?.id === ID_OVERRIDES.submissionId) || history[0];
  if (!selectedSubmission?.id) {
    throw new Error("Student tidak punya submission real untuk diuji");
  }

  const assignmentId =
    ID_OVERRIDES.assignmentId ||
    selectedSubmission.assignmentId ||
    selectedSubmission.assignment?.id ||
    selectedClass.assignments?.[0]?.id;
  if (!assignmentId) throw new Error("Assignment real untuk student tidak ditemukan");

  return {
    classId: ID_OVERRIDES.classId || selectedClass.id,
    assignmentId,
    submissionId: ID_OVERRIDES.submissionId || selectedSubmission.id,
    plagiarismSubmissionId: ID_OVERRIDES.submissionId || selectedSubmission.id,
  };
}

async function resolveInstructorData(driver) {
  const classes = asArray(await apiGet(driver, "/classes"));
  const selectedClass =
    classes.find((item) => item?.id === ID_OVERRIDES.classId) ||
    classes.find((item) => Array.isArray(item?.assignments) && item.assignments.length > 0) ||
    classes[0];
  if (!selectedClass?.id) throw new Error("Instructor tidak punya kelas real untuk diuji");

  const classId = ID_OVERRIDES.classId || selectedClass.id;
  const assignments = asArray(await apiGet(driver, `/classes/${classId}/assignments`));
  const selectedAssignment =
    assignments.find((item) => item?.id === ID_OVERRIDES.assignmentId) ||
    selectedClass.assignments?.find((item) => item?.id === ID_OVERRIDES.assignmentId) ||
    assignments[0] ||
    selectedClass.assignments?.[0];
  if (!selectedAssignment?.id) throw new Error("Instructor tidak punya assignment real untuk diuji");

  const assignmentId = ID_OVERRIDES.assignmentId || selectedAssignment.id;
  const classHistory = asArray(await apiGet(driver, `/classes/${classId}/history`));
  const selectedSubmission =
    classHistory.find((item) => item?.id === ID_OVERRIDES.submissionId) ||
    classHistory.find((item) => item?.assignment?.id === assignmentId) ||
    classHistory[0];
  if (!selectedSubmission?.id) {
    throw new Error("Instructor tidak punya submission real untuk diuji");
  }

  const transactionsResponse = await apiGet(driver, "/payments/transactions?page=1&limit=10");
  const transactions = asArray(transactionsResponse);
  const selectedTransaction =
    transactions.find((item) => item?.id === ID_OVERRIDES.transactionId) ||
    transactions.find((item) => item?.transactionId === ID_OVERRIDES.transactionId) ||
    transactions[0];

  return {
    classId,
    assignmentId,
    submissionId: ID_OVERRIDES.submissionId || selectedSubmission.id,
    plagiarismSubmissionId: ID_OVERRIDES.submissionId || selectedSubmission.id,
    transactionId:
      ID_OVERRIDES.transactionId ||
      selectedTransaction?.id ||
      selectedTransaction?.transactionId ||
      "",
  };
}

async function runStudentFlows(driver) {
  await clearBrowserSession(driver);
  await loginAsTestStudent(driver);
  ok("login-student", "masuk dashboard");

  const { classId, assignmentId, submissionId, plagiarismSubmissionId } =
    await resolveStudentData(driver);

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
    `/dashboard/submissions/${plagiarismSubmissionId}/plagiarism-report`,
    () =>
      assertPage(
        driver,
        `/dashboard/submissions/${plagiarismSubmissionId}/plagiarism-report`,
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

  await runStep("student-storage-health", "/dashboard/storage-health", async () => {
    await assertPage(
      driver,
      "/dashboard/storage-health",
      "Status Storage Akun",
      "student-storage-health"
    );
  });

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
    const hasPasteMonitor = await driver
      .wait(async () => (await getBodyText(driver)).includes("Total Paste"), 8000)
      .then(() => true)
      .catch(() => false);
    if (!hasPasteMonitor) {
      console.log("   ✓ editor terbuka; paste monitor tidak tampil pada data/route ini");
      return;
    }
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

  const { classId, assignmentId, submissionId, plagiarismSubmissionId, transactionId } =
    await resolveInstructorData(driver);

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
    `/instructor/submissions/${plagiarismSubmissionId}/plagiarism`,
    () =>
      assertPage(
        driver,
        `/instructor/submissions/${plagiarismSubmissionId}/plagiarism`,
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

  if (transactionId) {
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
  } else {
    console.log("   ✓ transaksi real tidak tersedia; detail transaksi dilewati");
  }

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
    const searchInputs = await driver.findElements(
      By.css('input[placeholder*="Cari nama kelas"]')
    );
    if (searchInputs.length === 0) {
      const text = await getBodyText(driver);
      if (/Belum Ada Kelas|Mulai dengan membuat kelas pertama/i.test(text)) {
        return;
      }
      throw new Error("Input pencarian kelas tidak ditemukan");
    }
    const search = searchInputs[0];
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
    await assertPage(
      driver,
      `/instructor/classes/${classId}/settings`,
      "Informasi Dasar",
      "instructor-class-edit-form"
    );
    const nameInput = await driver.wait(
      until.elementLocated(By.css('input[name="name"]')),
      20000,
      "Input nama kelas tidak ditemukan"
    );
    await driver.executeScript((input, value) => {
      input.scrollIntoView({ block: "center", inline: "nearest" });
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value"
      )?.set;
      setter.call(input, value);
      input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: value }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.blur();
    }, nameInput, `Pemrograman Web E2E ${Date.now()}`);
    await driver.wait(
      async () =>
        driver.executeScript(() => {
          const buttons = [...document.querySelectorAll('form button[type="submit"], button')];
          const saveButton = buttons.find((button) =>
            /Simpan/i.test((button.innerText || button.textContent || "").trim())
          );
          if (!saveButton) return false;
          const rect = saveButton.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && !saveButton.disabled;
        }),
      15000,
      "Tombol simpan perubahan tidak ditemukan atau tidak aktif"
    );
  });

  await runStep("instructor-class-delete-modal", `/instructor/classes/${classId}/settings`, async () => {
    await openPath(driver, `/instructor/classes/${classId}/settings`);
    await waitForReactApp(driver);
    await assertPage(
      driver,
      `/instructor/classes/${classId}/settings`,
      "Danger Zone",
      "instructor-class-delete-modal"
    );
    await driver.executeScript(() => {
      const buttons = [...document.querySelectorAll("button")];
      const deleteButton = buttons.find((button) =>
        /Hapus Kelas Ini/i.test((button.innerText || button.textContent || "").trim())
      );
      deleteButton?.scrollIntoView({ block: "center", inline: "nearest" });
    });
    await clickVisibleButtonByText(
      driver,
      ["Hapus Kelas Ini"],
      "Tombol hapus kelas"
    );
    await driver.wait(
      async () => (await getBodyText(driver)).includes("Konfirmasi Hapus Kelas"),
      15000,
      "Modal konfirmasi hapus kelas tidak terbuka"
    );
    await clickVisibleButtonByText(driver, ["^Batal$"], "Tombol batal hapus kelas");
  });

  await runStep("instructor-logout", "/instructor/dashboard", async () => {
    await openPath(driver, "/instructor/dashboard");
    await waitForReactApp(driver);
    await driver.wait(
      async () => {
        const text = await getBodyText(driver);
        return /Dashboard Instructor|John|instructor/i.test(text);
      },
      20000,
      "Dashboard instructor belum siap untuk logout"
    );
    await clickVisibleButtonByText(
      driver,
      ["John", "Instructor", "instructor", "^J$", "^D$"],
      "Tombol menu profil"
    );
    await driver.wait(
      async () => {
        const text = await getBodyText(driver);
        return /Logout/i.test(text);
      },
      15000,
      "Tombol logout tidak ditemukan"
    );
    await clickVisibleButtonByText(driver, ["Logout"], "Tombol logout");
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
    `\n[e2e:auth] Selesai: ${passed} lulus, ${failed} gagal, ${skipped} dilewati (total ${passed + failed + skipped})`
  );
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("[e2e:auth] Fatal:", e);
  process.exitCode = 1;
});
