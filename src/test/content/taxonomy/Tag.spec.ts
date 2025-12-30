import { test, expect } from '@playwright/test';

test('renders tag links with correct attributes', async ({ page }) => {
  await page.goto('/test/content/taxonomy/tag/');

  const link = page.getByRole('link', { name: 'Test Tag' });
  await expect(link).toBeVisible();
  const href = await link.getAttribute('href');
  expect(href && href.endsWith('/tags/test/')).toBe(true);
  expect(await link.getAttribute('data-label')).toBe('test');

  const another = page.getByRole('link', { name: 'Another Tag' });
  await expect(another).toBeVisible();
  const href2 = await another.getAttribute('href');
  expect(href2 && href2.endsWith('/tags/another/')).toBe(true);
  expect(await another.getAttribute('data-label')).toBe('another');
});
