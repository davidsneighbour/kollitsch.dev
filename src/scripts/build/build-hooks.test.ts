// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest';

const { execFile } = vi.hoisted(() => ({ execFile: vi.fn() }));
vi.mock('node:child_process', () => ({ execFile }));

import { buildHooks } from './build-hooks.ts';

const logger = { debug: vi.fn(), info: vi.fn(), warn: vi.fn() };

async function generateFeeds() {
    const integration = buildHooks().find(({ name }) => name === 'dnb-followerfeeds');
    const hook = integration?.hooks['astro:build:start'];
    if (!hook) throw new Error('Missing feed integration');
    await hook({ logger } as never);
}

afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
});

describe('optional follower feed generation', () => {
    it('continues the build with a warning when FreshRSS fails', async () => {
        vi.stubEnv('FRESHRSS_BASE_URL', 'https://example.com');
        vi.stubEnv('FRESHRSS_USERNAME', 'test');
        vi.stubEnv('FRESHRSS_API_PASSWORD', 'test');
        execFile.mockImplementation((_command, _args, callback) => callback(new Error('Login failed')));

        await expect(generateFeeds()).resolves.toBeUndefined();
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('continuing the build'));
    });

    it('generates both feeds when FreshRSS succeeds', async () => {
        vi.stubEnv('FRESHRSS_BASE_URL', 'https://example.com');
        vi.stubEnv('FRESHRSS_USERNAME', 'test');
        vi.stubEnv('FRESHRSS_API_PASSWORD', 'test');
        execFile.mockImplementation((_command, _args, callback) => callback(null, '', ''));

        await generateFeeds();
        expect(execFile).toHaveBeenCalledTimes(2);
        expect(logger.warn).not.toHaveBeenCalled();
    });

    it('skips generation when credentials are absent', async () => {
        vi.stubEnv('FRESHRSS_BASE_URL', '');
        await generateFeeds();
        expect(execFile).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Skipping feed generation'));
    });
});
