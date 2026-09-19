// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { computeFingerprint } from './fingerprint.ts';

const baseInput = {
  author: 'Patrick Kollitsch',
  backgroundImage: '/src/assets/images/cover.jpg',
  date: '2026-01-01T00:00:00.000Z',
  format: 'jpeg' as const,
  height: 630,
  modifiedDate: undefined,
  siteTitle: 'KOLLITSCH.dev*',
  title: 'A title',
  width: 1200,
};

describe('computeFingerprint', () => {
  it('is deterministic for identical input', () => {
    expect(computeFingerprint(baseInput)).toBe(computeFingerprint(baseInput));
  });

  it('changes when the title changes', () => {
    expect(computeFingerprint(baseInput)).not.toBe(
      computeFingerprint({ ...baseInput, title: 'A different title' }),
    );
  });

  it('changes when the publish date changes', () => {
    expect(computeFingerprint(baseInput)).not.toBe(
      computeFingerprint({ ...baseInput, date: '2026-06-01T00:00:00.000Z' }),
    );
  });

  it('changes when the modified date changes', () => {
    expect(computeFingerprint(baseInput)).not.toBe(
      computeFingerprint({
        ...baseInput,
        modifiedDate: '2026-06-01T00:00:00.000Z',
      }),
    );
  });

  it('changes when the background image changes', () => {
    expect(computeFingerprint(baseInput)).not.toBe(
      computeFingerprint({
        ...baseInput,
        backgroundImage: '/src/assets/images/other.jpg',
      }),
    );
  });

  it('changes when dimensions or format change', () => {
    expect(computeFingerprint(baseInput)).not.toBe(
      computeFingerprint({ ...baseInput, width: 600 }),
    );
    expect(computeFingerprint(baseInput)).not.toBe(
      computeFingerprint({ ...baseInput, format: 'png' }),
    );
  });

  afterEach(() => {
    vi.doUnmock('./template.ts');
    vi.resetModules();
  });

  it('changes when TEMPLATE_VERSION is bumped, invalidating every prior fingerprint', async () => {
    const before = computeFingerprint(baseInput);

    vi.resetModules();
    vi.doMock('./template.ts', () => ({ TEMPLATE_VERSION: 999 }));
    const { computeFingerprint: computeFingerprintWithNewTemplate } =
      await import('./fingerprint.ts');

    expect(computeFingerprintWithNewTemplate(baseInput)).not.toBe(before);
  });
});
