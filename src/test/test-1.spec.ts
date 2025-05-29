import { test, expect } from '@playwright/test';

test.describe('Theme Switcher', () => {
  const themeSwitcherSelector = '#themeswitcher';
  const maxClicks = 5;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTitle('Toggles between light and').getByRole('img').click();
  });
  test(`Theme toggles correctly`, async ({ page }) => {
    await page.getByTitle('Toggles between light and').getByRole('img').click();
    // Ensure the theme switcher exists and is visible
    const themeSwitcher = await page.locator(themeSwitcherSelector);
    await expect(themeSwitcher).toBeVisible();

    // Find the clickable element (assumed to be a button or similar)
    const clickableElement = await themeSwitcher.locator('div');
    await expect(clickableElement).toBeVisible();

    for (let i = 0; i < maxClicks; i++) {
      // Get the current theme
      const initialTheme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-bs-theme'),
      );
      expect(initialTheme).toMatch(/^(dark|light)$/);

      // Click the element
      await clickableElement.click();

      // Wait for the theme to change
      await page.waitForTimeout(200); // adjust if the theme change takes time

      // Get the new theme
      const newTheme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-bs-theme'),
      );

      // Validate that the theme toggled
      expect(newTheme).not.toBe(initialTheme);
      console.log(`Theme switched from ${initialTheme} to ${newTheme}`);
    }
  });
});
