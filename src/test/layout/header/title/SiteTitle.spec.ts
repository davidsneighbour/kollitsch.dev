import { test, expect } from '@playwright/test';
import { getMotionStyles } from '../../../support/motion.ts';

// These properties are declared unconditionally in CSS (they don't depend on
// scroll position), so they can be asserted right after load without having
// to actually scroll the header's `animation-timeline: view()` sequence.

test.describe('SiteTitle brand logo', () => {
  test('renders the combination mark as one accessible image', async ({
    page,
  }) => {
    await page.goto('/');

    const logo = page.locator('.site-title-hero svg.site-title-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('role', 'img');
    await expect(logo).toHaveAttribute('aria-label', 'KOLLITSCH.dev');
    await expect(logo.locator('#iconmark')).toHaveCount(1);
    await expect(logo.locator('#wordmark')).toHaveCount(1);
  });
});

test.describe('SiteTitle scroll-exit reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('disables the whole-header exit animation', async ({ page }) => {
    await page.goto('/');

    const styles = await getMotionStyles(page.locator('.site-title-hero'));
    expect(styles.animationName).toBe('none');
  });
});

test.describe('SiteTitle scroll-exit with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('drives the whole-header exit with a scroll-linked animation', async ({
    page,
  }) => {
    await page.goto('/');

    const styles = await getMotionStyles(page.locator('.site-title-hero'));
    expect(styles.animationName).toBe('site-title-exit');
  });
});
