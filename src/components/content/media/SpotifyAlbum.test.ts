// @vitest-environment node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

describe('SpotifyAlbum component', () => {
  const componentPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'SpotifyAlbum.astro',
  );

  it('exports a Props interface', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(/export\s+(?:interface|type)\s+\w*Props\b/.test(src)).toBe(true);
  });

  it('expects an album id instead of a full URL', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(src).toContain('SpotifyAlbum expected an album id');
    expect(src).toContain('https://open.spotify.com/embed/album/');
  });
});
