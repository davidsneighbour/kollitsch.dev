// @vitest-environment node

import { describe, expect, it } from 'vitest';
import config from '../../playwright.config.ts';

describe('Playwright server lifecycle', () => {
  it('uses a foreground server on a test port with a matching readiness URL', () => {
    const server = config.webServer;
    if (!server || Array.isArray(server)) throw new Error('Expected one test server');
    const url = new URL(server.url!);
    const port = Number(url.port);

    expect(port).toBeGreaterThanOrEqual(4400);
    expect(port).toBeLessThanOrEqual(4499);
    expect(server.command).toContain('--ignore-lock');
    expect(server.command).toContain(`--host ${url.hostname}`);
    expect(server.command).toContain(`--port ${port}`);
    expect(server.command).not.toContain('webserver.ts');
  });
});
