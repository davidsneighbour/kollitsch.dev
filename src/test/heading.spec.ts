import { expect, test } from '@playwright/test';

test('renders multiple heading levels correctly', async ({ page }) => {
  await page.goto('/test/heading/');

  const h2 = page.getByRole('heading', { exact: true, name: 'Visible H2' });
  const h5 = page.getByRole('heading', {
    exact: true,
    name: 'Visible H5, no description',
  });
  const h1 = page.getByRole('heading', { exact: true, name: 'Default H1' });
  const h1nd = page.getByRole('heading', {
    exact: true,
    name: 'Default H1, no description',
  });
  const h6 = page.getByRole('heading', { exact: true, name: 'Too High' });
  const h1min = page.getByRole('heading', { exact: true, name: 'Too Low' });

  await expect(h2).toBeVisible();
  await expect(h5).toBeVisible();
  await expect(h1).toBeVisible();
  await expect(h1nd).toBeVisible();
  await expect(h6).toBeVisible();
  await expect(h1min).toBeVisible();
});
