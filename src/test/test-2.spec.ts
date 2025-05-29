import { test, expect } from './axe-test';

test.describe('homepage', () => {
  test('navigation menu should not have automatically detectable accessibility violations', async ({
    page,
    makeAxeBuilder,
  }) => {
    await page.goto('/');

    // await page.getByRole('button', { name: 'Navigation Menu' }).click();

    // // It is important to waitFor() the page to be in the desired
    // // state *before* running analyze(). Otherwise, axe might not
    // // find all the elements your test expects it to scan.
    // await page.locator('#navigation-menu-flyout').waitFor();

    const accessibilityScanResults = await makeAxeBuilder()
      //   .include('#navigation-menu-flyout')
      .analyze();
    test.fail();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('example with attachment', async ({
    page,
    makeAxeBuilder,
  }, testInfo) => {
    await page.goto('/');

    const accessibilityScanResults = await makeAxeBuilder().analyze();

    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(accessibilityScanResults, null, 2),
      contentType: 'application/json',
    });
    test.fail();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
