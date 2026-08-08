import type { Root, Text } from 'mdast';
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
 * text nodes. Inline code, fenced code, block HTML, raw HTML tags/attributes,
 * and frontmatter are separate mdast nodes, so they are intentionally outside
 * this transform's reach.
 */
export function remarkDnbTypography(
  replacements: TypographyReplacement[] = DASH_REPLACEMENTS,
) {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text) => {
      node.value = applyReplacements(node.value, replacements);
    });
  };
}
