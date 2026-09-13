---
title: Stream
tags: []
created: 2026-09-12T00:00:00+07:00
updated: 2026-09-12T00:00:00+07:00
---

`/stream/` mirrors short, public Mastodon posts on the site without a
redeploy per post, and supports promoting one into a normal blog post. See
[Frontmatter](frontmatter.md) for the `origin` field this feature adds to
`blogSchema`.

## Source Files

| Area | File |
| --- | --- |
| Shared helpers (fetching, eligibility, normalisation, cache) | `src/utils/mastodon-stream.ts` |
| Isomorphic types and thread grouping | `src/utils/stream-shared.ts` |
| Netlify Function backing the page | `src/netlify/functions/stream.ts` |
| Stream page | `src/pages/stream/index.astro` |
| Stream components | `src/components/features/stream/StreamList.astro`, `src/components/features/stream/StreamItem.astro` |
| Promotion CLI | `src/scripts/content/promote-stream-post.ts` |
| Blog schema `origin` field | `src/content.config.ts` |

## Eligible Posts

A Mastodon status is shown in the stream when all of these are true:

- it is not a boost (`reblog` is `null`),
- its visibility is `public` or `unlisted`,
- it is either a top-level post, or a reply to the same configured account
  (a self-reply).

Boosts and replies to other accounts are excluded. See
`isEligibleStreamStatus()` in `src/utils/mastodon-stream.ts`.

Eligible self-replies are grouped into threads by `groupSelfReplyThreads()`
and rendered nested under their root post, newest thread first.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `MASTODON_INSTANCE_URL` | Mastodon instance base URL; defaults to `https://mas.to`. |
| `MASTODON_ACCOUNT_ID` | Preferred way to identify the source account. |
| `MASTODON_ACCOUNT_HANDLE` | Used to look up an account id when no id is configured. |
| `MASTODON_ACCESS_TOKEN` | Optional, for authenticated Mastodon API access. |

`promote-stream-post.ts` loads `${HOME}/.env` first, then a local `.env`,
with the local file overriding home values; both stay below whatever the
shell/CI has already exported. The deployed Netlify Function relies on
Netlify's own environment configuration instead.

## Caching

Local/dev runs cache Mastodon responses as files under
`.cache/mastodon-stream/` (`account.json`, `statuses-full.json`). The
deployed Netlify Function has no writable durable disk, so it relies on the
`Cache-Control: public, max-age=0, s-maxage=21600, stale-while-revalidate=86400`
response header (a 6-hour CDN cache) as its primary cache. On a fetch
failure the function and CLI both fall back to whatever they last cached,
and only return a hard error when no cached data exists either.

The client-side `StreamList.astro` script keeps its own copy of the last
successful response in `localStorage` (`mastodon_stream_cache_v1`; see
[Privacy policy](/privacy-policy/)) so the page can still show something
when the Netlify Function itself is unreachable from the browser.

## Promoting a Stream Post

`npm run promote:stream -- [id] [options]` converts an eligible Mastodon
status into `src/content/blog/YYYY/slug/index.md`, converting its HTML to
Markdown and adding an `origin` frontmatter block for provenance (see
[Frontmatter](frontmatter.md)). See
`src/scripts/DOCUMENTATION.md` for the full flag reference, including
`--offline`, `--dry-run`, `--force`, and `--keep-remote-media`. Media
attachments are downloaded into the post bundle by default.
