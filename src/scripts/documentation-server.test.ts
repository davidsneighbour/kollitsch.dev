// @vitest-environment node

import { describe, expect, it } from 'vitest';

import {
  type DocumentationPage,
  renderDocumentationPage,
} from './documentation-server.ts';

describe('documentation server', () => {
  it('indents nested navigation levels distinctly', () => {
    const pages: DocumentationPage[] = [
      {
        filePath: '/docs/index.md',
        routePath: '/',
        title: 'Documentation',
      },
      {
        filePath: '/docs/content/frontmatter.md',
        routePath: '/content/frontmatter.md',
        title: 'Frontmatter',
      },
      {
        filePath: '/docs/components/content/taxonomy/tag-cloud.md',
        routePath: '/components/content/taxonomy/tag-cloud.md',
        title: 'TagCloud',
      },
    ];

    const html = renderDocumentationPage('# Frontmatter', pages[1]!, pages);

    expect(html).toContain('.nav-group details > ul');
    expect(html).toContain('margin: 0.2rem 0 0 0.75rem');
    expect(html).toContain('.nav-group .nav-group details > ul');
    expect(html).toContain('padding-left: 1rem');
  });
});
