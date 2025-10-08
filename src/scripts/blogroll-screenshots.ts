// scripts/screenshot-blogroll.ts
// Node 22+, ESM, TypeScript. Playwright-based website screenshots for a blogroll.
// - Reads a JSON array like src/content/blogroll.json
// - Validates with Zod (url/name required; rss/description optional)
// - Screenshots each `url` at 2000x1000 into src/assets/images/blogroll/*.jpg (quality 100)
// - Signals "prefers-color-scheme: dark" to pages (configurable)
// - Safe, configurable, with helpful CLI and errors
//
// Usage:
//   node scripts/screenshot-blogroll.ts --input src/content/blogroll.json
// Options:
//   --input <path>           Path to JSON file (default: src/content/blogroll.json)
//   --out-dir <path>         Output directory (default: src/assets/images/blogroll)
//   --concurrency <n>        Parallel pages (default: 4)
//   --timeout <ms>           Per-page overall timeout in ms (default: 45000)
//   --nav-timeout <ms>       page.goto timeout in ms (default: 30000)
//   --wait-until <state>     load|domcontentloaded|networkidle|commit (default: networkidle)
//   --delay <ms>             Extra delay after navigation before screenshot (default: 500)
//   --color-scheme <value>   dark|light|no-preference (default: dark)
//   --dry-run                Do not open browser or write files; just print planned actions
//   --verbose                Verbose logging
//   --help                   Show help
//
// Prereqs:
//   npm i -D playwright zod dotenv
//   npx playwright install chromium
//
// Notes:
// - Filenames are slugified from the item name (or hostname fallback).
// - Viewport is exact 2000x1000 (no fullPage).
// - Continues on errors and reports a final summary.

import { mkdir, readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  type Browser,
  type BrowserContext,
  type ColorScheme,
  chromium,
  type Page,
} from 'playwright';
import { z } from 'zod';

/** CLI configuration */
interface Config {
  input: string;
  outDir: string;
  concurrency: number;
  timeout: number;
  navTimeout: number;
  waitUntil: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  delay: number;
  colorScheme: ColorScheme | 'no-preference';
  dryRun: boolean;
  verbose: boolean;
}

/** Blogroll item schema (url + name required; rss/description optional) */
const NAME_MAX_LENGTH = 128;
const FeedItemSchema = z
  .object({
    description: z.string().optional(),
    name: z
      .string()
      .min(1, 'name is required')
      .max(NAME_MAX_LENGTH, `name max length is ${NAME_MAX_LENGTH}`),
    rss: z.string().url().optional(),
    url: z.string().url({ message: 'url must be a valid URL' }),
  })
  .strict();

const FeedListSchema = z.array(FeedItemSchema);

type FeedItem = z.infer<typeof FeedItemSchema>;

/**
 * Default configuration
 * @returns {Config}
 */
function defaultConfig(): Config {
  return {
    colorScheme: 'dark',
    concurrency: 4,
    delay: 500,
    dryRun: false,
    input: 'src/content/blogroll.json',
    navTimeout: 30_000,
    outDir: 'src/assets/images/blogroll',
    timeout: 45_000,
    verbose: false,
    waitUntil: 'networkidle',
  };
}

/**
 * Parse CLI flags into config
 * @param {string[]} argv
 * @returns {Config}
 */
function parseArgs(argv: string[]): Config {
  const cfg = defaultConfig();
  const args = [...argv];

  while (args.length) {
    const arg = args.shift()!;
    switch (arg) {
      case '--help':
        printHelpAndExit();
        break;
      case '--input':
        cfg.input = mustArgValue('--input', args.shift());
        break;
      case '--out-dir':
        cfg.outDir = mustArgValue('--out-dir', args.shift());
        break;
      case '--concurrency':
        cfg.concurrency = toInt(
          '--concurrency',
          mustArgValue('--concurrency', args.shift()),
        );
        break;
      case '--timeout':
        cfg.timeout = toInt(
          '--timeout',
          mustArgValue('--timeout', args.shift()),
        );
        break;
      case '--nav-timeout':
        cfg.navTimeout = toInt(
          '--nav-timeout',
          mustArgValue('--nav-timeout', args.shift()),
        );
        break;
      case '--wait-until': {
        const v = mustArgValue('--wait-until', args.shift());
        if (
          !['load', 'domcontentloaded', 'networkidle', 'commit'].includes(v)
        ) {
          fail(`Invalid --wait-until value: ${v}`);
        }
        cfg.waitUntil = v as Config['waitUntil'];
        break;
      }
      case '--delay':
        cfg.delay = toInt('--delay', mustArgValue('--delay', args.shift()));
        break;
      case '--color-scheme': {
        const v = mustArgValue('--color-scheme', args.shift()).toLowerCase();
        if (!['dark', 'light', 'no-preference'].includes(v)) {
          fail(`Invalid --color-scheme value: ${v}`);
        }
        cfg.colorScheme = v as Config['colorScheme'];
        break;
      }
      case '--dry-run':
        cfg.dryRun = true;
        break;
      case '--verbose':
        cfg.verbose = true;
        break;
      default:
        fail(`Unknown option: ${arg}`);
    }
  }
  return cfg;
}

/** Help text */
function printHelpAndExit(): never {
  console.log(
    [
      'Usage: node scripts/screenshot-blogroll.ts [options]',
      '',
      'Options:',
      '  --input <path>           Path to JSON file (default: src/content/blogroll.json)',
      '  --out-dir <path>         Output directory (default: src/assets/images/blogroll)',
      '  --concurrency <n>        Parallel pages (default: 4)',
      '  --timeout <ms>           Per-page overall timeout in ms (default: 45000)',
      '  --nav-timeout <ms>       page.goto timeout in ms (default: 30000)',
      '  --wait-until <state>     load|domcontentloaded|networkidle|commit (default: networkidle)',
      '  --delay <ms>             Extra delay after navigation before screenshot (default: 500)',
      '  --color-scheme <value>   dark|light|no-preference (default: dark)',
      '  --dry-run                Do not open browser or write files; just print planned actions',
      '  --verbose                Verbose logging',
      '  --help                   Show help',
    ].join('\n'),
  );
  process.exit(0);
}

/**
 * Required value helper
 * @param {string} flag
 * @param {string | undefined} val
 * @returns {string}
 */
function mustArgValue(flag: string, val?: string): string {
  if (!val) fail(`Missing value for ${flag}`);
  return val;
}

/**
 * Convert numeric flags with validation
 * @param {string} flag
 * @param {string} val
 * @returns {number}
 */
function toInt(flag: string, val: string): number {
  const n = Number.parseInt(val, 10);
  if (!Number.isFinite(n) || n < 0) fail(`Invalid number for ${flag}: ${val}`);
  return n;
}

/**
 * Fail fast with message
 * @param {string} msg
 * @returns {never}
 */
function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

/**
 * Ensure directory exists
 * @param {string} dir
 */
async function ensureDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    throw new Error(
      `Unable to create directory ${dir}: ${(err as Error).message}`,
    );
  }
}

/**
 * Read and validate blogroll JSON
 * @param {string} path
 * @param {boolean} verbose
 * @returns {Promise<FeedItem[]>}
 */
async function loadBlogroll(
  path: string,
  verbose: boolean,
): Promise<FeedItem[]> {
  const abs = resolve(path);
  if (verbose) console.log(`Reading: ${abs}`);
  let raw: string;
  try {
    raw = await readFile(abs, 'utf8');
  } catch (err) {
    throw new Error(`Failed to read file ${abs}: ${(err as Error).message}`);
  }
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON in ${abs}: ${(err as Error).message}`);
  }
  const parsed = FeedListSchema.safeParse(json);
  if (!parsed.success) {
    const lines = parsed.error.issues.map(
      (i) => `${i.path.join('.')}: ${i.message}`,
    );
    throw new Error(`Validation failed:\n${lines.join('\n')}`);
  }
  // Sort by name ASC
  return [...parsed.data].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Slugify a name for filename usage
 * @param {string} input
 * @returns {string}
 */
function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .replace(/https?:\/\/(www\.)?/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 120) || 'site'
  );
}

/**
 * Derive fallback name from URL hostname
 * @param {string} urlStr
 * @returns {string}
 */
function hostnameFromUrl(urlStr: string): string {
  try {
    return new URL(urlStr).hostname;
  } catch {
    return slugify(urlStr);
  }
}

/**
 * Task queue with bounded concurrency
 * @template T
 * @param {T[]} items
 * @param {number} limit
 * @param {(item: T, index: number) => Promise<void>} worker
 */
async function runWithConcurrency<T>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>,
): Promise<void> {
  const queue = items.map((_, i) => i);
  let active = 0;
  let idx = 0;

  return new Promise((resolveAll, rejectAll) => {
    const next = () => {
      if (idx >= queue.length && active === 0) return resolveAll();
      while (active < limit && idx < queue.length) {
        const i = queue[idx++];
        active++;
        worker(items[i]!, i)
          .catch(rejectAll)
          .finally(() => {
            active--;
            next();
          });
      }
    };
    next();
  });
}

/**
 * Screenshot one item
 * @param {Page} page
 * @param {FeedItem} item
 * @param {string} outDir
 * @param {Config} cfg
 * @returns {Promise<{ file: string } | { error: string }>}
 */
async function screenshotItem(
  page: Page,
  item: FeedItem,
  outDir: string,
  cfg: Config,
): Promise<{ file: string } | { error: string }> {
  const baseName = slugify(item.name || hostnameFromUrl(item.url));
  const filePath = resolve(outDir, `${baseName}.jpg`);
  try {
    await page.setViewportSize({ height: 1000, width: 2000 });
    page.setDefaultNavigationTimeout(cfg.navTimeout);

    // Emulate media at the page level too, for good measure.
    if (cfg.colorScheme === 'dark' || cfg.colorScheme === 'light') {
      await page.emulateMedia({ colorScheme: cfg.colorScheme });
    } else {
      // no-preference
      await page.emulateMedia({ colorScheme: undefined });
    }

    await page.goto(item.url, { waitUntil: cfg.waitUntil });
    if (cfg.delay > 0) await page.waitForTimeout(cfg.delay);

    await page.screenshot({
      fullPage: false,
      path: filePath,
      quality: 100,
      type: 'jpeg',
    });
    return { file: filePath };
  } catch (err) {
    return {
      error: `Failed for ${item.url} (${item.name}): ${(err as Error).message}`,
    };
  }
}

/** Main entry */
async function main() {
  const cfg = parseArgs(process.argv.slice(2));
  const started = Date.now();

  await loadDotEnv();

  if (cfg.verbose) console.log(`Config: ${JSON.stringify(cfg, null, 2)}`);

  // Load items
  let items: FeedItem[];
  try {
    items = await loadBlogroll(cfg.input, cfg.verbose);
  } catch (err) {
    fail((err as Error).message);
    return;
  }

  if (cfg.verbose) console.log(`Loaded ${items.length} item(s).`);
  await ensureDir(cfg.outDir);

  if (cfg.dryRun) {
    for (const it of items) {
      const name = slugify(it.name || hostnameFromUrl(it.url));
      console.log(
        `[dry-run] Would screenshot ${it.url} -> ${resolve(cfg.outDir, `${name}.jpg`)}`,
      );
    }
    console.log('Dry run complete.');
    return;
  }

  // Browser setup
  const browser: Browser = await chromium.launch();
  const context: BrowserContext = await chromium.launchPersistentContext('', {
    // This signals CSS media query prefers-color-scheme to the page.
    colorScheme:
      cfg.colorScheme === 'no-preference'
        ? undefined
        : (cfg.colorScheme as ColorScheme),
    deviceScaleFactor: 1,
    // Provide a client hint header for servers that use it (best effort).
    extraHTTPHeaders: {
      // Servers must opt-in with Accept-CH; still harmless to send.
      'Sec-CH-Prefers-Color-Scheme':
        cfg.colorScheme === 'no-preference'
          ? '"light"'
          : `"${cfg.colorScheme}"`,
    },
    headless: true,
    javaScriptEnabled: true,
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
    viewport: { height: 1000, width: 2000 },
  });

  const errors: string[] = [];
  let done = 0;

  try {
    await runWithConcurrency(items, cfg.concurrency, async (item, index) => {
      const page = await context.newPage();

      if (cfg.verbose)
        console.log(
          `[${index + 1}/${items.length}] ${item.name} -> ${item.url}`,
        );
      try {
        const res = await screenshotItem(page, item, cfg.outDir, cfg);
        if ('error' in res) {
          errors.push(res.error);
          console.error(res.error);
        } else if (cfg.verbose) {
          console.log(`Saved: ${res.file}`);
        }
        done++;
      } catch (e) {
        const msg = `Unexpected error for ${item.url}: ${(e as Error).message}`;
        errors.push(msg);
        console.error(msg);
      } finally {
        await page.close({ runBeforeUnload: true });
      }
    });
  } finally {
    await context.close();
    await browser.close();
  }

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(
    `Finished ${done}/${items.length} in ${elapsed}s. ${errors.length} error(s).`,
  );

  if (errors.length) {
    process.exitCode = 1;
  }
}

/**
 * Load .env from cwd and home (cwd has priority). Silent if missing.
 * @returns {Promise<void>}
 */
async function loadDotEnv(): Promise<void> {
  const { config } = await import('dotenv');
  const cwdEnv = resolve(process.cwd(), '.env');
  const homeEnv = process.env.HOME
    ? resolve(process.env.HOME, '.env')
    : undefined;

  if (homeEnv && (await exists(homeEnv)))
    config({ override: false, path: homeEnv });
  if (await exists(cwdEnv)) config({ override: true, path: cwdEnv });
}

/**
 * Check if a path exists
 * @param {string} p
 * @returns {Promise<boolean>}
 */
async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch (e) {
    return false;
  }
}

// Execute only when run directly
const isMain =
  fileURLToPath(import.meta.url) ===
  resolve(process.cwd(), process.argv[1] || '');
if (isMain) {
  main().catch((err) => {
    console.error(`Fatal: ${(err as Error).message}`);
    process.exit(1);
  });
}
