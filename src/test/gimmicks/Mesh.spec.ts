import { test, expect, type Page } from '@playwright/test';
import { getMotionStyles } from '../support/motion.ts';

/**
 * Scrolls the site title's hero out of view so the mesh's own
 * IntersectionObserver trigger (`[data-mesh-trigger]`, right after
 * <SiteTitle>) fires and `.mesh` gets `is-visible`.
 */
async function revealMesh(page: Page): Promise<void> {
  await page.goto('/');
  await page.locator('[data-mesh-trigger]').waitFor();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('.mesh')).toHaveClass(/is-visible/);
}

test.describe('Mesh reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('fades in on a shortened transition', async ({ page }) => {
    await revealMesh(page);

    const styles = await getMotionStyles(page.locator('.mesh'));
    expect(styles.transitionDuration).toBe('0.4s');
  });

  test('draws a single static frame and does not react to the pointer', async ({
    page,
  }) => {
    await revealMesh(page);

    const canvas = page.locator('.mesh-canvas');
    const before = await canvas.evaluate((element) =>
      (element as HTMLCanvasElement).toDataURL(),
    );

    // Sweep the pointer across the mesh box - under no-preference this would
    // both push particles around (repulsion) and brighten dots/lines near it
    // (glow); under reduced motion neither effect is wired up, and the rAF
    // loop that would otherwise redraw every frame never started.
    await page.mouse.move(300, 650);
    await page.mouse.move(900, 600, { steps: 10 });
    await page.waitForTimeout(500);

    const after = await canvas.evaluate((element) =>
      (element as HTMLCanvasElement).toDataURL(),
    );
    expect(after).toBe(before);
  });
});

test.describe('Mesh with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('fades in on the configured (longer) transition', async ({ page }) => {
    await revealMesh(page);

    const styles = await getMotionStyles(page.locator('.mesh'));
    expect(styles.transitionDuration).toBe('6s');
  });

  test('keeps its ambient drift animation loop running', async ({ page }) => {
    await revealMesh(page);

    const canvas = page.locator('.mesh-canvas');
    const before = await canvas.evaluate((element) =>
      (element as HTMLCanvasElement).toDataURL(),
    );
    await page.waitForTimeout(700);
    const after = await canvas.evaluate((element) =>
      (element as HTMLCanvasElement).toDataURL(),
    );

    expect(after).not.toBe(before);
  });
});
