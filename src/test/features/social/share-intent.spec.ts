import { expect, test } from '@playwright/test';

test('loads instance handling only on click and remembers the server for the next visit', async ({
  page,
  context,
}) => {
  const handlerRequests: string[] = [];
  page.on('request', (request) => {
    if (request.url().includes('/ShareIntentClient.ts'))
      handlerRequests.push(request.url());
  });
  await context.addInitScript(() => {
    const original = Storage.prototype.getItem;
    Object.defineProperty(window, 'shareStorageReads', {
      value: [],
      writable: true,
    });
    Storage.prototype.getItem = function (key) {
      if (key === 'mastodon_instance_url') {
        (
          window as unknown as { shareStorageReads: string[] }
        ).shareStorageReads.push(key);
      }
      return original.call(this, key);
    };
  });
  await context.route('https://share.example/**', (route) =>
    route.fulfill({ body: '<title>Share destination</title>' }),
  );
  await page.goto('/');
  const link = page.locator('a[data-share-intent]').first();
  await link.scrollIntoViewIfNeeded();
  await link.hover();
  await expect(link).toHaveAccessibleName('Mastodon');
  expect(handlerRequests).toEqual([]);
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { shareStorageReads: string[] })
          .shareStorageReads,
    ),
  ).toEqual([]);
  page.once('dialog', async (dialog) => {
    expect(dialog.defaultValue()).toBe('mas.to');
    await dialog.accept('https://SHARE.EXAMPLE/@visitor');
  });
  const opened = page.waitForEvent('popup');
  await link.focus();
  await page.keyboard.press('Enter');
  const popup = await opened;
  await popup.waitForURL('https://share.example/share?**');
  expect(new URL(popup.url()).searchParams.get('text')).toContain('https://');
  expect(handlerRequests.length).toBeGreaterThan(0);
  expect(
    await page.evaluate(() => localStorage.getItem('mastodon_instance_url')),
  ).toBe('share.example');
  expect(await popup.evaluate(() => window.opener)).toBeNull();
  await popup.close();
  await page.reload();
  page.once('dialog', async (dialog) => {
    expect(dialog.defaultValue()).toBe('share.example');
    await dialog.dismiss();
  });
  await page.locator('a[data-share-intent]').first().click();
  await expect(page.locator('a[data-share-pending]')).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem('mastodon_instance_url')),
  ).toBe('share.example');
});

test('keeps a valid default share URL without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  await page.goto(baseURL ?? 'https://127.0.0.1:4400');
  const link = page.locator('a[data-share-intent]').first();
  const url = new URL((await link.getAttribute('href')) ?? '');
  expect(url.origin).toBe('https://mas.to');
  expect(url.pathname).toBe('/share');
  expect(url.searchParams.get('text')).toContain('https://');
  await context.close();
});
