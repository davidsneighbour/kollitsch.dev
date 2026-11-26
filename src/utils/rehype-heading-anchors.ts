import type { Element, ElementContent, Root, RootContent } from 'hast';

/** Heading levels that get a section anchor link. */
const ANCHORED_HEADINGS = new Set(['h2', 'h3', 'h4']);

/**
 * Appends an empty, labelled anchor link to every `h2` to `h4` that has an
 * `id`. The visible `#` comes from CSS (`.heading-anchor::before`), so the
 * link adds no text to the heading. Astro's heading collection (and so the
 * table of contents) reads the heading text unchanged.
 *
 * The headings need ids before this runs: list Astro's `rehypeHeadingIds`
 * before this plugin in `astro.config.ts`.
 */
export function addHeadingAnchors(tree: Root): void {
  const walk = (nodes: (RootContent | ElementContent)[]): void => {
    for (const node of nodes) {
      if (node.type !== 'element') continue;
      if (ANCHORED_HEADINGS.has(node.tagName)) {
        appendAnchor(node);
        continue;
      }
      walk(node.children);
    }
  };
  walk(tree.children);
}

function appendAnchor(heading: Element): void {
  const id = heading.properties?.id;
  if (typeof id !== 'string' || id.length === 0) return;
  const hasAnchor = heading.children.some(
    (child) =>
      child.type === 'element' &&
      Array.isArray(child.properties?.className) &&
      child.properties.className.includes('heading-anchor'),
  );
  if (hasAnchor) return;
  heading.children.push({
    children: [],
    properties: {
      ariaLabel: 'Link to this section',
      className: ['heading-anchor'],
      href: `#${id}`,
    },
    tagName: 'a',
    type: 'element',
  });
}

/** Rehype plugin wrapper for `addHeadingAnchors`. */
export function rehypeHeadingAnchors() {
  return (tree: Root): void => {
    addHeadingAnchors(tree);
  };
}
