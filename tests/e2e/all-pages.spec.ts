import { test, expect, request } from '@playwright/test';

test('Verify each link in links.json is reachable', async ({ page, baseURL }) => {
  console.log(`Attempting to load links.json from ${baseURL}/links.json`);

  const apiContext = await request.newContext();
  const response = await apiContext.get(`${baseURL}/links.json`);

  if (!response.ok()) {
    console.error(`Failed to load links.json with status: ${response.status()}`);
    throw new Error('Could not load links.json');
  }

  let links: string[] = [];
  try {
    const data = await response.json();
    links = data.links;
    console.log(`Loaded ${links.length} links from links.json`);
  } catch (error) {
    console.error('Failed to parse links.json:', error);
    throw error;
  }

  for (const link of links) {
    await page.goto(link);
  }

});
