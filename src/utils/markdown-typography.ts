import type { Html, Root, Text } from 'mdast';
import { visit } from 'unist-util-visit';

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
 * `<wordmark/>` is intentionally authoring syntax only. It is rewritten to
 * the standards-compliant custom element `<word-mark></word-mark>` because
 * Custom Elements names require a hyphen and HTML custom elements cannot be
 * self-closing.
 */
export function remarkDnbTypography(
  replacements: TypographyReplacement[] = DASH_REPLACEMENTS,
) {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text) => {
      node.value = applyReplacements(node.value, replacements);
    });

    visit(tree, 'html', (node: Html) => {
      node.value = node.value.replace(
        WORDMARK_SHORTHAND,
        '<word-mark></word-mark>',
      );
    });
  };
}
