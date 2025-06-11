import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: 'src/test',
  outputDir: 'logs/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 16,

  reporter: process.env.CI
    ? 'github'
    : [
        ['list'],
        ['json', { outputFile: 'logs/test-results.json' }],
        [
          'html',
          { open: 'on-failure', outputFolder: 'logs/playwright-report' },
        ],
      ],

  use: {
    baseURL: 'http://localhost:4321/',
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    colorScheme: 'dark',
    screenshot: 'only-on-failure',
    serviceWorkers: 'allow',
    video: 'retain-on-failure',
    locale: 'en-US',
    timezoneId: 'Asia/Bangkok',
    viewport: { width: 1280, height: 720 },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321/',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
