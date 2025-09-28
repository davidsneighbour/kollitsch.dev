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
      dynamicEntries += `User-agent: ${userAgent}\nContent-Signal: search=yes, ai-train=no\nDisallow: /\n\n`;
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

  const contentSignalsComment = `# As a condition of accessing this website, you agree to abide by the following content signals:

# (a)  If a content-signal = yes, you may collect content for the corresponding use.
# (b)  If a content-signal = no, you may not collect content for the corresponding use.
# (c)  If the website operator does not include a content signal for a corresponding use, the website operator neither grants nor restricts permission via content signal with respect to the corresponding use.

# The content signals and their meanings are:

# search: building a search index and providing search results (e.g., returning hyperlinks and short excerpts from your website's contents).  Search does not include providing AI-generated search summaries.
# ai-input: inputting content into one or more AI models (e.g., retrieval augmented generation, grounding, or other real-time taking of content for generative AI search answers).
# ai-train: training or fine-tuning AI models.

# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS ARE EXPRESS RESERVATIONS OF RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET.

# For more information, please see https://blog.cloudflare.com/content-signals-policy/.


`;

  const staticRules = `User-agent: *\nContent-Signal: search=yes, ai-train=no\nAllow: /\n\n`;

  const body =
    contentSignalsComment + dynamicEntries + staticRules + sitemapEntry;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
    status: 200,
  });
}
