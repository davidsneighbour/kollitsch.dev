import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tryCreateThemeFromJson, generateTailwindThemeCss, theme } from '../utils/theme.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main(): Promise<void> {
  const outPath = resolve(__dirname, '../styles/theme-setup.css');
  await mkdir(dirname(outPath), { recursive: true });
  const t = await tryCreateThemeFromJson('src/data/theme.json');
  const css = generateTailwindThemeCss(t);
  await writeFile(outPath, `${css}\n`, 'utf8');
  console.log('Wrote', outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
