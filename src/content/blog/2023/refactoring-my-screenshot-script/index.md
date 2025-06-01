---
title: Refactoring my screenshot script
description: >-
  I decided to rewrite my go-to-script to create a screenshot as header images
  of posts about a website a little bit.
date: '2023-03-08T21:57:10+07:00'
resources:
  - title: >-
      Photo by [Shubh karman Singh](https://unsplash.com/@theshutterclap) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - javascript
  - module
  - refactoring
  - 100DaysToOffload
type: blog
fmContentType: blog
cover: header.jpg
---

My go-to-script to create a screenshot as header images of posts about a website was for a long time this:

```js
const { chromium } = require('playwright');
(async () => {
let browser = await chromium.launch();
    let page = await browser.newPage();
    await page.setViewportSize({ width: 1200, height: 600 });
    await page.goto(process.argv[2]);
    await page.screenshot({ path: 'header.jpg' });
    await browser.close();
})();
```

The only dynamic component here was the URL to screenshot, which I passed as a command line argument that is read as `process.argv[2]` in this script. Args 0 and 1 are the node and script name, so the URL as the first parameter is at index 2.

This script is called like this:

```bash
node script.js https://example.com
```

I had several issues with this script:

- it was not configurable for parameters like width and height of the screenshot and the path to the output file
- it was a CommonJS script and not an ESM module, which is basically the standard for Node.js now

So I decided to rewrite it a little bit.

To configure this script with CLI parameters, we can use a command-line argument parser like [yargs](https://www.npmjs.com/package/yargs) or [commander](https://www.npmjs.com/package/commander). I decided on yargs for now:

```js
const { chromium } = require("playwright");
const argv = require('yargs').argv;
(async () => {
let browser = await chromium.launch();
    let page = await browser.newPage();
    await page.setViewportSize({
      width: argv.width || 1200,
      height: argv.height || 600
    });
    await page.goto(argv.url || 'https://example.com');
    await page.screenshot({ path: argv.output || 'header.jpg' });
    await browser.close();
})();
```

In this modified script, we import the "yargs" library and parse the command-line arguments using argv. The script now accepts the following parameters:

- `--url`: The URL to capture a screenshot of (default: <https://example.com/>).
- `--width`: The width of the viewport (default: 1200).
- `--height`: The height of the viewport (default: 600).
- `--output`: The file name to save the screenshot as (default: header.jpg).

You can now run the script using the following command:

```bash
node script.js \
  --url=https://example.com \
  --width=800 \
  --height=600 \
  --output=screenshot.jpg
```

This will capture a screenshot of the "<https://example.com>" website with a viewport size of 800×600 and save it as "screenshot.jpg". If you don't specify any of the parameters, the script will use the default values.

To rewrite this script as an ESM module, we need to change the way we import and export the code. Here's how:

```js
import { chromium } from "playwright";
const takeScreenshot = async (url = "https://example.com/", output = "header.jpg", width = 1200, height = 600) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width, height });
  await page.goto(url);
  await page.screenshot({ path: output });
  await browser.close();
};
export default takeScreenshot;
```

The takeScreenshot function accepts the same parameters as above.

To use this module in another script or module, you can import it like this:

```
import takeScreenshot from "./script.js";
await takeScreenshot("https://example.com", "screenshot.jpg", 800, 600);
```

Note that you need to specify the file extension ".js" when importing the module.

Now lets rewrite this script to be run from the CLI with yargs:

```js
import { chromium } from "playwright";
import yargs from "yargs";
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
 .option("url", {
  describe: "URL to capture a screenshot of",
  demandOption: true,
  type: "string"
 })
 .option("output", {
  describe: "Output file name",
  default: "header.jpg",
  type: "string"
 })
 .option("width", {
  describe: "Viewport width",
  default: 1200,
  type: "number"
 })
 .option("height", {
  describe: "Viewport height",
  default: 600,
  type: "number"
 })
 .help()
 .alias("help", "h").argv;

export const takeScreenshot = async (url, output, width, height) => {
 const browser = await chromium.launch();
 const page = await browser.newPage();
 await page.setViewportSize({ width, height });
 await page.goto(url);
 await page.screenshot({ path: output });
 await browser.close();
};

// @ts-ignore
takeScreenshot(argv.url, argv.output, argv.width, argv.height);
```

In this modified script, we use the yargs library to parse command-line arguments. Notice the extended `option` lines in the beginning. They will be automatically converted to a helpful CLI help message when running the script with the `--help` (or `-h`) parameter.

To run this script from the CLI, you can save it as a file (for example screenshot.js) and then run the following command:

```shell
node screenshot.js --url=https://example.com --output=screenshot.jpg --width=800 --height=600
```

This will capture a screenshot of the "<https://example.com>" website with a viewport size of 800×600 and save it as "screenshot.jpg".

I feel like this is enough change for now. If you have any questions or suggestions, feel free to leave a comment below. If you think I could optimise another part of the script, let me know too.
