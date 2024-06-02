const fs = require('fs');
const playwright = require("playwright");
const path = require("path");

async function getData(screenshotDir = "./.github/screenshots", retries = 3) {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await page.goto("https://kollitsch.dev/", { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // Ensure the directory exists
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      const screenshotPathDefault = path.join(screenshotDir, `new-screenshot.png`);

      // Take screenshot and save to both paths
      await page.screenshot({ path: screenshotPathDefault, fullPage: true });
      await browser.close();
      console.log(`Screenshot saved to ${screenshotPathDefault}`);
      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        console.error('Max retries reached. Exiting.');
        await browser.close();
        process.exit(1);
      }
      console.log('Retrying...');
    }
  }
}

getData();
