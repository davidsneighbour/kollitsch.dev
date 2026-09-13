// @vitest-environment node

import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  cachePaths,
  fetchMastodonStatuses,
  groupSelfReplyThreads,
  isEligibleStreamStatus,
  loadMergedEnv,
  type MastodonStatus,
  normaliseStreamStatus,
  resolveMastodonAccount,
  statusHtmlToMarkdown,
  statusToSuggestedPost,
} from './mastodon-stream.ts';

const ACCOUNT_ID = '1';
const OTHER_ACCOUNT_ID = '2';

function makeStatus(overrides: Partial<MastodonStatus> = {}): MastodonStatus {
  return {
    content: '<p>Hello <strong>world</strong></p>',
    created_at: '2026-09-12T10:00:00.000Z',
    favourites_count: 0,
    id: '100',
    in_reply_to_account_id: null,
    in_reply_to_id: null,
    media_attachments: [],
    reblog: null,
    reblogs_count: 0,
    replies_count: 0,
    sensitive: false,
    spoiler_text: '',
    tags: [],
    uri: 'https://mas.to/users/davidsneighbour/statuses/100',
    url: 'https://mas.to/@davidsneighbour/100',
    visibility: 'public',
    ...overrides,
  };
}

describe('isEligibleStreamStatus', () => {
  it('keeps an original public post', () => {
    expect(isEligibleStreamStatus(makeStatus(), ACCOUNT_ID)).toBe(true);
  });

  it('excludes a boost', () => {
    expect(
      isEligibleStreamStatus(makeStatus({ reblog: { id: '999' } }), ACCOUNT_ID),
    ).toBe(false);
  });

  it('excludes a reply to another account', () => {
    const status = makeStatus({
      in_reply_to_account_id: OTHER_ACCOUNT_ID,
      in_reply_to_id: '50',
    });
    expect(isEligibleStreamStatus(status, ACCOUNT_ID)).toBe(false);
  });

  it('keeps a self-reply', () => {
    const status = makeStatus({
      in_reply_to_account_id: ACCOUNT_ID,
      in_reply_to_id: '50',
    });
    expect(isEligibleStreamStatus(status, ACCOUNT_ID)).toBe(true);
  });

  it('excludes private/direct visibility', () => {
    expect(
      isEligibleStreamStatus(makeStatus({ visibility: 'private' }), ACCOUNT_ID),
    ).toBe(false);
    expect(
      isEligibleStreamStatus(makeStatus({ visibility: 'direct' }), ACCOUNT_ID),
    ).toBe(false);
  });
});

describe('normaliseStreamStatus', () => {
  it('sanitises content and maps media/counts', () => {
    const status = makeStatus({
      content: '<p onclick="evil()">Hi <script>alert(1)</script></p>',
      favourites_count: 3,
      media_attachments: [
        {
          blurhash: null,
          description: 'A photo',
          id: 'm1',
          preview_url: 'https://mas.to/media/1-small.jpg',
          type: 'image',
          url: 'https://mas.to/media/1.jpg',
        },
      ],
      reblogs_count: 1,
      replies_count: 2,
    });

    const normalised = normaliseStreamStatus(status);

    expect(normalised.contentHtml).not.toContain('<script>');
    expect(normalised.contentHtml).not.toContain('onclick');
    expect(normalised.contentHtml).toContain('Hi');
    expect(normalised.media).toEqual([
      {
        description: 'A photo',
        previewUrl: 'https://mas.to/media/1-small.jpg',
        type: 'image',
        url: 'https://mas.to/media/1.jpg',
      },
    ]);
    expect(normalised.counts).toEqual({ boosts: 1, favourites: 3, replies: 2 });
  });
});

describe('groupSelfReplyThreads', () => {
  it('groups a self-reply chain under its root, newest thread first', () => {
    const root = normaliseStreamStatus(
      makeStatus({ created_at: '2026-09-10T00:00:00.000Z', id: '1' }),
    );
    const reply = normaliseStreamStatus(
      makeStatus({
        created_at: '2026-09-10T00:05:00.000Z',
        id: '2',
        in_reply_to_account_id: ACCOUNT_ID,
        in_reply_to_id: '1',
      }),
    );
    const other = normaliseStreamStatus(
      makeStatus({ created_at: '2026-09-11T00:00:00.000Z', id: '3' }),
    );

    const threads = groupSelfReplyThreads([root, reply, other]);

    expect(threads).toHaveLength(2);
    expect(threads[0]?.root.id).toBe('3');
    expect(threads[1]?.root.id).toBe('1');
    expect(threads[1]?.replies.map((r) => r.id)).toEqual(['2']);
  });
});

describe('statusHtmlToMarkdown', () => {
  it('converts basic HTML to Markdown', () => {
    const markdown = statusHtmlToMarkdown(
      '<p>Hello <strong>world</strong></p>',
    );
    expect(markdown).toBe('Hello **world**');
  });
});

describe('statusToSuggestedPost', () => {
  it('builds origin metadata and a media list', () => {
    const status = makeStatus();
    const suggested = statusToSuggestedPost(status, '@davidsneighbour@mas.to');

    expect(suggested.origin).toMatchObject({
      account: '@davidsneighbour@mas.to',
      id: '100',
      published: status.created_at,
      type: 'mastodon',
      uri: status.uri,
      url: status.url,
    });
    expect(typeof suggested.origin.imported).toBe('string');
    expect(suggested.bodyMarkdown).toContain('world');
  });
});

describe('loadMergedEnv', () => {
  let homeDir: string;
  let cwdDir: string;

  beforeEach(async () => {
    homeDir = await mkdtemp(path.join(tmpdir(), 'mastodon-home-'));
    cwdDir = await mkdtemp(path.join(tmpdir(), 'mastodon-cwd-'));
  });

  afterEach(async () => {
    await rm(homeDir, { force: true, recursive: true });
    await rm(cwdDir, { force: true, recursive: true });
  });

  it('merges home then local .env, local overriding home', async () => {
    await writeFile(
      path.join(homeDir, '.env'),
      'MASTODON_INSTANCE_URL=https://home.example\nSHARED=home\n',
    );
    await writeFile(path.join(cwdDir, '.env'), 'SHARED=local\n');

    const merged = await loadMergedEnv({
      apply: false,
      cwd: cwdDir,
      home: homeDir,
    });

    expect(merged).toEqual({
      MASTODON_INSTANCE_URL: 'https://home.example',
      SHARED: 'local',
    });
  });
});

describe('cachePaths / fetchMastodonStatuses fallback', () => {
  let cacheDir: string;

  beforeEach(async () => {
    cacheDir = await mkdtemp(path.join(tmpdir(), 'mastodon-cache-'));
  });

  afterEach(async () => {
    await rm(cacheDir, { force: true, recursive: true });
  });

  it('falls back to cached statuses when the network fetch fails', async () => {
    const cached: MastodonStatus[] = [makeStatus()];
    const paths = cachePaths(cacheDir);
    await import('node:fs/promises').then(({ mkdir, writeFile: write }) =>
      mkdir(path.dirname(paths.statusesFull), { recursive: true }).then(() =>
        write(paths.statusesFull, JSON.stringify(cached)),
      ),
    );

    const statuses = await fetchMastodonStatuses(
      { instanceUrl: 'https://mas.to' },
      {
        acct: 'davidsneighbour',
        id: ACCOUNT_ID,
        url: '',
        username: 'davidsneighbour',
      },
      {
        cacheDir,
        fetchImpl: (async () => {
          throw new Error('network down');
        }) as unknown as typeof fetch,
      },
    );

    expect(statuses).toHaveLength(1);
    expect(statuses[0]?.id).toBe('100');
  });

  it('resolveMastodonAccount falls back to a cached account', async () => {
    const paths = cachePaths(cacheDir);
    await import('node:fs/promises').then(({ mkdir, writeFile: write }) =>
      mkdir(path.dirname(paths.account), { recursive: true }).then(() =>
        write(
          paths.account,
          JSON.stringify({
            acct: 'x',
            id: ACCOUNT_ID,
            url: 'https://mas.to/@x',
            username: 'x',
          }),
        ),
      ),
    );

    const account = await resolveMastodonAccount(
      { instanceUrl: 'https://mas.to' },
      { cacheDir },
    );

    expect(account.id).toBe(ACCOUNT_ID);
  });
});
