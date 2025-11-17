import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute } from 'astro';

const FILEPATH = 'src/assets/images/patrick-kollitsch.png';

// @todo update with current avatar protocol and use setup for path
export const GET: APIRoute = async () => {
  try {
    // Point to your local image
    const filePath = join(process.cwd(), FILEPATH);
    const imageBuffer = await readFile(filePath);

    const ext = FILEPATH.split('.').pop();
    const type =
      ext === 'jpg' || ext === 'jpeg'
        ? 'image/jpeg'
        : ext === 'svg'
          ? 'image/svg+xml'
          : 'image/png';

    try {
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': type,
        },
        status: 200,
      });
    } catch (error) {
      console.error('Error in avatar endpoint', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        headers: { 'Content-Type': 'image/png' },
        status: 500,
      });
    }
  } catch (error) {
    console.error('Error reading image file', error);
    return new Response(JSON.stringify({ error: 'Image not found' }), {
      headers: { 'Content-Type': 'image/png' },
      status: 404,
    });
  }
};
