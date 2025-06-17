import { getImage } from 'astro:assets';
import favicon from '@assets/favicon/favicon.png';
import siteinfo from '@data/setup.json';
import type { APIRoute } from 'astro';

const faviconPngSizes = [192, 512];

export const GET: APIRoute = async () => {
  const icons = await Promise.all(
    faviconPngSizes.map(async (size) => {
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

  const manifest = {
    name: siteinfo.title,
    description: siteinfo.description,
    start_url: '/',
    display: 'standalone',
    id: siteinfo.id,
    icons,
  };

  return new Response(JSON.stringify(manifest));
};
