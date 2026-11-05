// @vitest-environment node

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDescriptor } from '@utils/code-playground.schema.ts';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import CodePlaygroundIsland from './CodePlaygroundIsland.tsx';

const here = path.dirname(fileURLToPath(import.meta.url));
const leaf = '2026/halftone-typography-with-css';
const exampleDir = path.resolve('src/content/blog', leaf, 'examples/halftone');
const descriptor = createDescriptor({
  example: 'halftone',
  files: Object.fromEntries(
    readdirSync(exampleDir).map((name) => [
      name,
      readFileSync(path.join(exampleDir, name), 'utf8'),
    ]),
  ),
  leaf,
});

const render = (): string =>
  renderToString(
    createElement(
      CodePlaygroundIsland,
      { descriptor },
      createElement('p', { id: 'static-source' }, 'Static source'),
    ),
  );

describe('CodePlayground component', () => {
  it('exports typed props and hydrates the island when visible', () => {
    const src = readFileSync(path.join(here, 'CodePlayground.astro'), 'utf8');
    expect(src).toContain('export interface Props');
    expect(src).toContain('client:visible');
    expect(src).toContain('loadPlayground(leaf, example)');
  });

  it('loads Sandpack only through a dynamic import', () => {
    const island = readFileSync(
      path.join(here, 'CodePlaygroundIsland.tsx'),
      'utf8',
    );
    expect(island).not.toMatch(/from ['"]@codesandbox/);
    expect(island).toContain("import('./PlaygroundEditor.tsx')");
    expect(island).toMatch(
      /import type \{[^}]*\} from '\.\/PlaygroundEditor\.tsx'/,
    );
  });

  it('server-renders a sandboxed preview without a bridge origin', () => {
    const html = render();
    expect(html).toContain('sandbox="allow-scripts"');
    expect(html).not.toContain('allow-same-origin');
    expect(html).toContain('title="Halftone typography preview"');
    expect(html).toContain('&quot;origin&quot;:null');
  });

  it('renders disabled controls and the static source before hydration', () => {
    const html = render();
    expect(html).toMatch(/<fieldset disabled=""/);
    expect(html).toContain('Edit code');
    expect(html).toContain('id="static-source"');
    expect(html).toContain('role="status"');
  });
});
