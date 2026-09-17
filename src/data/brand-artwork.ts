import path from 'node:path';
import headlineImageSrc from '@assets/images/headline/20260913.jpg';
import { computeHeroTint } from '@utils/hero-tint.ts';

// The header image swaps periodically (see the date-stamped filename above),
// so its tint is computed from the image itself rather than pinned to a
// fixed palette value - see hero-tint.ts for why and how.
//
// Resolved from process.cwd() rather than `new URL(..., import.meta.url)`:
// this module gets bundled into dist/.prerender/chunks/ during `astro
// build`, which would move it away from src/assets/ and break an
// import.meta.url-relative path. process.cwd() is the project root for both
// `astro dev` and `astro build`, matching the convention already used
// elsewhere (see src/utils/content.ts, src/utils/image-index.ts).
const heroTint = await computeHeroTint(
  path.join(process.cwd(), 'src/assets/images/headline/20260913.jpg'),
);

export const wordmarkArtwork = {
  backgroundSize: '100vw auto',
  headerFill: {
    // Fallback text colour for the rare browser without background-clip:
    // text support - indirected through theme.css's --hero-tint-fallback
    // token rather than a literal value, unlike tintColor/tintColorDark
    // below (those are per-image computed, not theme tokens).
    fallbackColor: 'var(--hero-tint-fallback)',
    tintColor: heroTint.light.tintColor,
    tintColorDark: heroTint.dark.tintColor,
    tintOpacity: heroTint.light.tintOpacity,
    tintOpacityDark: heroTint.dark.tintOpacity,
  },
  image: {
    format: 'webp',
    quality: 75,
    src: headlineImageSrc,
    width: 2000,
  },
  position: 'center',
  // Viewport buckets the header's background-image swaps at, mirroring
  // astro.config's image.breakpoints so the header reuses the same
  // responsive-width scheme as the rest of the site's images.
  responsiveBreakpoints: [640, 750, 828, 1080, 1280] as const,
} as const;
