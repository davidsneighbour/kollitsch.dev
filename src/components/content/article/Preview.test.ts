// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('Preview component (props contract)', () => {
  it('exports a Props interface/type', async () => {
    // resolve the .astro component path relative to this test file
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'Preview.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    // heuristic: match `export interface XProps` or `export type XProps =`
    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
  });

  it('uses an opaque card background in both themes', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'Preview.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    // `bg-card` alone (no translucent dark: override) so fixed background
    // effects (e.g. the mesh, see Mesh.astro) never show
    // through the card - it must be fully opaque in both themes.
    expect(src).toContain('bg-card');
    expect(src).toContain('text-card-foreground');
    expect(src).not.toContain('dark:bg-black/20');
    expect(src).not.toContain('bg-white/5');
  });

  it('uses the shared blog post preview transition name', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'Preview.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    expect(src).toContain('getPostPreviewTransitionName(post.id)');
    expect(src).toContain('getPostPreviewMediaTransitionName(post.id)');
    expect(src).toContain('transition:name={transitionName}');
    expect(src).toContain('transitionName={mediaTransitionName}');
    expect(src).not.toContain('post-title-${post.id}');
  });
});
