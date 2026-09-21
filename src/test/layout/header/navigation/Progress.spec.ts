import { test, expect } from '@playwright/test';
import { splitCommaList, getMotionStyles } from '../../../support/motion.ts';

test.describe('Reading progress bar reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('fill has no catch-up transition', async ({ page }) => {
    await page.goto('/');

    const styles = await getMotionStyles(page.locator('.progress-fill'));
    expect(styles.transitionDuration).toBe('0s');
  });

  test('still tracks scroll position via the JS-updated value', async ({
    page,
  }) => {
    await page.goto('/');

    const bar = page.locator('[data-reading-progress]');
    await expect(bar).toHaveAttribute('aria-valuenow', '0');

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(150);

    const valueNow = Number(await bar.getAttribute('aria-valuenow'));
    expect(valueNow).toBeGreaterThan(90);
  });
});

test.describe('Reading progress bar with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('fill keeps its lagging catch-up transition', async ({ page }) => {
    await page.goto('/');

    const styles = await getMotionStyles(page.locator('.progress-fill'));
    // The scroll-linked fill also transitions its leading corner's
    // border-radius (unrelated to reduced motion) - only the first entry,
    // matching --progress-bar-transition, is what this is asserting on.
    expect(splitCommaList(styles.transitionDuration)[0]).toBe('0.6s');
  });
});
