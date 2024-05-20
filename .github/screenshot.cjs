const playwright = require("playwright");
const fs = require("fs");
const path = require("path");

async function getData(screenshotDir = "./.github/screenshots") {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });
  await page.goto("https://kollitsch.dev/");
  await page.waitForTimeout(500);

  // Ensure the directory exists
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const now = new Date();
  const timestamp = now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
  const screenshotPath = path.join(screenshotDir, `screenshot_${timestamp}.png`);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  await browser.close();
  console.log(`Screenshot saved to ${screenshotPath}`);
}

getData();
