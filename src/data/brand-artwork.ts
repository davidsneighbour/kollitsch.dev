import headlineImageSrc from '@assets/images/headline.jpg';

export const wordmarkArtwork = {
  backgroundSize: '100vw auto',
  headerFill: {
    fallbackColor: 'var(--color-orange-500)',
    tintColor: 'var(--color-red-800)',
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
