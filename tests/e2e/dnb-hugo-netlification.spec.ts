import { expect, test } from '@playwright/test';

test('has working redirects', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
});
