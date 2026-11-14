/**
 * Builds the Pagefind search index for a finished static site.
 *
 * Used by `npm run build:pagefind` (`build-pagefind.ts`), which
 * `npm run build` runs after the prune steps, so the index never lists pages
 * that are removed from `dist` (`dist/test/`, `dist/prototypes/`).
 *
 * The index is cached in `.cache/pagefind/`, keyed by a hash of every
 * rendered HTML file. Pagefind's own output is not byte-identical across
 * runs even when the indexed content is unchanged (internal term ordering
 * depends on file read order), so hashing the input is more reliable than
 * comparing Pagefind's output.
 */

import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import fg from 'fast-glob';
import { close, createIndex, type PagefindServiceConfig } from 'pagefind';

export interface PagefindLogger {
  info: (message: string) => void;
  error: (message: string) => void;
}

export interface BuildPagefindIndexOptions {
  /** Directory with the built site, for example `dist`. */
  siteDir: string;
  /** Cache directory. Defaults to `.cache/pagefind` in the working directory. */
  cacheDir?: string;
  /** Ignore the cache and index again. */
  force?: boolean;
  /** Passed to Pagefind's `createIndex`. */
  indexConfig?: PagefindServiceConfig;
  logger?: PagefindLogger;
}

export interface BuildPagefindIndexResult {
  status: 'indexed' | 'cached';
  outputPath: string;
  /** Number of indexed pages; `undefined` when the cache was reused. */
  pageCount?: number;
}

const consoleLogger: PagefindLogger = {
  error: (message) => console.error(message),
  info: (message) => console.log(message),
};

/** Sorted, site-relative paths of every HTML file in `siteDir`. */
export async function listHtmlFiles(siteDir: string): Promise<string[]> {
  const files = await fg('**/*.html', {
    cwd: siteDir,
    ignore: ['pagefind/**'],
    onlyFiles: true,
  });
  return files.sort();
}

/** Hash of the paths and contents of every HTML file in `siteDir`. */
export async function hashHtmlFiles(siteDir: string): Promise<string> {
  const hash = createHash('sha256');
  for (const file of await listHtmlFiles(siteDir)) {
    hash.update(file);
    hash.update(await readFile(path.join(siteDir, file)));
  }
  return hash.digest('hex');
}

async function exists(target: string): Promise<boolean> {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
}

async function readCachedHash(hashFile: string): Promise<string | undefined> {
  try {
    return (await readFile(hashFile, 'utf8')).trim();
  } catch {
    return undefined;
  }
}

/**
 * Index `siteDir` and write the result to `<siteDir>/pagefind/`. Reuses the
 * cached index when no HTML file changed, unless `force` is set. Throws when
 * the site directory has no HTML files or Pagefind reports an error.
 */
export async function buildPagefindIndex({
  siteDir,
  cacheDir = path.join(process.cwd(), '.cache', 'pagefind'),
  force = false,
  indexConfig,
  logger = consoleLogger,
}: BuildPagefindIndexOptions): Promise<BuildPagefindIndexResult> {
  const htmlFiles = await listHtmlFiles(siteDir).catch(() => []);
  if (htmlFiles.length === 0) {
    throw new Error(
      `No HTML files in ${siteDir}. Build the site first (npm run build).`,
    );
  }

  const outputPath = path.join(siteDir, 'pagefind');
  const cacheOutputDir = path.join(cacheDir, 'output');
  const hashFile = path.join(cacheDir, 'content-hash.txt');
  const contentHash = await hashHtmlFiles(siteDir);

  if (
    !force &&
    (await readCachedHash(hashFile)) === contentHash &&
    (await exists(cacheOutputDir))
  ) {
    await rm(outputPath, { force: true, recursive: true });
    await cp(cacheOutputDir, outputPath, { recursive: true });
    logger.info(
      `Pagefind: HTML unchanged since the last index, reused the cached index in ${outputPath}`,
    );
    return { outputPath, status: 'cached' };
  }

  try {
    const { index, errors: createErrors } = await createIndex(indexConfig);
    if (!index) {
      throw new Error(`Pagefind failed to create an index: ${createErrors.join('; ')}`);
    }

    const { page_count: pageCount, errors: addErrors } = await index.addDirectory({
      path: siteDir,
    });
    if (addErrors.length > 0) {
      throw new Error(`Pagefind failed to index ${siteDir}: ${addErrors.join('; ')}`);
    }
    logger.info(`Pagefind: indexed ${pageCount} pages`);

    await rm(outputPath, { force: true, recursive: true });
    const { errors: writeErrors } = await index.writeFiles({ outputPath });
    if (writeErrors.length > 0) {
      throw new Error(`Pagefind failed to write ${outputPath}: ${writeErrors.join('; ')}`);
    }
    logger.info(`Pagefind: wrote the index to ${outputPath}`);

    await mkdir(cacheDir, { recursive: true });
    await rm(cacheOutputDir, { force: true, recursive: true });
    await cp(outputPath, cacheOutputDir, { recursive: true });
    await writeFile(hashFile, contentHash);

    return { outputPath, pageCount, status: 'indexed' };
  } finally {
    // Stop Pagefind's backend process so a CLI run can exit.
    await close();
  }
}
