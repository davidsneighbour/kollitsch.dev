import { test, expect } from '@playwright/test';
import { getMotionStyles } from '../../../support/motion.ts';

// These properties are declared unconditionally in CSS (they don't depend on
// scroll position), so they can be asserted right after load without having
// to actually scroll the header's `animation-timeline: view()` sequence.

test.describe('SiteTitle scroll-exit reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('disables the whole-header exit animation', async ({ page }) => {
    await page.goto('/');

    const styles = await getMotionStyles(page.locator('.site-title-hero'));
    expect(styles.animationName).toBe('none');
  });

  test('disables the text-fill dissolve and forces the blur layer hidden', async ({
    page,
  }) => {
    await page.goto('/');

    const sharp = await getMotionStyles(page.locator('.site-title-fill-sharp'));
    expect(sharp.animationName).toBe('none');

    const blur = await getMotionStyles(page.locator('.site-title-fill-blur'));
    expect(blur.opacity).toBe('0');
  });

  test('hides the letter-shatter layer entirely', async ({ page }) => {
    await page.goto('/');

    const shatter = page.locator('.site-title-shatter');
    await expect(shatter).toBeHidden();

    const styles = await shatter.evaluate((element) => {
      const computed = getComputedStyle(element);
      return { animationName: computed.animationName, display: computed.display };
    });
    expect(styles.animationName).toBe('none');
    expect(styles.display).toBe('none');
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

  test('dissolves the sharp text-fill into the pre-blurred duplicate', async ({
    page,
  }) => {
    await page.goto('/');

    const sharp = await getMotionStyles(page.locator('.site-title-fill-sharp'));
    expect(sharp.animationName).toBe('site-title-fill-dissolve');

    const blur = await getMotionStyles(page.locator('.site-title-fill-blur'));
    expect(blur.animationName).toBe('site-title-fill-blur-fade');
  });

  test('shatters letters outward on their own scroll-driven ranges', async ({
    page,
  }) => {
    await page.goto('/');

    const shatter = await getMotionStyles(page.locator('.site-title-shatter'));
    expect(shatter.animationName).toBe('site-title-shatter-in');

    const letter = await getMotionStyles(
      page.locator('.shatter-letter').first(),
    );
    expect(letter.animationName).toBe('shatter-letter-fly');
  });
});
