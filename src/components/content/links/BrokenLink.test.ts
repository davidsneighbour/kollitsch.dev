// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('BrokenLink component contract', () => {
  it('exports typed props and the fixed reason contract', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'BrokenLink.astro');
    const src = await fs.readFile(componentPath, 'utf8');

    expect(src).toContain('export interface Props');
    expect(src).toContain('reason: BrokenLinkReason');
    expect(src).toContain('data-broken-link-reason');
    expect(src).toContain('data-broken-link-status="currently-unavailable"');
  });

  it('uses subtle existing icon names for every reason', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'BrokenLink.astro');
    const src = await fs.readFile(componentPath, 'utf8');

    expect(src).toContain("'redirect-loop': 'lucide:refresh-cw'");
    expect(src).toContain("'tls-error': 'lucide:shield-alert'");
    expect(src).toContain("timeout: 'lucide:timer-off'");
    expect(src).toContain("'server-error': 'lucide:server-crash'");
    expect(src).toContain("'temporarily-unavailable': 'lucide:clock-alert'");
    expect(src).toContain("unknown: 'lucide:unlink'");
  });
});
