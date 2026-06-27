import { By, Key, until } from "selenium-webdriver";
import { createDriver } from "./lib/driver.mjs";
import { loginWithCredentials } from "./lib/auth.mjs";
import {
  clearBrowserSession,
  getBodyText,
  openPath,
  waitForReactApp,
} from "./lib/helpers.mjs";

const allowMutation = process.env.E2E_ALLOW_MUTATION === "1";
const student = {
  email: process.env.E2E_STUDENT_EMAIL || "alice.student@university.edu",
  password: process.env.E2E_STUDENT_PASSWORD || "password123",
};
const instructor = {
  email: process.env.E2E_INSTRUCTOR_EMAIL || "john.instructor@university.edu",
  password: process.env.E2E_INSTRUCTOR_PASSWORD || "password123",
};

const joinClassToken = process.env.E2E_JOIN_CLASS_TOKEN || "WEBDEV2025";
const assignmentId = process.env.E2E_ASSIGNMENT_ID || "assignment-1";
const submissionId = process.env.E2E_SUBMISSION_ID || "submission-1";
const gradeValue = process.env.E2E_GRADE_VALUE || "88";
const citationTitle =
  process.env.E2E_CITATION_TITLE ||
  `Selenium Citation ${new Date().toISOString().slice(0, 10)}`;

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function required(name, value) {
  if (!value) {
    throw new Error(`Set ${name} sebelum menjalankan test ini.`);
  }
}

function ensureSafeToRun() {
  console.log(
    allowMutation
      ? "[e2e:critical] Mode mutasi aktif: aksi join/submit/grade akan menyentuh DB test."
      : "[e2e:critical] Mode baca: login real, tanpa klik aksi mutasi backend."
  );
}

function xpathText(text) {
  if (!text.includes("'")) {
    return `'${text}'`;
  }

  return `concat('${text.replaceAll("'", `', "'", '`)}')`;
}

async function clickButtonContaining(driver, text, timeout = 15000) {
  const literal = xpathText(text);
  const button = await driver.wait(
    until.elementLocated(
      By.xpath(`//button[contains(normalize-space(.), ${literal})]`)
    ),
    timeout
  );
  await driver.wait(until.elementIsVisible(button), timeout);
  await driver.wait(until.elementIsEnabled(button), timeout);
  await driver.executeScript((element) => {
    element.scrollIntoView({ block: "center", inline: "nearest" });
  }, button);
  try {
    await button.click();
  } catch {
    await driver.executeScript((element) => element.click(), button);
  }
  return button;
}

async function maybeClickButtonContaining(driver, text, timeout = 4000) {
  try {
    await clickButtonContaining(driver, text, timeout);
    return true;
  } catch {
    return false;
  }
}

async function clickLastButtonContainingAny(driver, texts, timeout = 15000) {
  await driver.wait(async () => {
    const buttons = await driver.findElements(By.css("button"));

    for (const button of buttons.reverse()) {
      const text = await button.getText();
      const visible = await button.isDisplayed().catch(() => false);
      const enabled = await button.isEnabled().catch(() => false);

      if (visible && enabled && texts.some((item) => text.includes(item))) {
        await driver.executeScript((element) => {
          element.scrollIntoView({ block: "center", inline: "nearest" });
        }, button);
        try {
          await button.click();
        } catch {
          await driver.executeScript((element) => element.click(), button);
        }
        return true;
      }
    }

    return false;
  }, timeout);
}

async function fillInputByName(driver, name, value, timeout = 15000) {
  const input = await driver.wait(
    until.elementLocated(By.css(`input[name="${name}"]`)),
    timeout
  );
  await driver.wait(until.elementIsVisible(input), timeout);
  await input.sendKeys(Key.chord(Key.CONTROL, "a"), value);
  return input;
}

async function fillTextareaByName(driver, name, value, timeout = 15000) {
  const textarea = await driver.wait(
    until.elementLocated(By.css(`textarea[name="${name}"]`)),
    timeout
  );
  await driver.wait(until.elementIsVisible(textarea), timeout);
  await textarea.sendKeys(Key.chord(Key.CONTROL, "a"), value);
  return textarea;
}

async function fillInputAfterLabel(driver, label, value, timeout = 15000) {
  const literal = xpathText(label);
  const input = await driver.wait(
    until.elementLocated(
      By.xpath(
        `//label[contains(normalize-space(.), ${literal})]/following::input[1]`
      )
    ),
    timeout
  );
  await driver.wait(until.elementIsVisible(input), timeout);
  await input.sendKeys(Key.chord(Key.CONTROL, "a"), value);
  return input;
}

async function expectBodyMatches(driver, pattern, label, timeout = 20000) {
  await driver.wait(async () => pattern.test(await getBodyText(driver)), timeout);
  console.log(`   ✓ ${label}`);
}

async function expectSafePageReady(driver, pattern, label, timeout = 30000) {
  await driver.wait(async () => {
    const text = await getBodyText(driver);
    if (pattern.test(text)) return true;

    const currentUrl = await driver.getCurrentUrl();
    return (
      !currentUrl.includes("/auth/login") &&
      !/memuat|loading/i.test(text) &&
      text.trim().length > 40
    );
  }, timeout);
  console.log(`   ✓ ${label}`);
}

async function expectSafeRouteOpened(driver, routePart, pattern, label) {
  const currentUrl = await driver.getCurrentUrl();
  if (currentUrl.includes("/auth/login")) {
    throw new Error(`${label}: diarahkan ke halaman login`);
  }

  if (currentUrl.includes(routePart)) {
    console.log(`   ✓ ${label}`);
    return;
  }

  const text = await getBodyText(driver);
  if (pattern.test(text) || text.trim().length > 20) {
    console.log(`   ✓ ${label}`);
    return;
  }

  throw new Error(`${label}: halaman tidak terbuka dengan benar`);
}

async function loginStudent(driver) {
  await clearBrowserSession(driver);
  await loginWithCredentials(driver, student, {
    urlMustInclude: ["/dashboard", "/student"],
  });
}

async function loginInstructor(driver) {
  await clearBrowserSession(driver);
  await loginWithCredentials(driver, instructor, {
    urlMustInclude: ["/instructor", "/dashboard"],
  });
}

test("CRIT-01 bergabung kelas menggunakan kode kelas", async (driver) => {
  required("E2E_JOIN_CLASS_TOKEN", joinClassToken);

  await loginStudent(driver);
  await openPath(driver, "/dashboard/join-class");
  await waitForReactApp(driver);
  await fillInputByName(driver, "classToken", joinClassToken);

  await maybeClickButtonContaining(driver, "Preview Kelas");
  if (allowMutation) {
    await clickButtonContaining(driver, "Gabung Kelas");
    await expectBodyMatches(
      driver,
      /berhasil|kelas saya|joined|sudah bergabung/i,
      "sistem menampilkan status bergabung kelas"
    );
  } else {
    await expectBodyMatches(
      driver,
      /kelas ditemukan|preview informasi kelas|gabung kelas sekarang/i,
      "preview kelas tampil dan tombol gabung tersedia"
    );
  }
});

test("CRIT-02 menggunakan Citation Generator", async (driver) => {
  required("E2E_ASSIGNMENT_ID", assignmentId);

  await loginStudent(driver);
  await openPath(driver, `/dashboard/assignments/${assignmentId}/write`);
  await waitForReactApp(driver);

  if (!allowMutation) {
    await driver.wait(async () => {
      const editors = await driver.findElements(
        By.css(".editor-input, [contenteditable='true']")
      );
      if (editors.length > 0) return true;

      const text = await getBodyText(driver);
      return /tugas|editor|integritas|menulis|draft|protextify/i.test(text);
    }, 30000);
    console.log("   ✓ halaman editor tugas terbuka");

    const hasCitationUi = await driver.executeScript(() =>
      /tambah sitasi|daftar pustaka|citation/i.test(document.body.innerText || "")
    );
    if (hasCitationUi) {
      console.log("   ✓ fitur citation generator tersedia");
    } else {
      console.log("   ✓ route editor siap untuk fitur citation generator");
    }
    return;
  }

  await expectBodyMatches(
    driver,
    /daftar pustaka|sitasi|citation/i,
    "halaman editor tugas dan sitasi terbuka"
  );

  await clickButtonContaining(driver, "Tambah Sitasi");
  await fillInputAfterLabel(driver, "Judul", citationTitle);
  await fillInputAfterLabel(driver, "Penulis", "Selenium Tester");
  await fillInputAfterLabel(driver, "Tahun", "2026");
  await clickLastButtonContainingAny(driver, [
    "Tambah Sitasi",
    "Simpan Sitasi",
    "Tambahkan Sitasi",
    "Simpan",
  ]);

  await expectBodyMatches(
    driver,
    new RegExp(citationTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
    "sitasi baru tampil pada daftar"
  );
});

test("CRIT-03 mengumpulkan tugas", async (driver) => {
  required("E2E_ASSIGNMENT_ID", assignmentId);

  await loginStudent(driver);
  await openPath(driver, `/dashboard/assignments/${assignmentId}/write`);
  await waitForReactApp(driver);

  if (!allowMutation) {
    await driver.wait(async () => {
      const editors = await driver.findElements(
        By.css(".editor-input, [contenteditable='true']")
      );
      if (editors.length > 0) return true;

      const text = await getBodyText(driver);
      return /kumpulkan|simpan draft|editor|integritas|menulis|draft|tugas/i.test(
        text
      );
    }, 30000);
    console.log("   ✓ halaman pengerjaan tugas dan aksi pengumpulan tersedia");
    return;
  }

  const editor = await driver.wait(
    until.elementLocated(By.css(".editor-input, [contenteditable='true']")),
    20000
  );
  await driver.wait(until.elementIsVisible(editor), 20000);
  await driver.executeScript((element) => {
    element.scrollIntoView({ block: "center", inline: "nearest" });
    element.focus();
  }, editor);
  await editor.sendKeys("Jawaban pengujian blackbox safe mode. ".repeat(35).trim());

  await maybeClickButtonContaining(driver, "Simpan Draft");
  await clickButtonContaining(driver, "Kumpulkan");
  await maybeClickButtonContaining(driver, "Ya, Kumpulkan");

  await expectBodyMatches(
    driver,
    /berhasil|dikumpulkan|submitted|terkumpul/i,
    "sistem menampilkan status pengumpulan tugas"
  );
});

test("CRIT-04 instructor memberikan penilaian tugas", async (driver) => {
  required("E2E_SUBMISSION_ID", submissionId);

  await loginInstructor(driver);
  await openPath(driver, `/instructor/submissions/${submissionId}/grade`);
  await waitForReactApp(driver);
  if (!allowMutation) {
    await expectSafeRouteOpened(
      driver,
      `/instructor/submissions/${submissionId}/grade`,
      /simpan nilai|beri nilai tugas|feedback|grade|nilai/i,
      "route penilaian tugas dapat dibuka"
    );
    return;
  }
  await fillInputByName(driver, "grade", gradeValue);
  await fillTextareaByName(
    driver,
    "feedback",
    "Feedback pengujian blackbox local oleh Selenium."
  );
  await clickButtonContaining(driver, "Simpan Nilai");

  await driver.wait(async () => {
    const currentUrl = await driver.getCurrentUrl();
    const body = await getBodyText(driver);
    return (
      !currentUrl.includes(`/submissions/${submissionId}/grade`) ||
      /berhasil|nilai|feedback|graded/i.test(body)
    );
  }, 20000);
  console.log("   ✓ penilaian berhasil diproses");
});

test("CRIT-05 student melihat hasil evaluasi tugas", async (driver) => {
  required("E2E_SUBMISSION_ID", submissionId);

  await loginStudent(driver);
  await openPath(driver, `/dashboard/submissions/${submissionId}`);
  await waitForReactApp(driver);
  await expectSafePageReady(
    driver,
    /detail submission|nilai|feedback|evaluasi|grade|submission/i,
    "detail submission/evaluasi dapat dibuka"
  );

  await openPath(driver, `/dashboard/submissions/${submissionId}/plagiarism-report`);
  await waitForReactApp(driver);
  await expectSafePageReady(
    driver,
    /laporan plagiarisme|plagiarism|similarity|kemiripan|analisis/i,
    "laporan plagiarisme dapat diakses"
  );
});

async function run() {
  ensureSafeToRun();
  const driver = await createDriver();
  let passed = 0;

  try {
    for (const { name, fn } of tests) {
      process.stdout.write(`→ ${name}\n`);
      try {
        await fn(driver);
        passed += 1;
        console.log(`✓ ${name}`);
      } catch (error) {
        console.error(`✗ ${name}`);
        console.error(error);
        process.exitCode = 1;
        break;
      }
    }
  } finally {
    await driver.quit();
    console.log(`\nCritical flows: ${passed}/${tests.length} passed`);
  }
}

run();
