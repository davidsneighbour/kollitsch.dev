// @todo refactor
const JSON_URL =
  'https://raw.githubusercontent.com/ai-robots-txt/ai.robots.txt/refs/heads/main/robots.json';

/**
 * Dynamically generates a robots.txt by pulling AI bot entries from a remote JSON
 * and then appending the existing static rules.
 *
 * @param {object} context - The request context provided by Astro.
 * @returns {Promise<Response>} A plain-text response containing the merged robots.txt.
 */
export async function GET(context) {
  let dynamicEntries = '';

  try {
    const res = await fetch(JSON_URL);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch robots JSON: ${res.status} ${res.statusText}`,
      );
    }
    const robotsData = await res.json();

    for (const userAgent of Object.keys(robotsData)) {
      dynamicEntries += `User-agent: ${userAgent}\nDisallow: /\n\n`;
    }
  } catch (err) {
    console.error(
      `[robots.txt] Error fetching or parsing JSON: ${err.message}`,
    );
    dynamicEntries = '';
  }

  const fullUrl = new URL(context.request.url);
  const sitemapUrl = new URL('/sitemap-index.xml', fullUrl.origin);
  const sitemapEntry = `Sitemap: ${sitemapUrl.href}\n\n`;

  const staticRules = `User-agent: *\nAllow: /\n\n`;

  const body = dynamicEntries + staticRules + sitemapEntry;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
