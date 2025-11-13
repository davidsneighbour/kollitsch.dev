import { expect, test } from '@playwright/test';

test.describe('Live site smoke tests', () => {
  test('robots.txt is available and contains expected directives', async ({ request, baseURL }) => {
    expect(baseURL, 'A baseURL must be configured for live site tests').toBeTruthy();

    const response = await request.get('robots.txt');
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toMatch(/User-agent:\s*\*/i);
    expect(body).toMatch(/Sitemap:\s*https?:\/\//i);
  });

  test('homepage loads without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: Error[] = [];

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    page.on('pageerror', (error) => {
      pageErrors.push(error);
    });

    const response = await page.goto('/', { waitUntil: 'networkidle' });
    expect(response?.ok(), 'Homepage should respond with a successful status code').toBeTruthy();

    expect(consoleErrors, 'No console errors should be emitted on load').toHaveLength(0);
    expect(pageErrors, 'No uncaught errors should be thrown on load').toHaveLength(0);
  });

  test('Matomo analytics is initialised on the homepage', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const matomoReady = await page.waitForFunction(
      () => {
        const matomoWindow = window as Window & { _paq?: unknown };
        return (
          Array.isArray(matomoWindow._paq) &&
          typeof matomoWindow._paq.push === 'function' &&
          matomoWindow._paq.length > 0
        );
      },
      undefined,
      { timeout: 5_000 },
    );

    expect(matomoReady, 'Matomo should expose the _paq queue on window').toBeTruthy();
  });
});
