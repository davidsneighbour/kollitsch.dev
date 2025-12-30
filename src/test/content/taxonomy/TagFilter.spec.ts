import { test, expect } from '@playwright/test';

test('TagFilter filters tag list based on input', async ({ page }) => {
  await page.goto('/test/content/taxonomy/tagfilter/');

  const input = page.getByPlaceholder('Filter tags...');
  await expect(input).toBeVisible();

  // Initially all links are visible
  const apple = page.getByRole('link', { name: 'Apple' });
  const banana = page.getByRole('link', { name: 'Banana' });
  const cherry = page.getByRole('link', { name: 'Cherry' });

  await expect(apple).toBeVisible();
  await expect(banana).toBeVisible();
  await expect(cherry).toBeVisible();

  // Type 'ban' to filter to Banana
  await input.fill('ban');

  await expect(banana).toBeVisible();
  await expect(apple).toBeHidden();
  await expect(cherry).toBeHidden();
});
