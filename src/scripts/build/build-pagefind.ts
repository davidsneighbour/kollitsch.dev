#!/usr/bin/env node
/**
 * Build the Pagefind search index for an existing site build.
 *
 * `npm run build` runs this after the prune steps. Run it on its own to
 * restore `dist/pagefind/` after it was deleted, for example for search in
 * the dev server, which serves `/pagefind/` from `dist`.
 *
 * Usage:
 *   node src/scripts/build/build-pagefind.ts [--site=dist] [--force]
 *
 * Options:
 *   --site=<dir>  directory with the built site (default: dist)
 *   --force       ignore the cache in .cache/pagefind and index again
 *   --help        show this help
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPagefindIndex } from './pagefind-index.ts';

export interface CliOptions {
  force: boolean;
  help: boolean;
  siteDir: string;
}

const USAGE = `Usage: node src/scripts/build/build-pagefind.ts [--site=dist] [--force]

  --site=<dir>  directory with the built site (default: dist)
  --force       ignore the cache in .cache/pagefind and index again
  --help        show this help`;

/** Parse CLI arguments. Throws on unknown options or an empty `--site`. */
export function parseArgs(argv: readonly string[], cwd = process.cwd()): CliOptions {
  const options: CliOptions = {
    force: false,
    help: false,
    siteDir: path.resolve(cwd, 'dist'),
  };

  for (const arg of argv) {
    if (arg === '--force') {
      options.force = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg.startsWith('--site=')) {
      const value = arg.slice('--site='.length).trim();
      if (!value) throw new Error('--site needs a directory, for example --site=dist');
      options.siteDir = path.resolve(cwd, value);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

async function main(): Promise<void> {
  let options: CliOptions;
  try {
    options = parseArgs(process.argv.slice(2));
  } catch (error: unknown) {
    console.error(`✖ ${error instanceof Error ? error.message : String(error)}\n\n${USAGE}`);
    process.exit(2);
  }

  if (options.help) {
    console.log(USAGE);
    return;
  }

  const result = await buildPagefindIndex({
    force: options.force,
    siteDir: options.siteDir,
  });
  const detail =
    result.status === 'indexed' ? `${result.pageCount} pages indexed` : 'cache reused';
  console.log(`✔ Pagefind index ready (${detail}).`);
}

function isMainModule(): boolean {
  return process.argv[1] === fileURLToPath(import.meta.url);
}

if (isMainModule()) {
  main().catch((error: unknown) => {
    console.error(`✖ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}
