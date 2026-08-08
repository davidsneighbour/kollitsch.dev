// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  getBreakpoint,
  getBreakpointPx,
  getMaxWidth,
  getMaxWidthPx,
  getTailwindSizes,
  orderedBreakpoints,
  orderedMaxWidths,
  remToPx,
  tailwind,
  twBreakpoints,
  twBreakpointsPx,
  twBreakpointsRem,
  twMaxWidths,
  twMaxWidthsPx,
  twMaxWidthsRem,
} from './tailwind.ts';

describe('breakpoint/max-width lookups', () => {
  it('getBreakpointPx returns the pixel value for a breakpoint', () => {
    expect(getBreakpointPx('md')).toBe(768);
  });

  it('getMaxWidthPx returns the pixel value for a max-width key', () => {
    expect(getMaxWidthPx('7xl')).toBe(1280);
  });

  it('getBreakpoint returns both rem and px', () => {
    expect(getBreakpoint('lg')).toEqual({ px: 1024, rem: 64 });
  });

  it('getMaxWidth returns both rem and px', () => {
    expect(getMaxWidth('sm')).toEqual({ px: 384, rem: 24 });
  });

  it('exposes consistent px tables across the combined and single-unit constants', () => {
    for (const key of Object.keys(
      twBreakpointsPx,
    ) as (keyof typeof twBreakpointsPx)[]) {
      expect(twBreakpoints[key].px).toBe(twBreakpointsPx[key]);
      expect(twBreakpoints[key].rem).toBe(twBreakpointsRem[key]);
    }
    for (const key of Object.keys(
      twMaxWidthsPx,
    ) as (keyof typeof twMaxWidthsPx)[]) {
      expect(twMaxWidths[key].px).toBe(twMaxWidthsPx[key]);
      expect(twMaxWidths[key].rem).toBe(twMaxWidthsRem[key]);
    }
  });

  it('orders breakpoints and max-widths from smallest to largest', () => {
    expect(orderedBreakpoints).toEqual(['sm', 'md', 'lg', 'xl', '2xl']);
    expect(orderedMaxWidths[0]).toBe('3xs');
    expect(orderedMaxWidths.at(-1)).toBe('7xl');
  });

  it('tailwind bundles breakpoints, max-widths and their orderings', () => {
    expect(tailwind.breakpoints).toBe(twBreakpointsPx);
    expect(tailwind.maxWidths).toBe(twMaxWidthsPx);
    expect(tailwind.orderedBreakpoints).toBe(orderedBreakpoints);
    expect(tailwind.orderedMaxWidths).toBe(orderedMaxWidths);
  });
});

describe('remToPx', () => {
  it('converts rem to px using the default 16px base', () => {
    expect(remToPx(4)).toBe(64);
  });

  it('converts rem to px using a custom base', () => {
    expect(remToPx(4, 24)).toBe(96);
  });
});

describe('getTailwindSizes', () => {
  it('emits a vw fallback based on base columns when no maxContentWidth is given', () => {
    expect(getTailwindSizes({ base: 3 })).toBe('33.33vw');
  });

  it('emits max-width media queries per configured breakpoint, sorted ascending', () => {
    const sizes = getTailwindSizes({ base: 1, md: 2, sm: 1 });
    expect(sizes).toBe(
      '(max-width: 640px) 100.00vw, (max-width: 768px) 50.00vw, 100.00vw',
    );
  });

  it('appends a fixed pixel size for the largest breakpoint when maxContentWidth is set', () => {
    const sizes = getTailwindSizes({ base: 3, maxContentWidth: 1280, sm: 1 });
    expect(sizes).toBe('(max-width: 640px) 100.00vw, (min-width: 641px) 426px');
  });

  it('skips breakpoints configured with zero or negative columns', () => {
    const sizes = getTailwindSizes({ base: 2, sm: 0 });
    expect(sizes).not.toContain('640px');
  });
});
