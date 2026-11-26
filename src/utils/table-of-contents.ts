import type { MarkdownHeading } from 'astro';

/** A post needs at least this many `h2` headings to show a table of contents. */
export const TOC_MIN_SECTIONS = 4;

/**
 * Returns the `h2` and `h3` headings for a post's table of contents, or an
 * empty list when the post has fewer than `minSections` `h2` headings.
 */
export function getTocHeadings(
  headings: MarkdownHeading[],
  minSections: number = TOC_MIN_SECTIONS,
): MarkdownHeading[] {
  const entries = headings.filter(
    (heading) =>
      (heading.depth === 2 || heading.depth === 3) && heading.slug.length > 0,
  );
  const sections = entries.filter((heading) => heading.depth === 2).length;
  return sections >= minSections ? entries : [];
}
