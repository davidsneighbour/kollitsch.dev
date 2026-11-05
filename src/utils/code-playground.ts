/**
 * Build-time loader for code playground examples.
 *
 * Example files are discovered with Vite's `import.meta.glob`, so the dev
 * server watches them and only the requested example is read. Import this
 * module from `.astro` frontmatter only; never from browser code.
 */
import type { PlaygroundDescriptor } from './code-playground.pure.ts';
import { createDescriptor } from './code-playground.schema.ts';

const EXAMPLE_ROOT = '/src/content/blog/';

const exampleFiles = import.meta.glob<string>(
  '/src/content/blog/*/*/examples/*/**/*.{html,css,js,json}',
  { import: 'default', query: '?raw' },
);

/**
 * Loads and validates one example. `leaf` is `<year>/<post-slug>` and
 * `example` is the directory name below the post's `examples/` folder.
 * Throws when the example is missing or invalid.
 */
export async function loadPlayground(
  leaf: string,
  example: string,
): Promise<PlaygroundDescriptor> {
  const prefix = `${EXAMPLE_ROOT}${leaf}/examples/${example}/`;
  const entries = Object.entries(exampleFiles).filter(([key]) =>
    key.startsWith(prefix),
  );
  if (entries.length === 0) {
    throw new Error(
      `Code playground "${leaf}#${example}": no files found in ${prefix}.`,
    );
  }

  const files: Record<string, string> = {};
  for (const [key, load] of entries) {
    files[key.slice(prefix.length)] = await load();
  }

  return createDescriptor({ example, files, leaf });
}
