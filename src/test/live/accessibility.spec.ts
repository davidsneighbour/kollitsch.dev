import { expect, test } from '../axe-test.ts';

const KEY_PAGES = ['/', '/blog/', '/connect/', '/find/'];

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  for (const path of KEY_PAGES) {
    test(`${path} has no automatically detectable accessibility violations`, async ({
      page,
      makeAxeBuilder,
    }) => {
      await page.goto(path);
      await page.evaluate(async () => {
        await document.fonts.ready;
        // Keep functional cards covered, but do not measure a half-faded entrance.
        await Promise.all(
          document.getAnimations()
            .filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime))
            .map((animation) => animation.finished.catch(() => undefined)),
        );
      });
      const marker = page.locator('.footer-mark');
      await expect(marker).toHaveAttribute('aria-hidden', 'true');
      await expect(marker).toHaveAttribute('data-dnb-design-exception', 'decorative-low-contrast');
      await expect(
        marker.locator('a, button, input, select, textarea, [tabindex], [contenteditable], [role]'),
      ).toHaveCount(0);
      for (const link of await page.locator('.footer-strip p a').all()) {
        await expect(link).toHaveCSS('text-decoration-line', 'underline');
      }
      const results = await makeAxeBuilder()
        // The footer sticker and colophon watermark are decorative display
        // texture by design - see DESIGN.md's footer sections (#2222, #1835).
        // Each marked subtree must remain non-interactive. The exception
        // is aria-hidden and intentionally low-contrast, marked
        // with data-dnb-design-exception="decorative-low-contrast" for tools
        // like this one to exclude explicitly (#1835).
        .exclude('[data-dnb-design-exception="decorative-low-contrast"]')
        // axe-core misreads this element's ::placeholder colour-contrast - a
        // proven false positive, not a real issue. See
        // documentation/development/known-false-positives.md for the
        // evidence. Blocked on an axe-core fix upstream - tracked in
        // #2032, don't remove this until that issue says it's safe to.
        .exclude('.pagefind-ui__search-input')
        .analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});
