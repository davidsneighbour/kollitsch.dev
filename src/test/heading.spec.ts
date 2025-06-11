import { expect, test } from '@playwright/test';

test('renders multiple heading levels correctly', async ({ page }) => {
  await page.goto('/_test/heading/');

  const h2 = page.getByRole('heading', { name: 'Visible H2', exact: true });
  const h5 = page.getByRole('heading', {
    name: 'Visible H5, no description',
    exact: true,
  });
  const h1 = page.getByRole('heading', { name: 'Default H1', exact: true });
  const h1nd = page.getByRole('heading', {
    name: 'Default H1, no description',
    exact: true,
  });
  const h6 = page.getByRole('heading', { name: 'Too High', exact: true });
  const h1min = page.getByRole('heading', { name: 'Too Low', exact: true });

  await expect(h2).toBeVisible();
  await expect(h5).toBeVisible();
  await expect(h1).toBeVisible();
  await expect(h1nd).toBeVisible();
  await expect(h6).toBeVisible();
  await expect(h1min).toBeVisible();
});
