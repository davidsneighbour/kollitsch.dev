export function urlForPost(post: { slug: string }): string {
  const parts = post.slug.split('/');
  if (parts.length !== 2) {
    console.warn(`[urlForPost] Unexpected slug format: ${post.slug}`);
    return `/blog/${post.slug}/`; // fallback
  }

  const [year, slug] = parts;
  return `/blog/${year}/${slug}/`;
}
