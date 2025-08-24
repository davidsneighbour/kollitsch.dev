// scripts/screenshot-blogroll.ts
// Node 22+, ESM, TypeScript. Playwright-based website screenshots for a blogroll.
// - Reads a JSON array like src/content/blogroll.json
// - Validates with Zod (url/name required; rss/description optional)
// - Screenshots each `url` at 2000x1000 into src/assets/images/blogroll/*.jpg (quality 100)
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
//   --dry-run                Do not open browser or write files; just print planned actions
//   --verbose                Verbose logging
//   --help                   Show help
//
// Prereqs:
//   npm i -D playwright zod
//   npx playwright install chromium
//
// Notes:
// - Filenames are slugified from the item name (or hostname fallback).
// - Viewport is exact 2000x1000 (no fullPage).
// - Continues on errors and reports a final summary.

import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import { promises as fs } from "node:fs";
import { mkdir, stat, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { z } from "zod";

/** CLI configuration */
interface Config {
  input: string;
  outDir: string;
  concurrency: number;
  timeout: number;
  navTimeout: number;
  waitUntil: "load" | "domcontentloaded" | "networkidle" | "commit";
  delay: number;
  dryRun: boolean;
  verbose: boolean;
}

/** Blogroll item schema (url + name required; rss/description optional) */
const FeedItemSchema = z
  .object({
    url: z.string().url({ message: "url must be a valid URL" }),
    rss: z.string().url().optional(),
    name: z.string().min(1, "name is required").max(56, "name max length is 56"),
    description: z.string().optional(),
  })
  .strict();

const FeedListSchema = z.array(FeedItemSchema);

type FeedItem = z.infer<typeof FeedItemSchema>;

/** Default configuration */
function defaultConfig(): Config {
  return {
    input: "src/content/blogroll.json",
    outDir: "src/assets/images/blogroll",
    concurrency: 4,
    timeout: 45_000,
    navTimeout: 30_000,
    waitUntil: "networkidle",
    delay: 500,
    dryRun: false,
    verbose: false,
  };
}

/** Parse CLI flags into config */
function parseArgs(argv: string[]): Config {
  const cfg = defaultConfig();
  const args = [...argv];

  while (args.length) {
    const arg = args.shift()!;
    switch (arg) {
      case "--help":
        printHelpAndExit();
        break;
      case "--input":
        cfg.input = mustArgValue("--input", args.shift());
        break;
      case "--out-dir":
        cfg.outDir = mustArgValue("--out-dir", args.shift());
        break;
      case "--concurrency":
        cfg.concurrency = toInt("--concurrency", mustArgValue("--concurrency", args.shift()));
        break;
      case "--timeout":
        cfg.timeout = toInt("--timeout", mustArgValue("--timeout", args.shift()));
        break;
      case "--nav-timeout":
        cfg.navTimeout = toInt("--nav-timeout", mustArgValue("--nav-timeout", args.shift()));
        break;
      case "--wait-until": {
        const v = mustArgValue("--wait-until", args.shift());
        if (!["load", "domcontentloaded", "networkidle", "commit"].includes(v)) {
          fail(`Invalid --wait-until value: ${v}`);
        }
        cfg.waitUntil = v as Config["waitUntil"];
        break;
      }
      case "--delay":
        cfg.delay = toInt("--delay", mustArgValue("--delay", args.shift()));
        break;
      case "--dry-run":
        cfg.dryRun = true;
        break;
      case "--verbose":
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
      "Usage: node scripts/screenshot-blogroll.ts [options]",
      "",
      "Options:",
      "  --input <path>           Path to JSON file (default: src/content/blogroll.json)",
      "  --out-dir <path>         Output directory (default: src/assets/images/blogroll)",
      "  --concurrency <n>        Parallel pages (default: 4)",
      "  --timeout <ms>           Per-page overall timeout in ms (default: 45000)",
      "  --nav-timeout <ms>       page.goto timeout in ms (default: 30000)",
      "  --wait-until <state>     load|domcontentloaded|networkidle|commit (default: networkidle)",
      "  --delay <ms>             Extra delay after navigation before screenshot (default: 500)",
      "  --dry-run                Do not open browser or write files; just print planned actions",
      "  --verbose                Verbose logging",
      "  --help                   Show help",
    ].join("\n"),
  );
  process.exit(0);
}

/** Required value helper */
function mustArgValue(flag: string, val?: string): string {
  if (!val) fail(`Missing value for ${flag}`);
  return val;
}

/** Convert numeric flags with validation */
function toInt(flag: string, val: string): number {
  const n = Number.parseInt(val, 10);
  if (!Number.isFinite(n) || n < 0) fail(`Invalid number for ${flag}: ${val}`);
  return n;
}

/** Fail fast with message */
function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

/** Ensure directory exists */
async function ensureDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
  } catch (err) {
    throw new Error(`Unable to create directory ${dir}: ${(err as Error).message}`);
  }
}

/** Read and validate blogroll JSON */
async function loadBlogroll(path: string, verbose: boolean): Promise<FeedItem[]> {
  const abs = resolve(path);
  if (verbose) console.log(`Reading: ${abs}`);
  let raw: string;
  try {
    raw = await readFile(abs, "utf8");
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
    const lines = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    throw new Error(`Validation failed:\n${lines.join("\n")}`);
  }
  // Sort by name ASC
  return [...parsed.data].sort((a, b) => a.name.localeCompare(b.name));
}

/** Slugify a name for filename usage */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/https?:\/\/(www\.)?/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || "site";
}

/** Derive fallback name from URL hostname */
function hostnameFromUrl(urlStr: string): string {
  try {
    return new URL(urlStr).hostname;
  } catch {
    return slugify(urlStr);
  }
}

/** Task queue with bounded concurrency */
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

/** Screenshot one item */
async function screenshotItem(
  page: Page,
  item: FeedItem,
  outDir: string,
  cfg: Config,
): Promise<{ file: string } | { error: string }> {
  const baseName = slugify(item.name || hostnameFromUrl(item.url));
  const filePath = resolve(outDir, `${baseName}.jpg`);
  try {
    await page.setViewportSize({ width: 2000, height: 1000 });
    page.setDefaultNavigationTimeout(cfg.navTimeout);

    await page.goto(item.url, { waitUntil: cfg.waitUntil });
    if (cfg.delay > 0) await page.waitForTimeout(cfg.delay);

    await page.screenshot({
      path: filePath,
      type: "jpeg",
      quality: 100, // highest quality
      fullPage: false,
    });
    return { file: filePath };
  } catch (err) {
    return { error: `Failed for ${item.url} (${item.name}): ${(err as Error).message}` };
  }
}

/** Main entry */
async function main() {
  // Auto-help if required param missing is not necessary because defaults are set,
  // but we keep --help for clarity.

  const cfg = parseArgs(process.argv.slice(2));
  const started = Date.now();

  // Read .env from current dir and home (current has priority)
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
      console.log(`[dry-run] Would screenshot ${it.url} -> ${resolve(cfg.outDir, `${name}.jpg`)}`);
    }
    console.log("Dry run complete.");
    return;
  }

  // Browser setup
  const browser: Browser = await chromium.launch();
  const context: BrowserContext = await browser.newContext({
    viewport: { width: 2000, height: 1000 },
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    javaScriptEnabled: true,
  });

  const errors: string[] = [];
  let done = 0;

  try {
    await runWithConcurrency(
      items,
      cfg.concurrency,
      async (item, index) => {
        const page = await context.newPage();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), cfg.timeout);

        if (cfg.verbose) console.log(`[${index + 1}/${items.length}] ${item.name} -> ${item.url}`);
        try {
          const res = await screenshotItem(page, item, cfg.outDir, cfg);
          if ("error" in res) {
            errors.push(res.error);
            console.error(res.error);
          } else if (cfg.verbose) {
            console.log(`Saved: ${res.file}`);
          }
          done++;
        } finally {
          clearTimeout(timeout);
          await page.close({ runBeforeUnload: true });
        }
      },
    );
  } finally {
    await context.close();
    await browser.close();
  }

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`Finished ${done}/${items.length} in ${elapsed}s. ${errors.length} error(s).`);

  if (errors.length) {
    // Non-zero exit when at least one task failed
    process.exitCode = 1;
  }
}

/** Load .env from cwd and home (cwd has priority). Silent if missing. */
async function loadDotEnv(): Promise<void> {
  const { config } = await import("dotenv");
  const cwdEnv = resolve(process.cwd(), ".env");
  const homeEnv = process.env.HOME ? resolve(process.env.HOME, ".env") : undefined;

  // Load home first, then cwd to allow cwd to override
  if (homeEnv && (await exists(homeEnv))) config({ path: homeEnv, override: false });
  if (await exists(cwdEnv)) config({ path: cwdEnv, override: true });
}

/** Check if a path exists */
async function exists(p: string): Promise<boolean> {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

// Execute only when run directly
const isMain = fileURLToPath(import.meta.url) === resolve(process.cwd(), process.argv[1] || "");
if (isMain) {
  main().catch((err) => {
    console.error(`Fatal: ${(err as Error).message}`);
    process.exit(1);
  });
}
