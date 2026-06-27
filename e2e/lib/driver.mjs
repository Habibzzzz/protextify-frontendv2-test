import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import fs from "node:fs/promises";
import path from "node:path";

export const BASE_URL = (process.env.BASE_URL || "http://localhost:5173").replace(
  /\/$/,
  ""
);

export async function createDriver() {
  const profileRoot = path.join(process.cwd(), ".e2e-tmp");
  await fs.mkdir(profileRoot, { recursive: true });
  const profileDir = await fs.mkdtemp(path.join(profileRoot, "chrome-"));

  const options = new chrome.Options();
  options.setUserPreferences({
    credentials_enable_service: false,
    "profile.password_manager_enabled": false,
    "profile.password_manager_leak_detection": false,
  });
  options.addArguments(
    "--disable-background-networking",
    "--disable-application-cache",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-sync",
    "--disable-save-password-bubble",
    "--disable-features=PasswordLeakDetection,PasswordManagerOnboarding,AutofillServerCommunication",
    "--disk-cache-size=1",
    "--media-cache-size=1",
    `--user-data-dir=${profileDir}`,
    "--log-level=3"
  );
  if (process.env.HEADLESS === "1") {
    options.addArguments("--headless=new", "--window-size=1280,900");
  }

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({
    implicit: 0,
    pageLoad: 45000,
    script: 30000,
  });

  const originalQuit = driver.quit.bind(driver);
  driver.quit = async () => {
    try {
      await originalQuit();
    } finally {
      await fs.rm(profileDir, { recursive: true, force: true }).catch(() => {});
    }
  };

  return driver;
}
