/**
 * Site-level constants needed for social-image rendering, read directly
 * from setup.json via a relative import so this module works both inside
 * Astro/Vite and from the plain-Node build-og-images.ts CLI script.
 *
 * `src/utils/opengraph.ts` exposes the same values (computed identically)
 * for Astro-side consumers that already depend on that module.
 */

import rawSetup from '../../data/setup.json' with { type: 'json' };

interface SetupConfig {
  title?: string;
  author?: { name?: string };
  images?: { opengraph?: string; default?: string };
  url?: string;
}

const setup: SetupConfig = rawSetup as unknown as SetupConfig;

export const siteTitle: string = setup.title ?? '';
export const siteAuthorName: string = setup.author?.name ?? '';
export const siteDefaultImageKey: string = (setup.images?.default ?? '').trim();
export const siteOgImageKey: string = (setup.images?.opengraph ?? '').trim();
export const siteUrl: string = setup.url ?? '';
