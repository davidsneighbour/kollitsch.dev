import { expect, test } from '@playwright/test';

// Individual post URLs look like /blog/{year}/{slug}/ (see Preview.astro); this
// excludes year-index and listing pages, which only have one path segment after
// /blog/.
const POST_PATH_PATTERN = /^\/blog\/\d{4}\/[^/]+\/$/;

test('blog post pages include valid BlogPosting structured data', async ({ page, request }) => {
  await page.goto('/');

  const hrefs = await page.locator('article a[href^="/blog/"]').evaluateAll((elements) =>
    elements.map((el) => el.getAttribute('href')).filter((href): href is string => Boolean(href)),
  );

  const postHref = hrefs.find((href) => POST_PATH_PATTERN.test(href));
  expect(postHref, 'expected at least one individual blog post link on the homepage').toBeTruthy();

  const response = await request.get(postHref as string);
  expect(response.ok()).toBeTruthy();

  const html = await response.text();
  const scripts = [
    ...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g),
  ].map((match) => JSON.parse(match[1] ?? '{}'));

  const blogPosting = scripts.find((schema) => schema['@type'] === 'BlogPosting');
  expect(blogPosting, `expected a BlogPosting JSON-LD block on ${postHref}`).toBeTruthy();
  expect(blogPosting.headline).toBeTruthy();
});
