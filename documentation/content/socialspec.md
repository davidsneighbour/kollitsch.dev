---
title: SocialSpec well-known files
tags: []
created: 2026-10-19T00:00:00+07:00
updated: 2026-10-19T00:00:00+07:00
---

KOLLITSCH.dev publishes the three [SocialSpec](https://socialspec.org/) files. Each file is a single static document that any client can fetch with one `GET` request.

| File | Specification | Format | Content type |
| --- | --- | --- | --- |
| `/.well-known/following.opml` | [FollowSpec](https://followspec.org/) | OPML 2.0 subscription list | `text/x-opml; charset=utf-8` |
| `/.well-known/about.md` | [AboutSpec](https://aboutspec.org/) | Markdown with a `summary` frontmatter field | `text/markdown; charset=utf-8` |
| `/.well-known/contact.vcf` | [ContactSpec](https://contactspec.org/) | vCard 4.0 (RFC 6350, `SOCIALPROFILE` from RFC 9554) | `text/vcard; charset=utf-8` |

The specifications are v1 drafts. Their RFC issues on GitHub do not yet contain details, so the implementation follows the examples on the specification pages.

## Where to change the content

Edit [`src/data/socialspec.ts`](../../src/data/socialspec.ts). It exports one object per file:

* `following` - built from the entries in [`src/content/blogroll.json`](../../src/content/blogroll.json) that have an `rss` URL. Entries without a feed URL stay on the blogroll page but are not subscriptions, so they are not in the OPML file. Add an `rss` value to a blogroll entry to publish it.
* `about` - the summary is the site description and the body is the site introduction from [`src/data/setup.json`](../../src/data/setup.json). The links list is the site URL followed by the social profiles in `PROFILE_IDS`.
* `contact` - name, nickname, location, time zone, languages, profile image, and the same social profiles. `email` is empty by default; set it to a public address to add an `EMAIL;PREF=1` property.

`PROFILE_IDS` refers to `id` values in [`src/content/social.json`](../../src/content/social.json). The build fails if an id has no URL there.

## Implementation

* [`src/utils/socialspec.pure.ts`](../../src/utils/socialspec.pure.ts) holds the file paths, content types, CORS headers, and the three renderers. It escapes XML and vCard text values, folds vCard lines at 75 octets, and uses CRLF line endings in the vCard.
* `src/pages/.well-known/following.opml.ts`, `about.md.ts`, and `contact.vcf.ts` are prerendered endpoints that call the renderers with the site configuration.
* The profile image is `/.well-known/avatar`. That file has no extension, so a `_headers` rule gives it `Content-Type: image/png`.

## CORS and caching

All three specifications require that other origins can read the files.

* [`src/data/headers.ts`](../../src/data/headers.ts) adds a rule for each file to `moduleHeaderRules` with its content type and `Access-Control-Allow-Origin: *`. `ETag` and `Last-Modified` are exposed to scripts.
* The specification examples send `If-None-Match`. That header is not CORS-safelisted, so a browser sends a preflight `OPTIONS` request first. Static assets do not answer `OPTIONS`, so [`src/worker.ts`](../../src/worker.ts) returns `204` with the same CORS headers for these three paths.
* Cloudflare Workers Static Assets sends the `ETag` and answers conditional requests with `304`.

## Validation

```bash
npx vitest run src/utils/socialspec.pure.test.ts src/data/socialspec.test.ts src/data/headers.test.ts src/worker.test.ts
```

After a deploy:

```bash
curl -sI https://kollitsch.dev/.well-known/contact.vcf
curl -sI -X OPTIONS -H 'Origin: https://example.com' -H 'Access-Control-Request-Method: GET' -H 'Access-Control-Request-Headers: if-none-match' https://kollitsch.dev/.well-known/following.opml
```
