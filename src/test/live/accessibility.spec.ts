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
