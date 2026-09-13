import headlineImageSrc from '@assets/images/headline.jpg';

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
} as const;
