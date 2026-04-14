#!/usr/bin/env ts-node

import { access, rename, rm } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import { dirname, resolve } from 'node:path';
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
    describe: 'Aspect ratio as W:H (e.g. 16:9) if height is not set',
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
    describe: 'Device scale factor (e.g. 2 for Retina)',
    type: 'number',
  })
  .help()
  .version(version.version)
  .alias('help', 'h')
  .parseSync() as CLIArgs;

/**
 * Ensures a file exists and is readable.
 *
 * @param filePath - Path to verify
 * @returns Promise that resolves when the file exists
 */
async function assertFileExists(filePath: string): Promise<void> {
  await access(filePath, fsConstants.F_OK | fsConstants.R_OK);
}

/**
 * Takes a screenshot using Playwright and writes to disk atomically.
 *
 * The screenshot is written to a temporary file first and then renamed into place.
 * This avoids leaving the target file missing or half-written when capture fails.
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
  const temporaryOutput = `${output}.tmp`;

  try {
    const context = await browser.newContext({
      colorScheme: options.colorScheme ?? 'dark',
      deviceScaleFactor: options.deviceScaleFactor ?? 1,
      viewport: {
        height: height ?? 800,
        width,
      },
    });

    const page = await context.newPage();

    await page.goto(url, { timeout: 0, waitUntil: 'load' });

    if ((options.delay ?? 0) > 0) {
      console.log(`[dnb] Waiting ${options.delay}ms before screenshot...`);
      await page.waitForTimeout(options.delay ?? 0);
    }

    const screenshotOptions: Parameters<typeof page.screenshot>[0] = {
      fullPage: height === undefined,
      path: temporaryOutput,
      type: format === 'jpg' ? 'jpeg' : 'png',
      ...(format === 'jpg' ? { quality: 100 } : {}),
    };

    await page.screenshot(screenshotOptions);
    await assertFileExists(temporaryOutput);
    await rename(temporaryOutput, output);

    console.log(`[dnb] Saved: ${resolve(output)}`);
  } catch (error: unknown) {
    await rm(temporaryOutput, { force: true });

    if (error instanceof Error) {
      throw new Error(`[dnb] Screenshot capture failed: ${error.message}`);
    }

    throw new Error('[dnb] Screenshot capture failed with an unknown error.');
  } finally {
    await browser.close();
  }
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
  if (!aspect) {
    return undefined;
  }

  const validFormat = /^\d+:\d+$/;
  if (!validFormat.test(aspect)) {
    throw new Error('Invalid aspect ratio format. Expected "W:H" like "16:9".');
  }

  const [wStr, hStr] = aspect.split(':');
  const w = Number(wStr);
  const h = Number(hStr);

  if (w === 0 || h === 0) {
    throw new Error('Aspect ratio must not contain zero.');
  }

  return Math.round((width / w) * h);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const computedHeight =
      argv.height ?? calculateAspectHeight(argv.width, argv.aspect);
    const resolvedOutput = argv.output ?? `screenshot.${argv.format}`;

    await takeScreenshot(
      argv.url,
      resolvedOutput,
      argv.width,
      computedHeight,
      argv.format,
      {
        colorScheme: argv.scheme,
        delay: argv.delay,
        deviceScaleFactor: argv.scale,
      },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('[dnb] Screenshot command failed with an unknown error.');
    }

    process.exitCode = 1;
  }
}