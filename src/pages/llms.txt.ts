import { getCollection } from 'astro:content';
import setup from '@data/setup.json';
import { llmsTxt, postsToLlmsItems } from '@utils/llms';
import type { APIRoute } from 'astro';

const formatLlmsUrl = (slug: string) => `/llms/${slug}.txt`;

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', (post) => !post.data.draft);

  return llmsTxt({
    description: setup.description,
    items: postsToLlmsItems(posts, formatLlmsUrl),
    name: setup.title,
    optional: [
      { description: 'About the author', link: '/about', title: 'About' },
      {
        description: 'Subscribe to updates',
        link: '/rss.xml',
        title: 'RSS Feed',
      },
      {
        description: 'Subscribe via Atom',
        link: '/atom.xml',
        title: 'Atom Feed',
      },
      {
        description: 'Subscribe via JSON Feed',
        link: '/feed.json',
        title: 'JSON Feed',
      },
      {
        description: 'Complete post content for deeper context',
        link: '/llms-full.txt',
        title: 'Full Content',
      },
    ],
    site: setup.url,
  });
};
