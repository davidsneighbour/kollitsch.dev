import { expect, test } from '@playwright/test';

// Pagefind's index is only built during `astro build` (see pagefindIntegration in
// build-hooks.ts), so this must run as a live test against a built/deployed site,
// not the local dev server.
test('Pagefind search overlay opens and returns results', async ({ page }) => {
  await page.goto('/find/');

  const searchInput = page.locator('.pagefind-ui__search-input');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('astro');

  const results = page.locator('.pagefind-ui__result');
  await expect(results.first()).toBeVisible({ timeout: 10_000 });
  expect(await results.count()).toBeGreaterThan(0);
});
