import { access, readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

interface AssetRecord {
  path: string;
  size: number;
}

interface CheckFailure {
  label: string;
  detail: string;
}

const distDir = join(process.cwd(), 'dist');
const maxFreeFiles = 20_000;
const maxPaidFiles = 100_000;
const warnFileRatio = 0.8;
const maxAssetSize = 25 * 1024 * 1024;
const maxHeaderRules = 100;
const maxHeaderLineLength = 2_000;
const maxRedirectLineLength = 1_000;
const maxStaticRedirects = 2_000;
const maxDynamicRedirects = 100;

async function walk(dir: string): Promise<AssetRecord[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const records = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) {
        return walk(path);
      }

      if (!entry.isFile()) {
        return [];
      }

      const info = await stat(path);

      return [
        {
          path,
          size: info.size,
        },
      ];
    }),
  );

  return records.flat();
}

async function countDirectories(dir: string): Promise<number> {
  const entries = await readdir(dir, { withFileTypes: true });
  const childCounts = await Promise.all(
    entries.map(async (entry) => {
      if (!entry.isDirectory()) {
        return 0;
      }

      return 1 + (await countDirectories(join(dir, entry.name)));
    }),
  );

  return childCounts.reduce((sum, count) => sum + count, 0);
}

function formatBytes(value: number): string {
  const units = ['B', 'KiB', 'MiB', 'GiB'];
  let size = value;
  let unit = 0;

  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }

  return `${size.toFixed(unit === 0 ? 0 : 2)} ${units[unit]}`;
}

function isHeaderRule(line: string): boolean {
  return Boolean(line.trim()) && !line.startsWith(' ') && !line.startsWith('\t') && !line.trimStart().startsWith('#');
}

function parseRedirectLine(line: string): { dynamic: boolean } | undefined {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith('#')) {
    return undefined;
  }

  const [from] = trimmed.split(/\s+/);

  if (!from) {
    return undefined;
  }

  return {
    dynamic: from.includes(':') || from.includes('*'),
  };
}

async function readOptionalText(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return undefined;
    }

    throw error;
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main(): Promise<void> {
  const failures: CheckFailure[] = [];
  const warnings: string[] = [];

  if (!(await pathExists(distDir))) {
    console.error(`Failure (build output): ${relative(process.cwd(), distDir)} does not exist. Run the build first.`);
    process.exitCode = 1;
    return;
  }

  if (!(await pathExists(join(distDir, 'index.html')))) {
    failures.push({
      label: 'root document',
      detail: 'dist/index.html is missing.',
    });
  }

  if (!(await pathExists(join(distDir, '404.html')))) {
    failures.push({
      label: '404 page',
      detail: 'dist/404.html is missing; Cloudflare not_found_handling expects a custom 404 page.',
    });
  }

  const assets = await walk(distDir);
  const directoryCount = await countDirectories(distDir);
  const uploadEntryCount = assets.length + directoryCount;
  const totalSize = assets.reduce((sum, record) => sum + record.size, 0);
  const largest = [...assets].sort((a, b) => b.size - a.size)[0];

  if (uploadEntryCount > maxFreeFiles) {
    failures.push({
      label: 'file count',
      detail: `${uploadEntryCount} upload entries exceed the Cloudflare Workers free limit of ${maxFreeFiles}.`,
    });
  } else if (uploadEntryCount >= maxFreeFiles * warnFileRatio) {
    warnings.push(
      `${uploadEntryCount} upload entries use at least ${warnFileRatio * 100}% of the Workers free file limit.`,
    );
  }

  if (uploadEntryCount > maxPaidFiles) {
    failures.push({
      label: 'paid file count',
      detail: `${uploadEntryCount} upload entries exceed the Cloudflare Workers paid limit of ${maxPaidFiles}.`,
    });
  }

  for (const record of assets.filter((asset) => asset.size > maxAssetSize)) {
    failures.push({
      label: 'asset size',
      detail: `${relative(distDir, record.path)} is ${formatBytes(record.size)}, above the 25 MiB static asset limit.`,
    });
  }

  const headers = await readOptionalText(join(distDir, '_headers'));
  if (headers) {
    const lines = headers.split(/\r?\n/);
    const rules = lines.filter(isHeaderRule);
    const tooLong = lines.find((line) => line.length > maxHeaderLineLength);

    if (rules.length > maxHeaderRules) {
      failures.push({
        label: 'header rules',
        detail: `dist/_headers contains ${rules.length} rules; Cloudflare Workers Static Assets supports ${maxHeaderRules}.`,
      });
    }

    if (tooLong) {
      failures.push({
        label: 'header line length',
        detail: `dist/_headers contains a line with ${tooLong.length} characters; Cloudflare supports ${maxHeaderLineLength}.`,
      });
    }
  }

  const redirects = await readOptionalText(join(distDir, '_redirects'));
  if (redirects) {
    const lines = redirects.split(/\r?\n/);
    const parsed = lines.map(parseRedirectLine).filter((line): line is { dynamic: boolean } => Boolean(line));
    const dynamicCount = parsed.filter((line) => line.dynamic).length;
    const staticCount = parsed.length - dynamicCount;
    const tooLong = lines.find((line) => line.length > maxRedirectLineLength);

    if (staticCount > maxStaticRedirects) {
      failures.push({
        label: 'static redirects',
        detail: `dist/_redirects contains ${staticCount} static redirects; Cloudflare supports ${maxStaticRedirects}.`,
      });
    }

    if (dynamicCount > maxDynamicRedirects) {
      failures.push({
        label: 'dynamic redirects',
        detail: `dist/_redirects contains ${dynamicCount} dynamic redirects; Cloudflare supports ${maxDynamicRedirects}.`,
      });
    }

    if (tooLong) {
      failures.push({
        label: 'redirect line length',
        detail: `dist/_redirects contains a line with ${tooLong.length} characters; Cloudflare supports ${maxRedirectLineLength}.`,
      });
    }
  }

  console.log('Cloudflare Workers Static Assets preflight');
  console.log(`Regular files: ${assets.length}`);
  console.log(`Directories: ${directoryCount}`);
  console.log(`Wrangler upload entries: ${uploadEntryCount}`);
  console.log(`Total size: ${formatBytes(totalSize)}`);

  if (largest) {
    console.log(`Largest asset: ${relative(distDir, largest.path)} (${formatBytes(largest.size)})`);
  }

  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`);
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`Failure (${failure.label}): ${failure.detail}`);
    }

    process.exitCode = 1;
  }
}

await main();
