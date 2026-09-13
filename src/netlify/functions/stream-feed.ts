import type { Config, Context } from '@netlify/functions';

import {
  listEligibleStatuses,
  loadMergedEnv,
  resolveMastodonAccount,
  resolveStreamConfigFromEnv,
} from '../../utils/mastodon-stream.ts';

export const config: Config = {
  method: 'GET',
};

interface FeedItem {
  id: string;
  url: string;
  title: string;
  content_html: string;
  date_published: string;
}

/**
 * JSON Feed (https://jsonfeed.org/version/1.1) for the stream's eligible
 * Mastodon posts. Reachable at `/.netlify/functions/stream-feed`; add a
 * `netlify.toml` redirect to a prettier path (e.g. `/stream/feed.json`) if
 * that becomes worth the added redirect-ordering complexity.
 *
 * @type {import('@netlify/functions').Handler}
 * Request/context are unused - the feed doesn't vary by request.
 * @returns {Promise<Response>} https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
export default async (_request: Request, _context: Context): Promise<Response> => {
  // Deployed functions get their env from Netlify's own config (no .env
  // file on disk); local `netlify dev` only auto-loads a project-root
  // `.env`, so merge in `${HOME}/.env` too for parity with the CLI.
  await loadMergedEnv();
  const streamConfig = resolveStreamConfigFromEnv();

  if (!streamConfig.accountId && !streamConfig.accountHandle) {
    return Response.json({ error: 'The stream is not configured.' }, { status: 500 });
  }

  try {
    const account = await resolveMastodonAccount(streamConfig);
    const eligible = await listEligibleStatuses(streamConfig, account, { limit: 40 });

    const items: FeedItem[] = eligible.map((status) => ({
      content_html: status.content,
      date_published: status.created_at,
      id: status.uri,
      title: status.spoiler_text || status.created_at,
      url: status.url ?? status.uri,
    }));

    const feed = {
      home_page_url: account.url,
      items,
      title: 'Stream',
      version: 'https://jsonfeed.org/version/1.1',
    };

    return Response.json(feed, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=21600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Failed to build the stream feed:', error);
    return Response.json({ error: 'The stream feed is temporarily unavailable.' }, { status: 502 });
  }
};
