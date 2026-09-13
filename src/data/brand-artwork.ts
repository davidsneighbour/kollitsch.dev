import headlineImageSrc from '@assets/images/headline/20260913.jpg';

export const wordmarkArtwork = {
  backgroundSize: '100vw auto',
  headerFill: {
    // Indirected through theme.css's --hero-tint-* tokens (rather than a
    // literal palette value) so dark mode can retint the hero without a
    // light/dark branch here.
    fallbackColor: 'var(--hero-tint-fallback)',
    tintColor: 'var(--hero-tint-color)',
    tintOpacity: 0.1,
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
