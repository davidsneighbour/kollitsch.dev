import { expect, test } from '@playwright/test';

test(
  'has working redirects',
  {
    tag: ['@hugo-module', '@netlification'],
  },
  async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
  },
);
