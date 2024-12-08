import { defineConfig, devices } from '@playwright/test';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// @see https://playwright.dev/docs/test-configuration
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 16,
  // @see https://playwright.dev/docs/test-reporters
  reporter: process.env.CI
    ? 'github'
    : [
        ['list'],
        ['json', { outputFile: 'test-results.json' }],
        ['html', { open: 'on-failure', outputFile: 'test-results.html' }],
      ],
  // @see https://playwright.dev/docs/api/class-testoptions
  use: {
    baseURL: 'https://localhost:1313',

    // @see https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    colorScheme: 'dark',
    // geolocation: { longitude: 12.492507, latitude: 41.889938 },
    // isMobile: false,
    screenshot: { mode: 'only-on-failure', fullPage: true },
    serviceWorkers: 'allow',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run server',
    url: 'http://localhost:1313',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    // stdout: "ignore",
    stderr: 'pipe',
  },
});
