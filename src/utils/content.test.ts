// @vitest-environment node
import { getVSCodeURL, getVSCodeUrlById } from '@utils/content';
import { stripHtmlTags } from '@utils/content.pure';
import { describe, expect, it } from 'vitest';

describe('getVSCodeURL', () => {
  it('returns a vscode://file/ URL', () => {
    expect(getVSCodeURL('src/utils/content.ts')).toMatch(/^vscode:\/\/file\//);
  });

  it('produces the same path whether relativePath has a leading slash or not', () => {
    const withSlash = getVSCodeURL('/src/utils/content.ts');
    const withoutSlash = getVSCodeURL('src/utils/content.ts');
    expect(withSlash).toBe(withoutSlash);
  });

  it('does not double the separator between project root and relative path', () => {
    // path.join normalises both forms — the old string-concat would produce
    // `projectRoot + 'src/...'` → `…/kollitsch.devsrc/…` (missing separator)
    const url = getVSCodeURL('src/utils/content.ts');
    expect(url).not.toMatch(/[^/]src\//); // no missing separator before src/
  });
});

describe('getVSCodeUrlById', () => {
  it('builds a vscode URL for a blog post by id', () => {
    const url = getVSCodeUrlById('2024/my-post');
    expect(url).toMatch(/^vscode:\/\/file\//);
    expect(url).toContain('src/content/blog/2024/my-post/index.md');
  });
});

describe('stripHtmlTags', () => {
  it('removes inline HTML tags from post titles', () => {
    expect(
      stripHtmlTags(
        'Keeping <code>engines.node</code> aligned with the Node release schedule',
      ),
    ).toBe('Keeping engines.node aligned with the Node release schedule');
  });

  it('collapses redundant whitespace after stripping tags', () => {
    expect(stripHtmlTags('Hello <em>there</em>   world')).toBe(
      'Hello there world',
    );
  });
});
