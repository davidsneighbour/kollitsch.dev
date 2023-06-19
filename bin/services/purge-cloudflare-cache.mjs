/* eslint-disable no-console */
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  try {
    console.log('Clearing Cloudflare cache…');

    // Cloudflare client credentials
    const { CLOUDFLARE_TOKEN } = process.env;
    const { CLOUDFLARE_ZONEID } = process.env;

    // Cloudflare API endpoint
    const url = `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONEID}/purge_cache`;

    fetch(url, {
      method: 'POST',
      body: '{"purge_everything":true}',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CLOUDFLARE_TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then(() => console.log('success'))
      .catch((error) => console.log(error));
  } catch (error) {
    console.error(error);
  }
})();
