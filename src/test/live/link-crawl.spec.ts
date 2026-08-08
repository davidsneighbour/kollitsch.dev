import { expect, test } from '@playwright/test';

// Scoped to internal (same-origin) links only. External links (social profiles,
// the Static.Quest web ring, etc.) are third-party dependencies outside this
// site's control and are intentionally not checked here.
test('primary navigation and footer links resolve without 4xx/5xx', async ({ page, request }) => {
  await page.goto('/');

  const navLinks = page.locator('nav[aria-label="Main navigation"] a[href]');
  const footerLinks = page.locator('[aria-label="Site navigation links"] a[href]');

  const hrefs = new Set<string>();
  for (const locator of [navLinks, footerLinks]) {
    const count = await locator.count();
    for (let i = 0; i < count; i++) {
      const href = await locator.nth(i).getAttribute('href');
      if (href?.startsWith('/') && !href.startsWith('//')) {
        hrefs.add(href);
      }
    }
  }

  expect(hrefs.size, 'expected at least one internal nav/footer link to check').toBeGreaterThan(0);

  const failures: string[] = [];
  for (const href of hrefs) {
    const response = await request.get(href);
    if (response.status() >= 400) {
      failures.push(`${href} -> ${response.status()}`);
    }
  }

  expect(failures, `internal links returning 4xx/5xx:\n${failures.join('\n')}`).toHaveLength(0);
});
