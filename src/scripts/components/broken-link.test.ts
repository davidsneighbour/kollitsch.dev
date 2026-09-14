// @vitest-environment jsdom

import {
  brokenLinkReasons,
  defineBrokenLink,
  getBrokenLinkStatusText,
  resolveBrokenLinkReason,
} from './broken-link.ts';
import { beforeEach, describe, expect, it } from 'vitest';

describe('broken link content markers', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('keeps the fixed reason vocabulary stable', () => {
    expect(brokenLinkReasons).toEqual([
      'redirect-loop',
      'tls-error',
      'timeout',
      'server-error',
      'temporarily-unavailable',
      'unknown',
    ]);
  });

  it('falls back to unknown for invalid reasons', () => {
    expect(resolveBrokenLinkReason('timeout')).toBe('timeout');
    expect(resolveBrokenLinkReason('gone')).toBe('unknown');
    expect(resolveBrokenLinkReason(undefined)).toBe('unknown');
  });

  it('creates concise status text with optional checked dates', () => {
    expect(getBrokenLinkStatusText('tls-error')).toBe(
      'Link currently unavailable: TLS error.',
    );
    expect(getBrokenLinkStatusText('timeout', '2026-09-14')).toBe(
      'Link currently unavailable: timeout; checked 2026-09-14.',
    );
  });

  it('enhances a Markdown marker next to the preceding link', async () => {
    document.body.innerHTML =
      '<p><a href="https://example.com/offline">broken link</a> <broken-link reason="timeout" checked="2026-09-14"></broken-link></p>';

    defineBrokenLink();
    await customElements.whenDefined('broken-link');

    const marker = document.querySelector('broken-link');

    expect(marker?.getAttribute('role')).toBe('note');
    expect(marker?.getAttribute('aria-label')).toBe(
      'Link currently unavailable: timeout; checked 2026-09-14.',
    );
    expect(marker?.getAttribute('data-broken-link-reason')).toBe('timeout');
    expect(marker?.getAttribute('data-broken-link-href')).toBe(
      'https://example.com/offline',
    );
    expect(marker?.getAttribute('data-broken-link-state')).toBe('linked');
    expect(marker?.querySelector('[data-broken-link-generated]')).not.toBeNull();
  });

  it('marks missing adjacent links without throwing', async () => {
    document.body.innerHTML = '<p><broken-link reason="gone"></broken-link></p>';

    defineBrokenLink();
    await customElements.whenDefined('broken-link');

    const marker = document.querySelector('broken-link');

    expect(marker?.getAttribute('data-broken-link-reason')).toBe('unknown');
    expect(marker?.getAttribute('data-broken-link-valid-reason')).toBe('false');
    expect(marker?.getAttribute('data-broken-link-state')).toBe('missing-link');
    expect(marker?.hasAttribute('data-broken-link-href')).toBe(false);
  });
});
