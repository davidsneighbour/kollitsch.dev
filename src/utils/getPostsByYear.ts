import { getCollection } from 'astro:content';

export const blogPosts2021 = await getCollection('blog', ({ id }) => {
  return id.startsWith('2021/');
});
