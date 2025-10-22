import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

async function loadConfig() {
  const moduleUrl = pathToFileURL(
    path.resolve(process.cwd(), 'biome.config.ts'),
  ).href;
  const { default: config } = (await import(moduleUrl)) as { default: unknown };
  return config;
}

async function main() {
  const config = await loadConfig();
  const outputPath = path.resolve(process.cwd(), 'biome.json');
  const serialized = `${JSON.stringify(config, null, 2)}\n`;
  await writeFile(outputPath, serialized, { encoding: 'utf8' });
}

await main();
