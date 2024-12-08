import { expect, request, test } from '@playwright/test';

let links: string[] = [];

// A setup function to load links.json before all tests
test.beforeAll(async ({ baseURL }) => {
  if (!baseURL) {
    throw new Error(
      'baseURL is not defined. Ensure the baseURL is properly set in Playwright config.',
    );
  }

  const apiContext = await request.newContext();
  const response = await apiContext.get(`${baseURL}/links.json`);

  if (!response.ok()) {
    console.error(
      `Failed to load links.json with status: ${response.status()}`,
    );
    throw new Error('Could not load links.json');
  }

  try {
    const data = await response.json();
    links = data.links;
    //console.log(`Loaded ${links.length} links from links.json`);
  } catch (error) {
    console.error('Failed to parse links.json:', error);
    throw error;
  }
});

// A test to verify each link in links.json is reachable
test('Verify each link in links.json is reachable', async ({ page }) => {
  if (links.length === 0) {
    throw new Error(
      'No links were loaded. Ensure links.json is available and correctly parsed.',
    );
  }

  for (const link of links) {
    await page.goto(link);
    expect(page.url()).toBe(link);
    //console.log(`Successfully navigated to ${link}`);
  }
});

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.*KOLLITSCH\.dev\*.*/);
});
