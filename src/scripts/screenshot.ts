#!/usr/bin/env ts-node

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
/**
 * Screenshot CLI Utility
 * -----------------------
 * Takes screenshots of websites using Playwright's headless Chromium browser.
 *
 * Features:
 * - Customizable viewport (width, height, or aspect ratio)
 * - Full-page or fixed-height capture
 * - PNG and JPG output formats
 * - Delay before capture (e.g., wait for animations)
 * - Light or dark color scheme
 * - Device pixel ratio (e.g., for HiDPI)
 *
 * Usage:
 *   ts-node screenshot.ts --url=https://example.com --width=1280 --aspect=16:9 --format=jpg --delay=1000
 */
import { chromium } from 'playwright';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import version from '../../package.json' with { type: 'json' };

type ScreenshotFormat = 'png' | 'jpg';
type ColorScheme = 'light' | 'dark';

interface ScreenshotOptions {
  delay?: number | undefined;
  colorScheme?: ColorScheme | undefined;
  deviceScaleFactor?: number | undefined;
}

interface CLIArgs {
  url: string;
  output?: string;
  width: number;
  height?: number;
  aspect?: string;
  format: ScreenshotFormat;
  delay?: number;
  scheme: ColorScheme;
  scale: number;
}

const argv = yargs(hideBin(process.argv))
  .option('url', {
    demandOption: true,
    describe: 'URL to capture a screenshot of',
    type: 'string',
  })
  .option('output', {
    describe: 'Output file name (optional)',
    type: 'string',
  })
  .option('width', {
    default: 1200,
    describe: 'Viewport width in pixels',
    type: 'number',
  })
  .option('height', {
    describe: 'Viewport height in pixels (omit for full-page)',
    type: 'number',
  })
  .option('aspect', {
    describe: 'Aspect ratio as W:H (e.g., 16:9) if height is not set',
    type: 'string',
  })
  .option('format', {
    choices: ['png', 'jpg'],
    default: 'png',
    describe: 'Screenshot format',
    type: 'string',
  })
  .option('delay', {
    default: 0,
    describe: 'Delay in milliseconds before capturing screenshot',
    type: 'number',
  })
  .option('scheme', {
    choices: ['light', 'dark'],
    default: 'dark',
    describe: 'Color scheme for rendering',
    type: 'string',
  })
  .option('scale', {
    default: 1,
    describe: 'Device scale factor (e.g., 2 for Retina)',
    type: 'number',
  })
  .help()
  .version(version.version)
  .alias('help', 'h')
  .parseSync() as CLIArgs;

/**
 * Takes a screenshot using Playwright and writes to disk.
 *
 * @param url - URL to capture
 * @param output - Output file path
 * @param width - Viewport width
 * @param height - Viewport height or undefined for full-page
 * @param format - 'png' or 'jpg'
 * @param options - Advanced screenshot options
 */
export async function takeScreenshot(
  url: string,
  output: string,
  width: number,
  height: number | undefined,
  format: ScreenshotFormat,
  options: ScreenshotOptions = {},
): Promise<void> {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    colorScheme: options.colorScheme ?? 'dark',
    deviceScaleFactor: options.deviceScaleFactor ?? 1,
    viewport: {
      height: height || 800,
      width,
    },
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { timeout: 0, waitUntil: 'load' });
  } catch (err: unknown) {
    console.error(`[dnb] Could not open: ${url}`);
    if (err instanceof Error) console.error(`[dnb] ${err.message}`);
    await browser.close();
    process.exit(1);
  }

  if (options.delay && options.delay > 0) {
    console.log(`[dnb] Waiting ${options.delay}ms before screenshot...`);
    await page.waitForTimeout(options.delay);
  }

  const screenshotOptions: Parameters<typeof page.screenshot>[0] = {
    fullPage: !height,
    path: output,
    type: format === 'jpg' ? 'jpeg' : 'png',
    ...(format === 'jpg' && { quality: 100 }),
  };

  try {
    await page.screenshot(screenshotOptions);
    console.log(`[dnb] Saved: ${resolve(output)}`);
  } catch (err: unknown) {
    console.error('[dnb] Screenshot capture failed.');
    if (err instanceof Error) console.error(`[dnb] ${err.message}`);
  }

  await browser.close();
}

/**
 * Converts an aspect ratio string (e.g. "16:9") to a numeric height.
 * Ensures strict format "NUMBER:NUMBER" before parsing.
 *
 * @param width - Width in pixels
 * @param aspect - Aspect ratio string in the format "W:H"
 * @returns Calculated height in pixels or undefined if invalid
 */
export function calculateAspectHeight(
  width: number,
  aspect?: string,
): number | undefined {
  if (!aspect) return undefined;

  const validFormat = /^\d+:\d+$/;
  if (!validFormat.test(aspect)) {
    console.log('Invalid aspect ratio format. Expected "W:H" like "16:9".');
    return undefined;
  }

  const [wStr, hStr] = aspect.split(':');
  const w = Number(wStr);
  const h = Number(hStr);

  if (w === 0 || h === 0) {
    console.log('Aspect ratio must not contain zero.');
    return undefined;
  }

  return Math.round((width / w) * h);
}

// CLI execution wrapper
if (import.meta.url === `file://${process.argv[1]}`) {
  const computedHeight =
    argv.height ?? calculateAspectHeight(argv.width, argv.aspect);
  const resolvedOutput = argv.output || `screenshot.${argv.format}`;
  const finalPath = existsSync(resolvedOutput)
    ? resolvedOutput.replace(/\.(png|jpg)$/, `-${Date.now()}.$1`)
    : resolvedOutput;

  await takeScreenshot(
    argv.url,
    finalPath,
    argv.width,
    computedHeight,
    argv.format,
    {
      colorScheme: argv.scheme,
      delay: argv.delay,
      deviceScaleFactor: argv.scale,
    },
  );
}
