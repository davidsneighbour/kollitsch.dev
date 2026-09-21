import { test, expect } from '@playwright/test';
import { getMotionStyles } from '../support/motion.ts';

test.describe('TvHead static effect reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('freezes the CRT static overlay on a single frame', async ({
    page,
  }) => {
    await page.goto('/');

    const styles = await getMotionStyles(
      page.locator('.tv-head__background-effect.tv-head-effect-static'),
    );
    expect(styles.animationName).toBe('none');
  });
});

test.describe('TvHead static effect with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('keeps the flicker/drift loop running', async ({ page }) => {
    await page.goto('/');

    const styles = await getMotionStyles(
      page.locator('.tv-head__background-effect.tv-head-effect-static'),
    );
    expect(styles.animationName).toBe(
      'tv-head-static-flicker, tv-head-static-drift',
    );
  });
});
