import { describe, expect, it } from 'vitest';

import { hasComponent } from './component';

describe('hasComponent', () => {
  it('returns true when the component is listed in the default path', () => {
    const result = hasComponent(
      {
        options: { head: { components: ['lite-youtube'] } },
      },
      'lite-youtube',
    );

    expect(result).toBe(true);
  });

  it('returns false when data is undefined', () => {
    expect(hasComponent(undefined, 'lite-youtube')).toBe(false);
  });

  it('returns false when the path cannot be resolved', () => {
    const result = hasComponent(
      {
        options: { head: {} },
      },
      'lite-youtube',
    );

    expect(result).toBe(false);
  });

  it('returns false when the resolved value is not an array of allowed components', () => {
    const result = hasComponent(
      {
        options: { head: { components: ['unknown-component'] } },
      },
      'lite-youtube',
    );

    expect(result).toBe(false);
  });

  it('resolves custom paths with arbitrary whitespace between segments', () => {
    const result = hasComponent(
      {
        meta: { head: { components: ['color-grid'] } },
      },
      'color-grid',
      '  meta . head . components  ',
    );

    expect(result).toBe(true);
  });

  it('returns false when the path sanitises to no segments', () => {
    const result = hasComponent(
      {
        options: { head: { components: ['color-grid'] } },
      },
      'color-grid',
      '   ',
    );

    expect(result).toBe(false);
  });

  it('returns false when an intermediate segment is not an object', () => {
    const result = hasComponent(
      {
        options: { head: { components: ['date-diff'] }, headTitle: 'example' },
      },
      'date-diff',
      'options.headTitle.components',
    );

    expect(result).toBe(false);
  });

  it('does not accept unknown component names', () => {
    // @ts-expect-error - "custom" is not an allowed component identifier
    expect(hasComponent({ options: { head: { components: ['custom'] } } }, 'custom')).toBe(false);
  });
});
