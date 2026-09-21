import { test, expect } from '@playwright/test';
import {
  everyDurationEquals,
  getMotionStyles,
  isEffectivelyInstant,
} from '../../support/motion.ts';

test.describe('Header chrome reduced motion (desktop)', () => {
  test.use({ reducedMotion: 'reduce' });

  test('sticky brand mark has no slide-in transform', async ({ page }) => {
    await page.goto('/');

    const styles = await getMotionStyles(page.locator('#navbar-brand'));
    expect(styles.transform).toBe('none');
    expect(styles.transitionProperty).toBe('opacity');
  });

  test('theme toggle corner transitions are effectively instant', async ({
    page,
  }) => {
    await page.goto('/');

    const corner = await getMotionStyles(page.locator('.theme-corner'));
    expect(isEffectivelyInstant(corner.transitionDuration)).toBe(true);

    const toggle = await getMotionStyles(
      page.locator('.theme-corner .theme-toggle'),
    );
    expect(isEffectivelyInstant(toggle.transitionDuration)).toBe(true);
  });

  test('desktop nav dropdown menu opens without a scale/opacity transition', async ({
    page,
  }) => {
    await page.goto('/');

    const menu = await getMotionStyles(
      page.locator('[data-nav-dropdown] [role="menu"]'),
    );
    expect(isEffectivelyInstant(menu.transitionDuration)).toBe(true);
  });

  test('search panel opens without a scale/opacity transition', async ({
    page,
  }) => {
    await page.goto('/');

    const panel = await getMotionStyles(page.locator('[data-nav-search-panel]'));
    expect(isEffectivelyInstant(panel.transitionDuration)).toBe(true);
  });
});

test.describe('Header chrome with motion allowed (desktop)', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('sticky brand mark keeps its slide-in transform and duration', async ({
    page,
  }) => {
    await page.goto('/');

    const styles = await getMotionStyles(page.locator('#navbar-brand'));
    expect(styles.transform).not.toBe('none');
    expect(styles.transitionProperty).toBe('opacity, transform');
  });

  test('theme toggle corner keeps its real transition durations', async ({
    page,
  }) => {
    await page.goto('/');

    const corner = await getMotionStyles(page.locator('.theme-corner'));
    expect(isEffectivelyInstant(corner.transitionDuration)).toBe(false);

    const toggle = await getMotionStyles(
      page.locator('.theme-corner .theme-toggle'),
    );
    expect(isEffectivelyInstant(toggle.transitionDuration)).toBe(false);
  });

  test('desktop nav dropdown menu keeps its scale/opacity transition', async ({
    page,
  }) => {
    await page.goto('/');

    const menu = await getMotionStyles(
      page.locator('[data-nav-dropdown] [role="menu"]'),
    );
    expect(everyDurationEquals(menu.transitionDuration, '0.2s')).toBe(true);
  });

  test('search panel keeps its scale/opacity transition', async ({ page }) => {
    await page.goto('/');

    const panel = await getMotionStyles(page.locator('[data-nav-search-panel]'));
    expect(everyDurationEquals(panel.transitionDuration, '0.3s')).toBe(true);
  });
});

test.describe('Mobile nav dropdown reduced motion', () => {
  test.use({ reducedMotion: 'reduce', viewport: { width: 375, height: 800 } });

  test('opens instantly instead of sliding and fading in', async ({ page }) => {
    await page.goto('/');

    const styles = await getMotionStyles(
      page.locator('#navigation-and-theme-select'),
    );
    expect(isEffectivelyInstant(styles.transitionDuration)).toBe(true);
  });
});

test.describe('Mobile nav dropdown with motion allowed', () => {
  test.use({
    reducedMotion: 'no-preference',
    viewport: { width: 375, height: 800 },
  });

  test('keeps its slide/fade transition', async ({ page }) => {
    await page.goto('/');

    const styles = await getMotionStyles(
      page.locator('#navigation-and-theme-select'),
    );
    expect(everyDurationEquals(styles.transitionDuration, '0.15s')).toBe(
      true,
    );
  });
});
