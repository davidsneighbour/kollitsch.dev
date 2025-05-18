import { expect, test } from '@playwright/test';

test(
  'has working redirects',
  {
    tag: ['@hugo-module', '@netlification'],
  },
  async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');

    // Check if the title is correct
    const title = await page.title();
    expect(title).not.toBe('');
    // Check if the page contains the expected text
    const content = await page.textContent('body');
    expect(content).not.toBeNull();
    expect(content).not.toBe('');
    // Check if the page contains the expected element
    const element = await page.$('h1');
    expect(element).not.toBeNull();
  },
);
