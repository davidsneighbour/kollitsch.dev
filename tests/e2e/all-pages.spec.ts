import { expect, request, test } from '@playwright/test';

test.setTimeout(60 * 1000); // Set a global timeout of 60 seconds
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
  // Validate that links were properly loaded
  if (links.length === 0) {
    throw new Error(
      'No links were loaded. Ensure links.json is available and correctly parsed.',
    );
  }

  // Setup error collection
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`Error message: ${message.text()}`);
    }
  });

  page.on('pageerror', (err) => {
    console.log(err.message);
  });

  // Process each link as a separate test step
  for (const link of links) {
    // This creates a named step that will show in the console output
    await test.step(`Testing: ${link}`, async () => {
      // Navigate to the link
      await page.goto(link);

      // Verify we ended up at the expected URL
      expect(page.url()).toBe(link);

      // Verify no console errors were collected
      expect(errors).toHaveLength(0);

      // Clear errors for next iteration
      errors.length = 0;
    });
  }
});

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.*KOLLITSCH\.dev\*.*/);
});
