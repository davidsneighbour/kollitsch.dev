/**
 * Content fingerprint for a generated social image.
 *
 * Filenames are stable/deterministic (see paths.ts), so staleness is
 * tracked separately via a fingerprint stored in the build manifest
 * (see manifest.ts) rather than encoded in the filename.
 */

import crypto from 'node:crypto';
import type { OgFormat } from './generate.ts';
import { TEMPLATE_VERSION } from './template.ts';

export interface SocialImageFingerprintInput {
  title: string;
  /** ISO publish date, when displayed on the image. */
  date?: string | undefined;
  /** ISO modified date, when displayed on the image (falls back to date). */
  modifiedDate?: string | undefined;
  backgroundImage: string;
  width: number;
  height: number;
  format: OgFormat;
  author: string;
  siteTitle: string;
}

/**
 * Fingerprint of every input that affects the rendered pixels. Any change
 * yields a new fingerprint, which `build-og-images.ts` uses to detect
 * staleness under the deterministic filename scheme.
 */
export function computeFingerprint(input: SocialImageFingerprintInput): string {
  const payload = JSON.stringify({
    author: input.author,
    backgroundImage: input.backgroundImage,
    date: input.date ?? null,
    format: input.format,
    height: input.height,
    modifiedDate: input.modifiedDate ?? null,
    siteTitle: input.siteTitle,
    templateVersion: TEMPLATE_VERSION,
    title: input.title,
    width: input.width,
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}
