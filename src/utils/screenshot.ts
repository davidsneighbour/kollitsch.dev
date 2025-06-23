#!/usr/bin/env node

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
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

type ScreenshotFormat = 'png' | 'jpg';
type ColorScheme = 'light' | 'dark';

interface ScreenshotOptions {
  delay?: number;
  colorScheme?: ColorScheme;
  deviceScaleFactor?: number;
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
    describe: 'URL to capture a screenshot of',
    demandOption: true,
    type: 'string',
  })
  .option('output', {
    describe: 'Output file name (optional)',
    type: 'string',
  })
  .option('width', {
    describe: 'Viewport width in pixels',
    default: 1200,
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
    describe: 'Screenshot format',
    choices: ['png', 'jpg'],
    default: 'png',
    type: 'string',
  })
  .option('delay', {
    describe: 'Delay in milliseconds before capturing screenshot',
    type: 'number',
    default: 0,
  })
  .option('scheme', {
    describe: 'Color scheme for rendering',
    choices: ['light', 'dark'],
    default: 'dark',
    type: 'string',
  })
  .option('scale', {
    describe: 'Device scale factor (e.g., 2 for Retina)',
    default: 1,
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
    viewport: {
      width,
      height: height || 800,
    },
    colorScheme: options.colorScheme ?? 'dark',
    deviceScaleFactor: options.deviceScaleFactor ?? 1,
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 0 });
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
    path: output,
    type: format === 'jpg' ? 'jpeg' : 'png',
    fullPage: !height,
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
 */
function calculateAspectHeight(
  width: number,
  aspect?: string,
): number | undefined {
  if (!aspect) return undefined;
  const parts = aspect.split(':').map(Number);
  if (parts.length !== 2 || parts.some(isNaN)) {
    console.warn(
      '[dnb] Invalid aspect ratio format. Expected "W:H" like "16:9".',
    );
    return undefined;
  }
  const [w, h] = parts;
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
      delay: argv.delay,
      colorScheme: argv.scheme,
      deviceScaleFactor: argv.scale,
    },
  );
}
