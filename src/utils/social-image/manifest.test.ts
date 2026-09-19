// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('manifest', () => {
  afterEach(() => {
    vi.doUnmock('node:fs');
    vi.resetModules();
  });

  it('readManifest returns {} when the manifest file does not exist', async () => {
    vi.doMock('node:fs', () => ({
      default: {
        mkdirSync: vi.fn(),
        readFileSync: vi.fn(() => {
          throw new Error('ENOENT');
        }),
        writeFileSync: vi.fn(),
      },
    }));

    const { readManifest } = await import('./manifest.ts');
    expect(readManifest()).toEqual({});
  });

  it('readManifest parses an existing manifest file', async () => {
    const stored = {
      'public/images/social/blog/2026/slug.jpg': {
        fingerprint: 'abc123',
        generatedAt: '2026-01-01T00:00:00.000Z',
      },
    };
    vi.doMock('node:fs', () => ({
      default: {
        mkdirSync: vi.fn(),
        readFileSync: vi.fn(() => JSON.stringify(stored)),
        writeFileSync: vi.fn(),
      },
    }));

    const { readManifest } = await import('./manifest.ts');
    expect(readManifest()).toEqual(stored);
  });

  it('writeManifest creates the cache directory and writes formatted JSON', async () => {
    const mkdirSync = vi.fn();
    const writeFileSync = vi.fn();
    vi.doMock('node:fs', () => ({
      default: { mkdirSync, readFileSync: vi.fn(), writeFileSync },
    }));

    const { writeManifest } = await import('./manifest.ts');
    const manifest = {
      'public/images/social/default.jpg': {
        fingerprint: 'xyz',
        generatedAt: '2026-01-01T00:00:00.000Z',
      },
    };
    writeManifest(manifest);

    expect(mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining('.cache/social-images'),
      { recursive: true },
    );
    expect(writeFileSync).toHaveBeenCalledTimes(1);
    const [writtenPath, writtenContent] = writeFileSync.mock.calls[0]!;
    expect(writtenPath).toContain('.cache/social-images/manifest.json');
    expect(JSON.parse(writtenContent as string)).toEqual(manifest);
  });
});
