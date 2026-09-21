import { test, expect } from '@playwright/test';
import { getMotionStyles, isEffectivelyInstant } from '../../../support/motion.ts';

test.describe('Theme toggle sun/moon morph reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('all four transitioning parts collapse to an instant swap', async ({
    page,
  }) => {
    await page.goto('/');

    for (const selector of [
      '.theme-toggle',
      '.theme-toggle-icon',
      '.theme-toggle-rays',
      '.theme-toggle-cutout',
    ]) {
      const styles = await getMotionStyles(page.locator(selector).first());
      expect(isEffectivelyInstant(styles.transitionDuration)).toBe(true);
    }
  });
});

test.describe('Theme toggle sun/moon morph with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('keeps its multi-part coordinated transition durations', async ({
    page,
  }) => {
    await page.goto('/');

    for (const selector of [
      '.theme-toggle',
      '.theme-toggle-icon',
      '.theme-toggle-rays',
      '.theme-toggle-cutout',
    ]) {
      const styles = await getMotionStyles(page.locator(selector).first());
      expect(isEffectivelyInstant(styles.transitionDuration)).toBe(false);
    }
  });
});
