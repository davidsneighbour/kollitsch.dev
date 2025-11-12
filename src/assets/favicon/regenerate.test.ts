// @vitest-environment node
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('generateFavicon - additional cases', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs error when png-to-ico fails', async () => {
    const log = vi.fn();
    const error = vi.fn();
    vi.stubGlobal('console', { log, error });

    vi.doMock('node:fs/promises', () => ({
      mkdir: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn().mockResolvedValue(Buffer.from('<svg/>')),
      writeFile: vi.fn().mockResolvedValue(undefined),
    }));

    vi.doMock('sharp', () => ({
      default: vi.fn().mockImplementation(() => {
        const ret: any = {
          resize() {
            return ret;
          },
          png() {
            return ret;
          },
          toBuffer: async () => Buffer.from('png'),
        };
        return ret;
      }),
    }));

    vi.doMock('png-to-ico', () => ({
      default: vi.fn().mockRejectedValue(new Error('ico failed')),
    }));

    const mod = await import('./regenerate');
    const opts = {
      svgPath: 'in.svg',
      pngPath: 'out.png',
      icoPath: 'out.ico',
      pngSize: 512,
      icoSizes: [16, 32],
    };
    await mod.generateFavicon(opts);

    expect(error).toHaveBeenCalled();
    const arg = String(error.mock.calls[0]?.[1] ?? '');
    expect(arg).toContain('ico failed');

    expect(log.mock.calls.some((c) => String(c[0]).includes('PNG saved'))).toBe(true);
    expect(log.mock.calls.some((c) => String(c[0]).includes('ICO saved'))).toBe(false);
  });

  it('logs error when writing ICO fails', async () => {
    const log = vi.fn();
    const error = vi.fn();
    vi.stubGlobal('console', { log, error });

    vi.doMock('node:fs/promises', () => ({
      mkdir: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn().mockResolvedValue(Buffer.from('<svg/>')),
      writeFile: vi
        .fn()
        .mockResolvedValueOnce(undefined) // PNG write succeeds
        .mockRejectedValueOnce(new Error('write ico failed')), // ICO write fails
    }));

    vi.doMock('sharp', () => ({
      default: vi.fn().mockImplementation(() => {
        const ret: any = {
          resize() {
            return ret;
          },
          png() {
            return ret;
          },
          toBuffer: async () => Buffer.from('png'),
        };
        return ret;
      }),
    }));

    vi.doMock('png-to-ico', () => ({
      default: vi.fn().mockResolvedValue(Buffer.from('ico')),
    }));

    const mod = await import('./regenerate');
    const opts = {
      svgPath: 'in.svg',
      pngPath: 'out.png',
      icoPath: 'out.ico',
      pngSize: 512,
      icoSizes: [16, 32],
    };
    await mod.generateFavicon(opts);

    expect(error).toHaveBeenCalled();
    const arg = String(error.mock.calls[0]?.[1] ?? '');
    expect(arg).toContain('write ico failed');

    expect(log.mock.calls.some((c) => String(c[0]).includes('PNG saved'))).toBe(true);
    expect(log.mock.calls.some((c) => String(c[0]).includes('ICO saved'))).toBe(false);
  });

  it('saves both PNG and ICO on success', async () => {
    const log = vi.fn();
    const error = vi.fn();
    vi.stubGlobal('console', { log, error });

    vi.doMock('node:fs/promises', () => ({
      mkdir: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn().mockResolvedValue(Buffer.from('<svg/>')),
      writeFile: vi.fn().mockResolvedValue(undefined),
    }));

    vi.doMock('sharp', () => ({
      default: vi.fn().mockImplementation(() => {
        const ret: any = {
          resize() {
            return ret;
          },
          png() {
            return ret;
          },
          toBuffer: async () => Buffer.from('png'),
        };
        return ret;
      }),
    }));

    vi.doMock('png-to-ico', () => ({
      default: vi.fn().mockResolvedValue(Buffer.from('ico')),
    }));

    const mod = await import('./regenerate');
    const opts = {
      svgPath: 'in.svg',
      pngPath: 'out.png',
      icoPath: 'out.ico',
      pngSize: 512,
      icoSizes: [16, 32],
    };
    await mod.generateFavicon(opts);

    expect(error).not.toHaveBeenCalled();
    expect(log.mock.calls.some((c) => String(c[0]).includes('PNG saved'))).toBe(true);
    expect(log.mock.calls.some((c) => String(c[0]).includes('ICO saved'))).toBe(true);
  });

  it('logs error when readFile fails', async () => {
    const log = vi.fn();
    const error = vi.fn();
    vi.stubGlobal('console', { log, error });

    vi.doMock('node:fs/promises', () => ({
      mkdir: vi.fn().mockResolvedValue(undefined),
      readFile: vi.fn().mockRejectedValue(new Error('read failed')),
      writeFile: vi.fn().mockResolvedValue(undefined),
    }));

    vi.doMock('sharp', () => ({
      default: vi.fn().mockImplementation(() => {
        const ret: any = {
          resize() {
            return ret;
          },
          png() {
            return ret;
          },
          toBuffer: async () => Buffer.from('png'),
        };
        return ret;
      }),
    }));

    vi.doMock('png-to-ico', () => ({
      default: vi.fn().mockResolvedValue(Buffer.from('ico')),
    }));

    const mod = await import('./regenerate');
    const opts = {
      svgPath: 'in.svg',
      pngPath: 'out.png',
      icoPath: 'out.ico',
      pngSize: 512,
      icoSizes: [16, 32],
    };
    await mod.generateFavicon(opts);

    expect(error).toHaveBeenCalled();
    const arg = String(error.mock.calls[0]?.[1] ?? '');
    expect(arg).toContain('read failed');

    expect(log.mock.calls.some((c) => String(c[0]).includes('PNG saved'))).toBe(false);
    expect(log.mock.calls.some((c) => String(c[0]).includes('ICO saved'))).toBe(false);
  });
});
