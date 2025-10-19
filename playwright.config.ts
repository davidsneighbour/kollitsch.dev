import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const homeEnvPath = process.env.HOME
  ? path.resolve(process.env.HOME, '.env')
  : undefined;

if (homeEnvPath) {
  try {
    process.loadEnvFile(homeEnvPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
}

const projectEnvPath = path.resolve(__dirname, '.env');

try {
  process.loadEnvFile(projectEnvPath);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
    console.info(`Note: no .env found at ${projectEnvPath}`);
  } else {
    throw error;
  }
}

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  outputDir: 'src/test/logs/playwright',

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],

  reporter: process.env.CI
    ? 'github'
    : [
        ['list'],
        ['json', { outputFile: 'src/test/logs/test-results.json' }],
        [
          'html',
          {
            open: 'on-failure',
            outputFolder: 'src/test/logs/playwright-report',
          },
        ],
      ],
  retries: process.env.CI ? 2 : 0,
  testDir: 'src/test',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4321',
    colorScheme: 'dark',
    ignoreHTTPSErrors: true,
    locale: 'en-US',
    screenshot: 'only-on-failure',
    serviceWorkers: 'allow',
    timezoneId: 'Asia/Bangkok',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    viewport: { height: 720, width: 1280 },
  },

  webServer: {
    command: 'npm run preview',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: 'http://localhost:4321/',
  },
  workers: process.env.CI ? 1 : 16,
});
