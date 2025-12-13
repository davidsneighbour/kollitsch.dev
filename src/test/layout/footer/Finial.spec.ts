import { test, expect } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

test('Finial renders with title and has aria-hidden attribute', async ({ page }) => {
  const setupPath = path.join(process.cwd(), 'src', 'data', 'setup.json');
  const setup = JSON.parse(await fs.readFile(setupPath, 'utf8'));

  await page.goto('/test/finial/');

  // The Finial component renders a span with the site title; assert it's present.
  const titleLocator = page.getByText(setup.title);
  await expect(titleLocator).toHaveCount(1);

  // The outer wrapper is aria-hidden according to the component.
  const ariaHidden = page.locator('[aria-hidden="true"]');
  await expect(ariaHidden).toContainText(setup.title);
});
