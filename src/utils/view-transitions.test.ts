// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { getPostPreviewTransitionName } from './view-transitions';

describe('getPostPreviewTransitionName', () => {
  it('creates a stable CSS-safe transition name from a blog post id', () => {
    expect(
      getPostPreviewTransitionName('2026/a-zookeepers-guide-to-tsconfig.json'),
    ).toBe('post-preview-2026-a-zookeepers-guide-to-tsconfig-json');
  });
});
