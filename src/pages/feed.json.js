import { getCollection } from 'astro:content';
import setup from '@data/setup.json' with { type: 'json' };

export async function GET(context) {
  let blog = await getCollection('blog', ({ data }) => {
    return data?.draft !== true;
  });
  blog.sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
  blog = blog.slice(0, 10);

  const site = context.site ?? new URL(setup.url);
  const homeUrl = new URL('/', site).toString();
  const feedUrl = new URL('/feed.json', site).toString();
  const getPostPath = (post) => {
    const normalise = (value) => value.replace(/^\/+|\/+$/g, '');
    const id = typeof post?.id === 'string' ? post.id : '';
    if (id) {
      return `/blog/${normalise(id)}/`;
    }

    const slug = typeof post?.slug === 'string' ? post.slug : '';
    if (slug) {
      const year = post?.data?.date
        ? new Date(post.data.date).getUTCFullYear()
        : Number.NaN;
      return Number.isFinite(year)
        ? `/blog/${year}/${normalise(slug)}/`
        : `/blog/${normalise(slug)}/`;
    }

    return '/blog/';
  };

  const items = blog.map((post) => {
    const postUrl = new URL(getPostPath(post), site).toString();
    const imageUrl = new URL(`${getPostPath(post)}og.png`, site).toString();
    return {
      date_published: new Date(post.data.date).toISOString(),
      id: postUrl,
      image: imageUrl,
      summary: post.data.description,
      tags: post.data.tags || [],
      title: post.data.title,
      url: postUrl,
    };
  });

  const feed = {
    description: setup.description,
    feed_url: feedUrl,
    home_page_url: homeUrl,
    items,
    title: setup.title,
    version: 'https://jsonfeed.org/version/1.1',
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}
