import { chromium } from "playwright";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import version from "../package.json" with { type: "json" };

const argv = yargs(hideBin(process.argv))
  .option("url", {
    describe: "URL to capture a screenshot of",
    demandOption: true,
    type: "string",
  })
  .option("output", {
    describe: "Output file name (optional)",
    type: "string",
  })
  .option("width", {
    describe: "Viewport width",
    default: 1200,
    type: "number",
  })
  .option("height", {
    describe: "Viewport height (optional)",
    type: "number",
  })
  .option("format", {
    describe: "Screenshot format (png or jpg)",
    choices: ["png", "jpg"],
    default: "png",
    type: "string",
  })
  .help()
  .version(version.version)
  .alias("help", "h").argv;

/**
 * Capture a screenshot of the given URL
 * @param {string} url - Target URL
 * @param {string} output - Screenshot filename
 * @param {number} width - Viewport width
 * @param {number|undefined} height - Viewport height or undefined to capture full page
 * @param {string} format - Screenshot format: png or jpg
 */
export const takeScreenshot = async (url, output, width, height, format) => {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width, height: height || 800 },
    colorScheme: "dark",
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 0 });
  } catch (e) {
    console.log("Error: " + url + " not available");
    console.log(e.message);
  }

  const screenshotOptions = {
    path: output,
    type: format === "jpg" ? "jpeg" : "png",
    fullPage: !height,
    ...(format === "jpg" && { quality: 100 }),
  };

  await page.screenshot(screenshotOptions);

  await browser.close();
};

// Resolve default output name
const resolvedOutput = argv.output || `screenshot.${argv.format}`;

takeScreenshot(argv.url, resolvedOutput, argv.width, argv.height, argv.format);
