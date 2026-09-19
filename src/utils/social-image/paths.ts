/**
 * Deterministic public paths for generated social/OG images.
 *
 * Single authoritative implementation of social-image path resolution,
 * shared by OpenGraphImage.astro, feed generation, and build-og-images.ts.
 * See scratch/og-image-generation.plan.md ("Stable filenames").
 */

const SOCIAL_IMAGE_URL_ROOT = '/images/social';
export const SOCIAL_IMAGE_OUTPUT_DIR = 'public/images/social';
export const SOCIAL_IMAGE_EXT = 'jpg';
/** Every generated social image shares these dimensions (see PLAN.md). */
export const SOCIAL_IMAGE_WIDTH = 1200;
export const SOCIAL_IMAGE_HEIGHT = 630;

export interface BlogPostIdentity {
  readonly year: string;
  readonly slug: string;
}

const BLOG_POST_ID_RE = /^(\d{4})\/([^/]+)$/;

/**
 * Parse a blog content-collection id ('2026/example-post', optionally with
 * a trailing '/index') into its year/slug identity.
 */
export function parseBlogPostId(id: string): BlogPostIdentity | undefined {
  const cleaned = id
    .replace(/^\/+|\/+$/g, '')
    .replace(/\.(md|mdx)$/i, '')
    .replace(/\/index$/, '');
  const match = BLOG_POST_ID_RE.exec(cleaned);
  if (!match) return undefined;
  const [, year, slug] = match;
  if (!year || !slug) return undefined;
  return { slug, year };
}

/**
 * Root-relative public URL for a blog post's social image, e.g.
 * '/images/social/blog/2026/example-post.jpg'. Returns undefined when
 * `id` doesn't match the '<year>/<slug>' blog identity shape.
 */
export function getBlogSocialImagePath(id: string): string | undefined {
  const identity = parseBlogPostId(id);
  if (!identity) return undefined;
  return `${SOCIAL_IMAGE_URL_ROOT}/blog/${identity.year}/${identity.slug}.${SOCIAL_IMAGE_EXT}`;
}

/** Root-relative public URL for the fallback social image. */
export function getDefaultSocialImagePath(): string {
  return `${SOCIAL_IMAGE_URL_ROOT}/default.${SOCIAL_IMAGE_EXT}`;
}

/** Repo-relative filesystem path (POSIX) for a blog post's social image. */
export function getBlogSocialImageFsPath(id: string): string | undefined {
  const identity = parseBlogPostId(id);
  if (!identity) return undefined;
  return `${SOCIAL_IMAGE_OUTPUT_DIR}/blog/${identity.year}/${identity.slug}.${SOCIAL_IMAGE_EXT}`;
}

/** Repo-relative filesystem path (POSIX) for the fallback social image. */
export function getDefaultSocialImageFsPath(): string {
  return `${SOCIAL_IMAGE_OUTPUT_DIR}/default.${SOCIAL_IMAGE_EXT}`;
}
