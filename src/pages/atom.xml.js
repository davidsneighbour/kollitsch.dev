import { getCollection } from 'astro:content';
import setup from '@data/setup.json' with { type: 'json' };

const escapeXml = (value = '') =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET(context) {
  let blog = await getCollection('blog', ({ data }) => {
    return data?.draft !== true;
  });
  blog.sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
  blog = blog.slice(0, 10);

  const site = context.site ?? new URL(setup.url);
  const feedUrl = new URL('/atom.xml', site).toString();
  const homeUrl = new URL('/', site).toString();
  const updated = blog[0]?.data?.date
    ? new Date(blog[0].data.date).toISOString()
    : new Date().toISOString();

  const entries = blog
    .map((post) => {
      const postUrl = new URL(`/blog/${post.slug}/`, site).toString();
      const lines = [
        '  <entry>',
        `    <title>${escapeXml(post.data.title)}</title>`,
        `    <link href="${postUrl}" />`,
        `    <id>${postUrl}</id>`,
        `    <updated>${new Date(post.data.date).toISOString()}</updated>`,
      ];

      if (post.data.description) {
        lines.push(
          `    <summary>${escapeXml(post.data.description)}</summary>`,
        );
      }

      const tags = post.data.tags || [];
      for (const tag of tags) {
        lines.push(`    <category term="${escapeXml(tag)}" />`);
      }

      lines.push('  </entry>');
      return lines.join('\n');
    })
    .join('\n');

  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(setup.title)}</title>
  <subtitle>${escapeXml(setup.description)}</subtitle>
  <link href="${homeUrl}" />
  <link rel="self" type="application/atom+xml" href="${feedUrl}" />
  <id>${homeUrl}</id>
  <updated>${updated}</updated>
  <author>
    <name>${escapeXml(setup.author?.name ?? setup.title)}</name>
  </author>
${entries}
</feed>
`;

  return new Response(feed, {
    headers: {
      'content-type': 'application/atom+xml; charset=utf-8',
    },
  });
}
