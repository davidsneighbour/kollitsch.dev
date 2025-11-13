import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import baseConfig from './playwright.config';
import { defineConfig } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const astroConfigPath = path.resolve(__dirname, 'astro.config.ts');

let inferredSiteUrl: string | undefined;

try {
  const astroConfigSource = fs.readFileSync(astroConfigPath, 'utf-8');
  const siteMatch = astroConfigSource.match(/\bsite:\s*['\"]([^'\"]+)['\"]/);
  inferredSiteUrl = siteMatch?.[1];
} catch (error) {
  console.warn(`Unable to read astro.config.ts for site URL inference: ${(error as Error).message}`);
}

const siteUrl = process.env.PLAYWRIGHT_LIVE_BASE_URL ?? inferredSiteUrl;

if (!siteUrl) {
  throw new Error(
    'Live Playwright tests require a site URL. Set PLAYWRIGHT_LIVE_BASE_URL or configure `site` in astro.config.ts.',
  );
}

export default defineConfig({
  ...baseConfig,
  outputDir: 'src/test/logs/playwright-live',
  testDir: 'src/test/live',
  use: {
    ...baseConfig.use,
    baseURL: siteUrl,
  },
  webServer: undefined,
});
