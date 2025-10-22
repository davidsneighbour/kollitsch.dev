import { getImage } from 'astro:assets';
import favicon from '@assets/favicon/favicon.png';
import setup from '@data/setup.json' with { type: 'json' };
import type { APIRoute } from 'astro';

// @todo maybe pre-generate these icons
const faviconPngSizes = [192, 512];

type ManifestIcon = {
  src: string;
  type: string;
  sizes: string;
  purpose?: 'maskable' | 'any';
};

// @see https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
export const GET: APIRoute = async () => {
  const icons: ManifestIcon[] = await Promise.all(
    faviconPngSizes.map(async (size) => {
      const image = await getImage({
        format: 'png',
        height: size,
        src: favicon,
        width: size,
      });

      return {
        sizes: `${image.options.width}x${image.options.height}`,
        src: image.src,
        type: `image/${image.options.format}`,
      };
    }),
  );

  // Add an extra maskable icon with the largest size
  // Maskable icons should have bigger paddings. The safe zone is a 409×409 circle.
  const largestSize = faviconPngSizes[faviconPngSizes.length - 1];
  const maskableImage = await getImage({
    format: 'png',
    height: largestSize,
    src: favicon,
    width: largestSize,
  });

  icons.splice(icons.length - 1, 0, {
    purpose: 'maskable',
    sizes: `${maskableImage.options.width}x${maskableImage.options.height}`,
    src: maskableImage.src,
    type: `image/${maskableImage.options.format}`,
  });

  const manifest = {
    description: setup.description,
    display: 'standalone',
    icons,
    id: setup.id,
    name: setup.title,
    start_url: '/',
  };

  return new Response(JSON.stringify(manifest));
};
