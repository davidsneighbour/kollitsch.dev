import { expect, test } from '@playwright/test';

// /about/ and /uses/ are standalone pages, not linked from primary nav; /connect/
// is the contact page (there is no /contact/ route — the issue that requested this
// coverage assumed one, but production returns 404 for it).
const CRITICAL_PATHS = ['/about/', '/connect/', '/uses/'];

test.describe('Critical page uptime', () => {
  for (const path of CRITICAL_PATHS) {
    test(`${path} responds with 200`, async ({ request, baseURL }) => {
      expect(baseURL, 'A baseURL must be configured for live site tests').toBeTruthy();

      const response = await request.get(path);
      expect(response.status(), `${path} should respond with 200`).toBe(200);
    });
  }
});
