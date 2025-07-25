import { readdirSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const ICON_DIR = './src/assets/icons';
const OUTPUT_FILE = './src/utils/icon-names.ts';

function kebabSafe(name: string): boolean {
  return /^[a-z0-9-]+$/.test(name);
}

const files = readdirSync(ICON_DIR, { withFileTypes: true })
  .filter((f) => f.isFile() && extname(f.name) === '.svg')
  .map((f) => basename(f.name, '.svg'))
  .filter(kebabSafe);

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
console.log(`✅ Generated ${files.length} icon types → ${OUTPUT_FILE}`);
