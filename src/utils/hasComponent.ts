import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

// literal component values as defined in your schema
const allowedComponents = ['lite-youtube', 'color-grid', 'date-diff'] as const;
type ComponentName = (typeof allowedComponents)[number];

/**
 * Check whether a specific frontend component is declared in a post's frontmatter.
 *
 * This utility inspects `post.data.options.head.components`, which is an optional
 * part of the frontmatter schema, and verifies whether the requested component name
 * is present in the components array.
 *
 * This is useful for conditionally injecting scripts, stylesheets, or features
 * based on per-post needs.
 *
 * @param post - The `post` object from Astro.props. Can be undefined or unstructured.
 * @param name - The name of the component to check for (e.g. 'lite-youtube').
 * @returns `true` if the named component exists in the post options, `false` otherwise.
 *
 * @example
 * // Inside a .astro file:
 * const post = Astro.props?.post;
 *
 * if (hasComponent(post, 'lite-youtube')) {
 *   // Inject script and stylesheet for lite-youtube
 * }
 *
 * @example
 * // Typical frontmatter setup:
 * ---
 * title: "My Post"
 * options:
 *   head:
 *     components:
 *       - "lite-youtube"
 * ---
 */
export function hasComponent(
  post: BlogPost | undefined,
  name: ComponentName,
): boolean {
  return !!post?.data?.options?.head?.components?.includes(name);
}
