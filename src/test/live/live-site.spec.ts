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

    await expect.poll(
      () =>
        page.evaluate(() => {
          const matomoWindow = window as Window & {
            Matomo?: unknown;
            _paq?: unknown[];
          };

          const matomoApi = matomoWindow.Matomo;

          return (
            Array.isArray(matomoWindow._paq) &&
            typeof matomoWindow._paq.push === 'function' &&
            (typeof matomoApi === 'object' || typeof matomoApi === 'function')
          );
        }),
      { timeout: 10_000 },
    ).toBe(true);
  });
});
