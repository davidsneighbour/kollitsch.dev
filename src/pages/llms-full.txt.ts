import { getCollection } from 'astro:content';
import setup from '@data/setup.json' with { type: 'json' };
import {
  formatBlogPostPath,
  llmsFullTxt,
  postsToLlmsFullItems,
} from '@utils/llms';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', (post) => !post.data.draft);

  return llmsFullTxt({
    author: setup.author.name,
    description: setup.description,
    items: postsToLlmsFullItems(posts, formatBlogPostPath),
    name: setup.title,
    site: setup.url,
  });
};
