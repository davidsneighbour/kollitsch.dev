import { expect, test, type Page } from '@playwright/test';
import { getMotionStyles, isEffectivelyInstant } from '../../support/motion.ts';

/**
 * Blog posts (and how many years/siblings exist) are real content, not
 * fixtures, so this navigates via the listing rather than hardcoding a
 * slug that could go stale as posts are added, edited, or removed.
 */
async function gotoFirstBlogPost(page: Page): Promise<void> {
  await page.goto('/blog/');
  await page.locator('.grid-entrance a.heading-link').first().click();
  await expect(page.locator('[data-breadcrumb-switcher]').first()).toBeVisible();
}

test.describe('Breadcrumb switcher interaction', () => {
  test('year switcher toggle opens and closes, updating aria-expanded', async ({
    page,
  }) => {
    await gotoFirstBlogPost(page);

    const toggle = page.locator('[data-breadcrumb-switcher-toggle]').first();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('Escape closes the open switcher and returns focus to its toggle', async ({
    page,
  }) => {
    await gotoFirstBlogPost(page);

    const toggle = page.locator('[data-breadcrumb-switcher-toggle]').first();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();
  });

  test('clicking outside the switcher closes it', async ({ page }) => {
    await gotoFirstBlogPost(page);

    const toggle = page.locator('[data-breadcrumb-switcher-toggle]').first();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Click the breadcrumb nav's own padding — outside the switcher wrapper,
    // but without risking a click on an unrelated link elsewhere on the page.
    await page
      .locator('nav[aria-label="Breadcrumb"]')
      .click({ position: { x: 2, y: 2 }, force: true });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('opening one switcher closes another that is already open', async ({
    page,
  }) => {
    await gotoFirstBlogPost(page);

    const toggles = page.locator('[data-breadcrumb-switcher-toggle]');
    const count = await toggles.count();
    test.skip(count < 2, 'This post has only one switcher (no sibling posts in its year).');

    const [first, second] = [toggles.nth(0), toggles.nth(1)];
    await first.click();
    await expect(first).toHaveAttribute('aria-expanded', 'true');

    await second.click();
    await expect(second).toHaveAttribute('aria-expanded', 'true');
    await expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  test('ArrowDown/ArrowUp/Home/End move focus between sibling links', async ({
    page,
  }) => {
    await gotoFirstBlogPost(page);

    const wrapper = page.locator('[data-breadcrumb-switcher]').first();
    const toggle = wrapper.locator('[data-breadcrumb-switcher-toggle]');
    const links = wrapper.locator('[data-breadcrumb-switcher-item]');

    const linkCount = await links.count();
    test.skip(linkCount === 0, 'No sibling items to navigate between.');

    // openSwitcher() focuses the trigger link itself on open (there is no
    // duplicate "active item" to focus, per the anchor-based design) — so
    // ArrowDown from there should move into the first sibling link. Wait for
    // the list to actually finish its visibility transition before sending
    // ArrowDown: focusing a link inside a still-`visibility:hidden` ancestor
    // silently no-ops, and the CSS transition needs a render frame to settle.
    await toggle.click();
    await expect(links.first()).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await expect(links.first()).toBeFocused();

    await page.keyboard.press('End');
    await expect(links.last()).toBeFocused();

    await page.keyboard.press('Home');
    await expect(links.first()).toBeFocused();
  });
});

test.describe('Breadcrumb switcher reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('sibling list transitions collapse to near-instant and drop the translate', async ({
    page,
  }) => {
    await gotoFirstBlogPost(page);

    const list = page.locator('[data-breadcrumb-switcher-list]').first();
    const styles = await getMotionStyles(list);
    expect(isEffectivelyInstant(styles.transitionDuration)).toBe(true);
    expect(styles.transform).toBe('none');
  });
});

test.describe('Breadcrumb switcher with motion allowed', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('sibling list keeps its slide/fade transition', async ({ page }) => {
    await gotoFirstBlogPost(page);

    const list = page.locator('[data-breadcrumb-switcher-list]').first();
    const styles = await getMotionStyles(list);
    expect(isEffectivelyInstant(styles.transitionDuration)).toBe(false);
  });
});
