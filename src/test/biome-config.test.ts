// @vitest-environment node

import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { expect, it } from 'vitest';

it('leaves Markdown YAML frontmatter intact when applying safe fixes', () => {
  const source = `---
options:
  head:
    components:
      - date-diff
---

Test.
`;
  const output = execFileSync(
    resolve('node_modules/.bin/biome'),
    ['check', '--write', '--stdin-file-path=src/pages/colophon.md'],
    { encoding: 'utf8', input: source },
  );
  expect(output).toBe(source);
});
