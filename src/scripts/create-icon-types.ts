import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, extname, join } from 'node:path';

const require = createRequire(import.meta.url);

const ICON_DIR = './src/icons';
const OUTPUT_FILE = './src/utils/icon-names.ts';

// Resolve bootstrap-icons package root
function resolveBootstrapIconsDir(): string {
  const pkgPath = require.resolve('bootstrap-icons/package.json');
  const pkgDir = dirname(pkgPath);
  return join(pkgDir, 'icons');
}

/**
 * Copy SVGs from bootstrap-icons into ICON_DIR, skipping unchanged files.
 * Returns number of files actually copied.
 */
function copyBootstrapIcons(): number {
  const SRC_ICONS = resolveBootstrapIconsDir();

  if (!existsSync(ICON_DIR)) {
    mkdirSync(ICON_DIR, { recursive: true });
  }

  const iconFiles = readdirSync(SRC_ICONS, { withFileTypes: true }).filter(
    (f) => f.isFile() && extname(f.name) === '.svg',
  );

  let copied = 0;

  for (const file of iconFiles) {
    const src = join(SRC_ICONS, file.name);
    const dest = join(ICON_DIR, file.name);

    try {
      // Skip if destination exists and is up-to-date
      if (existsSync(dest)) {
        const s = statSync(src);
        const d = statSync(dest);
        if (d.mtimeMs >= s.mtimeMs && d.size === s.size) {
          continue;
        }
      }
      cpSync(src, dest); // cpSync overwrites by default
      copied++;
    } catch (err) {
      console.error(
        `Failed to copy ${file.name}:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  console.log(
    `Checked ${iconFiles.length} icons, copied ${copied} → ${ICON_DIR}`,
  );
  return copied;
}

function kebabSafe(name: string): boolean {
  return /^[a-z0-9-]+$/.test(name);
}

/**
 * Generate a narrow type and a constant list of available icon names.
 */
function generateIconTypes(): void {
  const files = readdirSync(ICON_DIR, { withFileTypes: true })
    .filter((f) => f.isFile() && extname(f.name) === '.svg')
    .map((f) => basename(f.name, '.svg'))
    .filter(kebabSafe)
    .sort((a, b) => a.localeCompare(b));

  const typeUnion = files.map((name) => `  | '${name}'`).join('\n');
  const constArray = files.map((name) => `  '${name}',`).join('\n');

  const output = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
export type IconName =
${typeUnion};

export const iconNames: IconName[] = [
${constArray}
];
`;

  writeFileSync(OUTPUT_FILE, output);
  console.log(`Generated ${files.length} icon types → ${OUTPUT_FILE}`);
}

function main(): void {
  try {
    copyBootstrapIcons();
    generateIconTypes();
  } catch (err) {
    console.error(
      'icons-sync failed:',
      err instanceof Error ? (err.stack ?? err.message) : err,
    );
    process.exit(1);
  }
}

main();
