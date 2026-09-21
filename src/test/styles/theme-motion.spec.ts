import { test, expect } from '@playwright/test';
import { getMotionStyles } from '../support/motion.ts';

test.describe('Animated heading/hr rule reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('renders fully extended, without transitioning or attaching an observer', async ({
    page,
  }) => {
    await page.goto('/test/heading/');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    const after = await getMotionStyles(heading, '::after');
    expect(after.transitionDuration).toBe('0s');
    // scaleX(1) - already fully drawn, no JS needed to extend it.
    expect(after.transform).toBe('matrix(1, 0, 0, 1, 0, 0)');

    // CSS already shows the line at full length; JS should have skipped
    // attaching the IntersectionObserver entirely, so the class marking a
    // real scroll-triggered reveal never gets added.
    await page.waitForTimeout(300);
    await expect(heading).not.toHaveClass(/rule-visible/);
  });
});

test.describe('Animated heading/hr rule with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('grows from a pre-drawn 40% to full length once observed', async ({
    page,
  }) => {
    await page.goto('/test/heading/');

    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    const after = await getMotionStyles(heading, '::after');
    expect(after.transitionDuration).toBe('0.6s');

    // The IntersectionObserver fires for anything already on screen at
    // load, marking it revealed and growing the line to full length. Give
    // the 600ms transition time to actually finish before reading the
    // resting value, rather than catching it mid-flight.
    await expect(heading).toHaveClass(/rule-visible/);
    await page.waitForTimeout(700);
    const revealed = await getMotionStyles(heading, '::after');
    expect(revealed.transform).toBe('matrix(1, 0, 0, 1, 0, 0)');
  });
});

test.describe('Blog listing grid entrance reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('listing cards render without the staggered entrance animation', async ({
    page,
  }) => {
    await page.goto('/blog/');

    const item = page.locator('.grid-entrance > *').first();
    await expect(item).toBeVisible();

    const styles = await getMotionStyles(item);
    expect(styles.animationName).toBe('none');
    expect(styles.opacity).toBe('1');
    expect(styles.transform).toBe('none');
  });
});

test.describe('Blog listing grid entrance with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('listing cards animate in with a staggered entrance', async ({
    page,
  }) => {
    await page.goto('/blog/');

    const item = page.locator('.grid-entrance > *').first();
    await expect(item).toBeVisible();

    const styles = await getMotionStyles(item);
    expect(styles.animationName).toBe('grid-entrance-item');
  });
});

test.describe('404 page entrance reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('renders without the fade-in-scale entrance', async ({ page }) => {
    const response = await page.goto(
      '/this-page-does-not-exist-reduced-motion-test/',
    );
    expect(response?.status()).toBe(404);

    const heading = page.getByRole('heading', { name: 'Page not found' });
    await expect(heading).toBeVisible();

    const styles = await getMotionStyles(heading);
    expect(styles.animationName).toBe('none');
  });
});

test.describe('404 page entrance with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('fades and scales each child in on load', async ({ page }) => {
    const response = await page.goto(
      '/this-page-does-not-exist-reduced-motion-test/',
    );
    expect(response?.status()).toBe(404);

    const heading = page.getByRole('heading', { name: 'Page not found' });
    await expect(heading).toBeVisible();

    const styles = await getMotionStyles(heading);
    expect(styles.animationName).toBe('fade-in-scale');
  });
});

test.describe('View transition pseudo-element catch-all', () => {
  test.use({ reducedMotion: 'reduce' });

  test('excludes post preview cards from named view transitions', async ({
    page,
  }) => {
    await page.goto('/blog/');

    const card = page.locator('[data-post-preview-transition]').first();
    await expect(card).toBeVisible();

    const name = await card.evaluate(
      (element) => getComputedStyle(element).viewTransitionName,
    );
    expect(name).toBe('none');
  });

  test('resolves an ad-hoc view transition with no pseudo-element animation', async ({
    page,
  }) => {
    await page.goto('/');

    const elapsed = await page.evaluate(async () => {
      const start = performance.now();
      const transition = document.startViewTransition(() => {});
      await transition.finished;
      return performance.now() - start;
    });

    // The sitewide catch-all forces `animation: none !important` on every
    // ::view-transition-*(*) pseudo-element, so this resolves almost
    // instantly instead of waiting out an animation.
    expect(elapsed).toBeLessThan(100);
  });
});

test.describe('View transition pseudo-element catch-all with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('names post preview cards for a shared-element transition', async ({
    page,
  }) => {
    await page.goto('/blog/');

    const card = page.locator('[data-post-preview-transition]').first();
    await expect(card).toBeVisible();

    const name = await card.evaluate(
      (element) => getComputedStyle(element).viewTransitionName,
    );
    expect(name).not.toBe('none');
  });

  test('lets an ad-hoc view transition run its pseudo-element animation', async ({
    page,
  }) => {
    await page.goto('/');

    const elapsed = await page.evaluate(async () => {
      const start = performance.now();
      const transition = document.startViewTransition(() => {});
      await transition.finished;
      return performance.now() - start;
    });

    expect(elapsed).toBeGreaterThan(150);
  });
});
