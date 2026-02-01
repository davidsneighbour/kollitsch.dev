import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, join } from 'node:path';

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

/**
 * Generate a narrow type and a constant list of available icon names.
 */
function generateIconTypes(): void {
  const output = `// AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
import biIcons from '@iconify-json/bi/icons.json' with { type: 'json' };
import lucideIcons from '@iconify-json/lucide/icons.json' with { type: 'json' };

export type BootstrapIconName = keyof typeof biIcons.icons;
export type LucideIconName = keyof typeof lucideIcons.icons;
export type IconName = BootstrapIconName | \`lucide:\${LucideIconName}\`;

const bootstrapIconNames = Object.keys(biIcons.icons) as BootstrapIconName[];
const lucideIconNames = Object.keys(lucideIcons.icons) as LucideIconName[];

export const iconNames: IconName[] = [
  ...bootstrapIconNames,
  ...lucideIconNames.map((name) => \`lucide:\${name}\` as IconName),
];
`;

  writeFileSync(OUTPUT_FILE, output);
  console.log(`Generated icon types → ${OUTPUT_FILE}`);
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
