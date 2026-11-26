import type { Html, Root, Text } from 'mdast';
import { visit } from 'unist-util-visit';
import { renderBrandSvg } from './brand-logo.ts';

export interface TypographyReplacement {
  from: string;
  to: string;
}

// Longer patterns must appear before shorter overlapping ones (`---` before `--`).
const DASH_REPLACEMENTS: TypographyReplacement[] = [
  { from: '---', to: '—' },
  { from: '--', to: '–' },
];

const WORDMARK_SHORTHAND = /<wordmark\s*\/>/gi;

function applyReplacements(
  value: string,
  replacements: TypographyReplacement[],
): string {
  let result = value;

  for (const { from, to } of replacements) {
    result = result.replaceAll(from, to);
  }

  return result;
}

/**
 * Restores Hugo-style typography shortcuts (`--`, `---`) in prose Markdown
 * text nodes and expands site-specific raw-HTML authoring shorthands.
 *
 * `<wordmark/>` is authoring syntax only. It is rewritten at build time to
 * the inline SVG combination mark from `src/brand/kollitsch-brand`, so the
 * brand name in prose uses the official logo (see `brand-logo.ts`).
 */
export function remarkDnbTypography(
  replacements: TypographyReplacement[] = DASH_REPLACEMENTS,
) {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text) => {
      node.value = applyReplacements(node.value, replacements);
    });

    visit(tree, 'html', (node: Html) => {
      node.value = node.value.replace(WORDMARK_SHORTHAND, () =>
        renderBrandSvg('combination-mark', { class: 'brand-logo-inline' }),
      );
    });
  };
}
