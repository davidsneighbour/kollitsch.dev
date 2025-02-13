import puppeteer from "puppeteer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import version from "../../package.json" with { type: "json" };

const argv = yargs(hideBin(process.argv))

  .option("url", {
    describe: "URL to capture a screenshot of",
    demandOption: true,
    type: "string",
  })
  .option("output", {
    describe: "Output file name",
    default: "header.jpg",
    type: "string",
  })
  .option("width", {
    describe: "Viewport width",
    default: 1200,
    type: "number",
  })
  .option("height", {
    describe: "Viewport height",
    default: 600,
    type: "number",
  })
  .help()
  .version(version.version)
  .alias("help", "h").argv;

export const takeScreenshot = async (url, output, width, height) => {
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1200, height: 800 },
  });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 0 });
  } catch (e) {
    console.log("Error: " + url + " not available");
    console.log(e.message);
  }

  await page.emulateMediaFeatures([
    {
      name: "prefers-color-scheme",
      value: "dark",
    },
  ]);
  await page.screenshot({ path: output });
  await browser.close();
};

// @ts-ignore
takeScreenshot(argv.url, argv.output, argv.width, argv.height);
