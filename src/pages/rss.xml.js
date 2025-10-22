// @todo refactor
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import setup from '@data/setup.json' with { type: 'json' };

export async function GET(context) {
  let blog = await getCollection('blog', ({ data }) => {
    return data?.draft !== true;
  });
  // ({ data }) => import.meta.env.DEV || !data?.draft)
  blog.sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
  blog = blog.slice(0, 10);

  // get the full URL for the stylesheet
  // const fullUrl = new URL(context.request.url);
  // const currentOrigin = fullUrl.origin;
  // const stylesheetURL = new URL('/feeds/feed.xslt', currentOrigin).href;
  // const stylesheetURL = 'https://raw.githubusercontent.com/genmon/aboutfeeds/refs/heads/main/tools/pretty-feed-v3.xsl';

  return rss({
    description: setup.description,
    // stylesheet: stylesheetURL,
    items: blog.map((post) => ({
      categories: post.data.tags || [],
      description: post.data.description,
      link: `/blog/${post.slug}/`,
      pubDate: post.data.date,
      title: post.data.title,
      // commentsUrl: post.data.commentsUrl || null,
      // enclosure: {
      //   url: '/media/alpha-centauri.aac',
      //   length: 124568,
      //   type: 'audio/aac',
      // },
    })),
    site: context.site,
    title: setup.title,
  });
}
