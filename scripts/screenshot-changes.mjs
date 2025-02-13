#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright";
import { PNG } from "pngjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getData(screenshotDir = ".github/screenshots", retries = 3) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();

  await page.emulateMedia({ colorScheme: "dark" });
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await page.goto("https://kollitsch.dev/", { waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      // Ensure the directory exists
      const screenshotPathDefault = path.join(
        __dirname,
        screenshotDir,
        `screenshot.png`,
      );
      const diffPath = path.join(__dirname, screenshotDir, "diff.png");

      const now = new Date();
      const timestamp =
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        now.getDate().toString().padStart(2, "0") +
        now.getHours().toString().padStart(2, "0") +
        now.getMinutes().toString().padStart(2, "0") +
        now.getSeconds().toString().padStart(2, "0");
      const screenshotPathWithTimestamp = path.join(
        __dirname,
        screenshotDir,
        `screenshot_${timestamp}.png`,
      );

      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }

      await page.screenshot({
        path: screenshotPathWithTimestamp,
        fullPage: true,
      });
      console.log(`Screenshot saved to ${screenshotPathWithTimestamp}`);

      if (
        fs.existsSync(screenshotPathDefault) &&
        fs.existsSync(screenshotPathWithTimestamp)
      ) {
        const img1 = PNG.sync.read(fs.readFileSync(screenshotPathDefault));
        const img2 = PNG.sync.read(
          fs.readFileSync(screenshotPathWithTimestamp),
        );
        const { width, height } = img1;
        const diff = new PNG({ width, height });
        const numDiffPixels = pixelmatch(
          img1.data,
          img2.data,
          diff.data,
          width,
          height,
          { threshold: 0.1 },
        );
        fs.writeFileSync(diffPath, PNG.sync.write(diff));

        if (numDiffPixels > 0) {
          fs.copyFileSync(screenshotPathWithTimestamp, screenshotPathDefault);
          console.log("Changes detected, updating screenshot.");
          process.stdout.write("::set-output name=changes::true\n");
        } else {
          console.log("No changes detected.");
          process.stdout.write("::set-output name=changes::false\n");
        }
      } else {
        fs.copyFileSync(screenshotPathWithTimestamp, screenshotPathDefault);
        console.log("No previous screenshot found, saving new one.");
        process.stdout.write("::set-output name=changes::true\n");
      }

      await browser.close();

      if (fs.existsSync(diffPath)) {
        fs.unlinkSync(diffPath);
      }

      return;
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      if (attempt === retries) {
        console.error("Max retries reached. Exiting.");
        await browser.close();
        process.exit(1);
      }
      console.log("Retrying...");
    }
  }
}

getData();
