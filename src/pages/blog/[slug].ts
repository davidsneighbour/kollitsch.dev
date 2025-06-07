// redirect /blog/some-title to /blog/yyyy/some-title if the content exists

import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const prerender = false;
export const GET: APIRoute = async ({ params, redirect }) => {
  const { slug } = params;
  const posts = await getCollection('blog');
  const found = posts.find((p) => p.slug.endsWith(`/${slug}`));
  if (!found) {
    console.log('/blog/[slug].ts - content not found:', params);
    return redirect('/blog/', 301);
  }
  const [year, realSlug] = found.slug.split('/');
  return redirect(`/blog/${year}/${realSlug}/`, 301);
};
