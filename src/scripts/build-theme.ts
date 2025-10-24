import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTailwindThemeCss, theme } from '../utils/theme.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main(): Promise<void> {
  const outPath = resolve(__dirname, '../styles/theme-setup.css');
  await mkdir(dirname(outPath), { recursive: true });
  const css = generateTailwindThemeCss(theme);
  await writeFile(outPath, `${css}\n`, 'utf8');
  console.log('Wrote', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
