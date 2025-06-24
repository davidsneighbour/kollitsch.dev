import { getImage } from 'astro:assets';
import favicon from '@assets/favicon/favicon.png';
import setup from '@data/setup.json';
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
    faviconPngSizes.map(async size => {
      const image = await getImage({
        src: favicon,
        width: size,
        height: size,
        format: 'png',
      });

      return {
        src: image.src,
        type: `image/${image.options.format}`,
        sizes: `${image.options.width}x${image.options.height}`,
      };
    }),
  );

  // Add an extra maskable icon with the largest size
  // Maskable icons should have bigger paddings. The safe zone is a 409×409 circle.
  const largestSize = faviconPngSizes[faviconPngSizes.length - 1];
  const maskableImage = await getImage({
    src: favicon,
    width: largestSize,
    height: largestSize,
    format: 'png',
  });

  icons.splice(icons.length - 1, 0, {
    src: maskableImage.src,
    type: `image/${maskableImage.options.format}`,
    sizes: `${maskableImage.options.width}x${maskableImage.options.height}`,
    purpose: 'maskable',
  });

  const manifest = {
    name: setup.title,
    description: setup.description,
    start_url: '/',
    display: 'standalone',
    id: setup.id,
    icons,
  };

  return new Response(JSON.stringify(manifest));
};
