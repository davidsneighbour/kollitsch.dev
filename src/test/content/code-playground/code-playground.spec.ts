import type { Locator, Page } from '@playwright/test';
import { expect, test } from '../../axe-test.ts';

/**
 * The code playground test post is a draft, which the dev server (used by
 * this suite) renders and production builds do not.
 */
const POST = '/blog/2026/halftone-typography-with-css/';
const HALFTONE = '#playground-halftone-typography-with-css-halftone';
const STRIPES = '#playground-halftone-typography-with-css-stripes';

/** Hydrates a playground (`client:visible`) and waits until it is interactive. */
async function openPlayground(page: Page, selector: string): Promise<Locator> {
  const section = page.locator(selector);
  await section.scrollIntoViewIfNeeded();
  await expect(section.getByRole('button', { name: 'Copy link' })).toBeEnabled();
  return section;
}

function preview(section: Locator) {
  return section.frameLocator('iframe').locator('#sample');
}

/** Requests that leave the dev server (data: and about: are local). */
function trackExternalRequests(page: Page): string[] {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (['data:', 'about:', 'blob:'].includes(url.protocol)) return;
    if (!['localhost', '127.0.0.1'].includes(url.hostname)) {
      external.push(request.url());
    }
  });
  return external;
}

for (const colorScheme of ['dark', 'light'] as const) {
  test.describe(`code playground accessibility (${colorScheme})`, () => {
    test.use({ colorScheme });

    // The site defaults to dark and ignores the system preference unless the
    // stored theme says otherwise, so set the theme the way the selector does.
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((theme) => {
        localStorage.setItem('kdev-theme', theme);
      }, colorScheme);
    });

    test('playgrounds have no detectable WCAG 2.1 AA violations', async ({
      page,
      makeAxeBuilder,
    }) => {
      await page.goto(POST);
      await expect(page.locator('html')).toHaveAttribute('data-theme', colorScheme);
      await openPlayground(page, HALFTONE);
      await openPlayground(page, STRIPES);

      const results = await makeAxeBuilder()
        .include(HALFTONE)
        .include(STRIPES)
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test('the open editor has no detectable WCAG 2.1 AA violations', async ({
      page,
      makeAxeBuilder,
    }) => {
      await page.goto(POST);
      await expect(page.locator('html')).toHaveAttribute('data-theme', colorScheme);
      const section = await openPlayground(page, HALFTONE);
      await section.getByRole('button', { name: 'Edit code' }).click();
      await expect(section.locator('.cm-content')).toBeVisible();

      const results = await makeAxeBuilder().include(HALFTONE).analyze();
      expect(results.violations).toEqual([]);
    });
  });
}

test.describe('code playground behaviour', () => {
  test('controls change only their own playground and the hash records non-default settings', async ({
    page,
  }) => {
    const external = trackExternalRequests(page);
    await page.goto(POST);
    const halftone = await openPlayground(page, HALFTONE);
    const stripes = await openPlayground(page, STRIPES);

    await halftone.getByLabel('Sample text').fill('DOTS');
    await halftone.getByLabel('Dot spacing in px').fill('14');
    await stripes.getByLabel('Stripe angle in deg').fill('90');

    await expect(preview(halftone)).toHaveText('DOTS');
    await expect(preview(stripes)).toHaveText('STRIPES');
    await expect(stripes.getByLabel('Sample text')).toHaveValue('STRIPES');

    await expect(page).toHaveURL(
      /#halftone\.text=DOTS&halftone\.dotSpacing=14&stripes\.angle=90$/,
    );
    expect(external).toEqual([]);
  });

  test('a settings link restores the settings and scrolls to the playground', async ({
    page,
  }) => {
    await page.goto(`${POST}#stripes.text=LINES&stripes.ink=aa0000&stripes.solid=1`);
    const stripes = page.locator(STRIPES);
    await expect(stripes).toBeInViewport();
    await expect(stripes.getByLabel('Sample text')).toHaveValue('LINES');
    await expect(stripes.getByLabel('Ink hex value')).toHaveValue('#aa0000');
    await expect(stripes.getByRole('switch', { name: 'Solid text' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(preview(stripes)).toHaveText('LINES');

    const halftone = await openPlayground(page, HALFTONE);
    await expect(halftone.getByLabel('Sample text')).toHaveValue('HALFTONE');
  });

  test('invalid link values are ignored and out-of-range values are clamped', async ({
    page,
  }) => {
    await page.goto(`${POST}#halftone.dotSpacing=99&halftone.ink=red`);
    const halftone = await openPlayground(page, HALFTONE);
    await expect(halftone.getByLabel('Dot spacing in px')).toHaveValue('24');
    await expect(halftone.getByLabel('Ink hex value')).toHaveValue('#202020');
  });

  test('reset all restores defaults and removes the playground from the hash', async ({
    page,
  }) => {
    await page.goto(`${POST}#halftone.typeSize=120&stripes.angle=10`);
    const halftone = await openPlayground(page, HALFTONE);
    await openPlayground(page, STRIPES);
    await expect(halftone.getByLabel('Type size in px')).toHaveValue('120');

    await halftone.getByRole('button', { name: 'Reset all' }).click();
    await halftone.getByRole('button', { name: 'Discard edits' }).click();

    await expect(halftone.getByLabel('Type size in px')).toHaveValue('96');
    await expect(page).toHaveURL(/#stripes\.angle=10$/);
  });

  test('editing the state file updates the controls of that playground only', async ({
    page,
  }) => {
    await page.goto(POST);
    const halftone = await openPlayground(page, HALFTONE);
    const stripes = await openPlayground(page, STRIPES);
    await halftone.getByRole('button', { name: 'Edit code' }).click();
    await halftone.getByRole('tab', { name: 'playground-state.json' }).click();

    const editor = halftone.locator('.cm-content');
    await editor.click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.insertText(
      '{"text":"EDITED","dotSpacing":10,"dotRadius":2,"typeSize":96,"ink":"#202020","paper":"#ffffff","solid":false,"animate":false,"paused":false}',
    );

    await expect(halftone.getByLabel('Sample text')).toHaveValue('EDITED');
    await expect(preview(halftone)).toHaveText('EDITED');
    await expect(stripes.getByLabel('Sample text')).toHaveValue('STRIPES');
  });

  test('the editor is one tab stop that Escape then Tab leaves', async ({
    page,
  }) => {
    await page.goto(POST);
    const halftone = await openPlayground(page, HALFTONE);
    await halftone.getByRole('button', { name: 'Edit code' }).click();

    const activeTab = halftone.getByRole('tab', { name: 'styles.css' });
    await activeTab.focus();
    await page.keyboard.press('ArrowRight');
    await expect(halftone.getByRole('tab', { name: 'index.js' })).toBeFocused();
    await expect(halftone.getByRole('tab', { name: 'index.js' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await page.keyboard.press('Tab');
    const content = halftone.locator('.cm-content');
    await expect(content).toBeFocused();
    await expect(content).toHaveAccessibleName('Code Editor for index.js');

    await page.keyboard.press('Tab');
    await expect(content).toBeFocused();

    await page.keyboard.press('Escape');
    await page.keyboard.press('Tab');
    await expect(halftone.getByRole('button', { name: 'Copy index.js' })).toBeFocused();
  });

  test('the separator resizes the panes with the keyboard', async ({ page }) => {
    await page.setViewportSize({ height: 900, width: 1440 });
    await page.goto(POST);
    const halftone = await openPlayground(page, HALFTONE);
    await halftone.getByRole('button', { name: 'Edit code' }).click();

    const separator = halftone.getByRole('separator');
    await separator.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(separator).toHaveAttribute('aria-valuenow', '45');
    await page.keyboard.press('End');
    await expect(separator).toHaveAttribute('aria-valuenow', '75');
    await page.keyboard.press('Enter');
    await expect(separator).toHaveAttribute('aria-valuenow', '50');
  });
});
