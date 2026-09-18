import { expect, test } from '../axe-test.ts';

const KEY_PAGES = ['/', '/blog/', '/connect/', '/find/'];

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  for (const path of KEY_PAGES) {
    test(`${path} has no automatically detectable accessibility violations`, async ({
      page,
      makeAxeBuilder,
    }) => {
      await page.goto(path);
      const results = await makeAxeBuilder()
        // The footer colophon watermark (Colophon.astro) is decorative display
        // texture by design - see DESIGN.md's "Footer Colophon Watermark"
        // section. It's aria-hidden and intentionally low-contrast, marked
        // with data-dnb-design-exception="decorative-low-contrast" for tools
        // like this one to exclude explicitly (#1835).
        .exclude('[data-dnb-design-exception="decorative-low-contrast"]')
        .analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});
