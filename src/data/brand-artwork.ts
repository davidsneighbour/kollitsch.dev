import headlineImageSrc from '@assets/images/headline/20260913.jpg';

// The header photo that the large site title reveals on hover (see
// SiteTitle.astro). The image swaps periodically (date-stamped filename).
// The logo itself is never filled with it: see src/brand/kollitsch-brand.
export const wordmarkArtwork = {
  image: {
    format: 'webp',
    quality: 75,
    src: headlineImageSrc,
    width: 2000,
  },
} as const;
