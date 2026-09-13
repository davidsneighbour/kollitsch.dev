import type { Config, Context } from '@netlify/functions';

import {
  listEligibleStatuses,
  loadMergedEnv,
  normaliseStreamStatus,
  resolveMastodonAccount,
  resolveStreamConfigFromEnv,
  type StreamStatus,
} from '../../utils/mastodon-stream.ts';

export const config: Config = {
  method: 'GET',
  // path: "/api/stream",
};

interface StreamResponseBody {
  accountUrl: string;
  fetchedAt: string;
  statuses: StreamStatus[];
}

/**
 * @type {import('@netlify/functions').Handler}
 * Request/context are unused - the stream doesn't vary by request.
 * @returns {Promise<Response>} https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
export default async (_request: Request, _context: Context): Promise<Response> => {
  // Deployed functions get their env from Netlify's own config (no .env
  // file on disk); local `netlify dev` only auto-loads a project-root
  // `.env`, so merge in `${HOME}/.env` too for parity with the CLI.
  await loadMergedEnv();
  const streamConfig = resolveStreamConfigFromEnv();

  if (!streamConfig.accountId && !streamConfig.accountHandle) {
    console.error('Missing MASTODON_ACCOUNT_ID/MASTODON_ACCOUNT_HANDLE.');
    return Response.json({ error: 'The stream is not configured.' }, { status: 500 });
  }

  try {
    const account = await resolveMastodonAccount(streamConfig);
    const eligible = await listEligibleStatuses(streamConfig, account, { limit: 40 });
    const body: StreamResponseBody = {
      accountUrl: account.url,
      fetchedAt: new Date().toISOString(),
      statuses: eligible.map(normaliseStreamStatus),
    };

    return Response.json(body, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=21600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Failed to load the Mastodon stream:', error);
    return Response.json(
      { error: 'The stream is temporarily unavailable.' },
      { status: 502 },
    );
  }
};
