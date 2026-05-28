#!/usr/bin/env ts-node

import { constants as fsConstants } from 'node:fs';
import { access, mkdir, rename, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { chromium, type Page } from 'playwright';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import version from '../../package.json' with { type: 'json' };

type ScreenshotFormat = 'png' | 'jpg';
type ColorScheme = 'light' | 'dark';

interface ScreenshotOptions {
  delay?: number | undefined;
  colorScheme?: ColorScheme | undefined;
  deviceScaleFactor?: number | undefined;
  scrollDelay?: number | undefined;
  scrollStep?: number | undefined;
  settleMs?: number | undefined;
  timeout?: number | undefined;
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
  scrollDelay: number;
  scrollStep: number;
  settleMs: number;
  timeout: number;
}

interface WaitForSettledPageOptions {
  scrollDelay: number;
  scrollStep: number;
  settleMs: number;
  timeout: number;
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
    describe: 'Extra delay in milliseconds before capturing screenshot',
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
  .option('scroll-delay', {
    default: 250,
    describe: 'Delay in milliseconds after each scroll step',
    type: 'number',
  })
  .option('scroll-step', {
    default: 500,
    describe: 'Scroll step in pixels used to trigger lazy-loaded content',
    type: 'number',
  })
  .option('settle-ms', {
    default: 5000,
    describe: 'Final wait time in milliseconds after loading and scrolling',
    type: 'number',
  })
  .option('timeout', {
    default: 120000,
    describe: 'Timeout in milliseconds for page loading and readiness checks',
    type: 'number',
  })
  .help()
  .version(version.version)
  .alias('help', 'h')
  .parseSync() as CLIArgs;

/**
 * Ensures a file exists and is readable.
 *
 * @param filePath - Path to verify.
 * @returns Promise that resolves when the file exists.
 */
async function assertFileExists(filePath: string): Promise<void> {
  await access(filePath, fsConstants.F_OK | fsConstants.R_OK);
}

/**
 * Ensures that the parent directory for a file path exists.
 *
 * @param filePath - File path whose parent directory should exist.
 */
async function ensureOutputDirectory(filePath: string): Promise<void> {
  await mkdir(dirname(resolve(filePath)), { recursive: true });
}

/**
 * Waits until a page is ready for a visual screenshot.
 *
 * This waits for document load, network idle, fonts, lazy images, image decoding,
 * CSS background images, viewport-triggered JavaScript, and a final settle delay.
 *
 * @param page - Playwright page instance.
 * @param options - Page readiness options.
 */
async function waitForSettledPage(
  page: Page,
  options: WaitForSettledPageOptions,
): Promise<void> {
  await page.waitForLoadState('domcontentloaded', { timeout: options.timeout });
  await page.waitForLoadState('load', { timeout: options.timeout });

  await page
    .waitForLoadState('networkidle', { timeout: options.timeout })
    .catch((error: unknown) => {
      console.warn('[dnb] Network did not become idle before timeout.');

      if (error instanceof Error) {
        console.warn(`[dnb] ${error.message}`);
      }
    });

  await page.evaluate(async () => {
    if ('fonts' in document) {
      await document.fonts.ready;
    }

    for (const image of document.images) {
      image.loading = 'eager';
      image.decoding = 'sync';
    }
  });

  await scrollPageToTriggerLazyLoading(page, options.scrollStep, options.scrollDelay);
  await waitForImages(page, options.timeout);
  await waitForCssBackgroundImages(page, options.timeout);

  await page.evaluate(() => {
    window.scrollTo({
      behavior: 'instant',
      left: 0,
      top: 0,
    });
  });

  if (options.settleMs > 0) {
    console.log(`[dnb] Waiting ${options.settleMs}ms for final visual settle...`);
    await page.waitForTimeout(options.settleMs);
  }
}

/**
 * Scrolls through the page to trigger lazy-loaded images and viewport effects.
 *
 * @param page - Playwright page instance.
 * @param scrollStep - Scroll step in pixels.
 * @param scrollDelay - Delay after each scroll step in milliseconds.
 */
async function scrollPageToTriggerLazyLoading(
  page: Page,
  scrollStep: number,
  scrollDelay: number,
): Promise<void> {
  const pageHeight = await page.evaluate(() => {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
    );
  });

  for (let top = 0; top <= pageHeight; top += scrollStep) {
    await page.evaluate((scrollTop: number) => {
      window.scrollTo({
        behavior: 'instant',
        left: 0,
        top: scrollTop,
      });
    }, top);

    await page.waitForTimeout(scrollDelay);
  }

  await page.evaluate(() => {
    window.scrollTo({
      behavior: 'instant',
      left: 0,
      top: Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      ),
    });
  });

  await page.waitForTimeout(scrollDelay);
}

/**
 * Waits for all HTML images to finish loading and decoding.
 *
 * @param page - Playwright page instance.
 * @param timeout - Timeout in milliseconds.
 */
async function waitForImages(page: Page, timeout: number): Promise<void> {
  await page.waitForFunction(
    async () => {
      const images = Array.from(document.images);

      await Promise.allSettled(
        images.map(async (image) => {
          if (!image.complete || image.naturalWidth === 0) {
            await new Promise<void>((resolveImage, rejectImage) => {
              image.addEventListener('load', () => resolveImage(), { once: true });
              image.addEventListener(
                'error',
                () => {
                  rejectImage(
                    new Error(
                      `Image failed to load: ${image.currentSrc || image.src}`,
                    ),
                  );
                },
                { once: true },
              );
            });
          }

          if (typeof image.decode === 'function') {
            await image.decode().catch(() => undefined);
          }
        }),
      );

      return images.every((image) => {
        return image.complete && image.naturalWidth > 0;
      });
    },
    undefined,
    { timeout },
  );
}

/**
 * Waits for CSS background images on currently rendered elements.
 *
 * @param page - Playwright page instance.
 * @param timeout - Timeout in milliseconds.
 */
async function waitForCssBackgroundImages(
  page: Page,
  timeout: number,
): Promise<void> {
  await page.waitForFunction(
    async () => {
      const urls = Array.from(document.querySelectorAll<HTMLElement>('*'))
        .flatMap((element) => {
          const backgroundImage = getComputedStyle(element).backgroundImage;
          const matches = backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g);

          return Array.from(matches)
            .map((match) => match[1])
            .filter((url): url is string => {
              return typeof url === 'string' && url.length > 0;
            });
        })
        .filter((url) => {
          return !url.startsWith('data:');
        });

      const uniqueUrls = Array.from(new Set(urls));

      await Promise.allSettled(
        uniqueUrls.map(async (url) => {
          await new Promise<void>((resolveImage) => {
            const image = new Image();

            image.onload = () => resolveImage();
            image.onerror = () => resolveImage();
            image.src = url;
          });
        }),
      );

      return true;
    },
    undefined,
    { timeout },
  );
}

/**
 * Takes a screenshot using Playwright and writes to disk atomically.
 *
 * The screenshot is written to a temporary file first and then renamed into place.
 * This avoids leaving the target file missing or half-written when capture fails.
 *
 * @param url - URL to capture.
 * @param output - Output file path.
 * @param width - Viewport width.
 * @param height - Viewport height or undefined for full-page.
 * @param format - Screenshot format.
 * @param options - Advanced screenshot options.
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
    await ensureOutputDirectory(output);

    const context = await browser.newContext({
      colorScheme: options.colorScheme ?? 'dark',
      deviceScaleFactor: options.deviceScaleFactor ?? 1,
      viewport: {
        height: height ?? 800,
        width,
      },
    });

    const page = await context.newPage();

    await page.goto(url, {
      timeout: options.timeout ?? 120000,
      waitUntil: 'domcontentloaded',
    });

    await waitForSettledPage(page, {
      scrollDelay: options.scrollDelay ?? 250,
      scrollStep: options.scrollStep ?? 500,
      settleMs: options.settleMs ?? 5000,
      timeout: options.timeout ?? 120000,
    });

    if ((options.delay ?? 0) > 0) {
      console.log(`[dnb] Waiting extra ${options.delay}ms before screenshot...`);
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
      throw new Error(`[dnb] Screenshot capture failed: ${error.message}`, {
        cause: error,
      });
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
 * @param width - Width in pixels.
 * @param aspect - Aspect ratio string in the format "W:H".
 * @returns Calculated height in pixels or undefined if invalid.
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
        scrollDelay: argv.scrollDelay,
        scrollStep: argv.scrollStep,
        settleMs: argv.settleMs,
        timeout: argv.timeout,
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