// @vitest-environment node
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  collectBlogAliasRedirects,
  getBlogRouteFromFilePath,
  mergeRedirects,
  resolveBlogAliasPath,
} from './redirects.ts';

const root = path.resolve('/project/src/content/blog');

describe('getBlogRouteFromFilePath', () => {
  it('derives canonical blog routes from index and flat content files', () => {
    expect(
      getBlogRouteFromFilePath(
        path.join(root, '2026/current-post/index.md'),
        root,
      ),
    ).toBe('/blog/2026/current-post/');

    expect(
      getBlogRouteFromFilePath(path.join(root, '2026/current-post.mdx'), root),
    ).toBe('/blog/2026/current-post/');
  });
});

describe('resolveBlogAliasPath', () => {
  it('resolves relative aliases against the current content route folder', () => {
    expect(resolveBlogAliasPath('old-post', '/blog/2026/current-post/')).toBe(
      '/blog/2026/old-post/',
    );
  });

  it('resolves absolute aliases from the site root', () => {
    expect(
      resolveBlogAliasPath('/legacy/old-post', '/blog/2026/current-post/'),
    ).toBe('/legacy/old-post/');
  });

  it('rejects empty aliases', () => {
    expect(() => resolveBlogAliasPath(' ', '/blog/2026/current-post/')).toThrow(
      'aliases must not be empty',
    );
  });

  it('rejects unsupported external aliases and dot segments', () => {
    expect(() =>
      resolveBlogAliasPath(
        'https://example.com/old-post',
        '/blog/2026/current-post/',
      ),
    ).toThrow('only support local pathname aliases');

    expect(() =>
      resolveBlogAliasPath('../old-post', '/blog/2026/current-post/'),
    ).toThrow('dot segments are not supported');
  });
});

describe('collectBlogAliasRedirects', () => {
  it('creates redirects from string and array aliases', () => {
    expect(
      collectBlogAliasRedirects(
        [
          {
            aliases: ['old-post', '/legacy/old-post'],
            filePath: path.join(root, '2026/current-post/index.md'),
          },
          {
            aliases: 'flat-old-post',
            filePath: path.join(root, '2026/flat-current-post.md'),
          },
        ],
        root,
      ),
    ).toEqual({
      '/blog/2026/flat-old-post/': '/blog/2026/flat-current-post/',
      '/blog/2026/old-post/': '/blog/2026/current-post/',
      '/legacy/old-post/': '/blog/2026/current-post/',
    });
  });

  it('rejects generated alias collisions', () => {
    expect(() =>
      collectBlogAliasRedirects(
        [
          {
            aliases: 'old-post',
            filePath: path.join(root, '2026/current-post/index.md'),
          },
          {
            aliases: 'old-post',
            filePath: path.join(root, '2026/another-post/index.md'),
          },
        ],
        root,
      ),
    ).toThrow('Duplicate generated alias redirect for /blog/2026/old-post/');
  });

  it('rejects aliases that resolve to the canonical route', () => {
    expect(() =>
      collectBlogAliasRedirects(
        [
          {
            aliases: 'current-post',
            filePath: path.join(root, '2026/current-post/index.md'),
          },
        ],
        root,
      ),
    ).toThrow('resolves to its canonical route');
  });
});

describe('mergeRedirects', () => {
  it('rejects conflicts with existing redirects', () => {
    expect(() =>
      mergeRedirects(
        { '/blog/2026/old-post/': '/manual/' },
        { '/blog/2026/old-post/': '/blog/2026/current-post/' },
      ),
    ).toThrow(
      'Generated alias redirect conflicts with existing redirect: /blog/2026/old-post/',
    );
  });
});
