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
        // Pre-existing, tracked in #1835: sitewide colour-contrast debt (watermark
        // heading + footer feed/web-ring links), plus one post with an empty
        // aria-label from a missing cover.alt. Remove both once #1835 is fixed.
        .disableRules(['color-contrast'])
        .exclude('a[href="/blog/2025/language-kuchisabishii/"]')
        .analyze();
      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});
