import { expect, test } from '@playwright/test';

test('renders TestPagesIndex and lists test links', async ({ page }) => {
  await page.goto('/test/test-pages-index/');
  await expect(
    page.getByRole('heading', { name: 'List of all test pages' }),
  ).toBeVisible();

  const list = page.getByRole('list');
  await expect(list).toBeVisible();

  // At least one link should point to a /test/.../ route (trailing slash expected by project)
  const firstLink = page.locator('ul[role="list"] a').first();
  await expect(firstLink).toHaveAttribute('href', /\/test\/.+\/$/);
});
