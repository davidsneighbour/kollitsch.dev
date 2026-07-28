---
title: LLM visibility
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

KOLLITSCH.dev exposes curated Markdown representations for AI agents and LLM
tools that fetch URLs, while keeping the HTML and Markdown versions derived
from the same Astro content source.

## Published endpoints

| Endpoint | Source | Purpose |
| --- | --- | --- |
| `/llms.txt` | [`src/pages/llms.txt.ts`](../../src/pages/llms.txt.ts) | Curated index of published blog posts and site-level context links. |
| `/llms-full.txt` | [`src/pages/llms-full.txt.ts`](../../src/pages/llms-full.txt.ts) | Full published blog content in one Markdown document. |
| `/llms/{year}/{slug}.txt` | [`src/pages/llms/[...slug].txt.ts`](../../src/pages/llms/[...slug].txt.ts) | Single published post as Markdown. |
| `/blog/{year}/{slug}.md` | [`src/pages/blog/[year]/[slug].md.ts`](../../src/pages/blog/[year]/[slug].md.ts) | Markdown alternate for the canonical blog post URL. |

All LLM documents use `Content-Type: text/markdown; charset=utf-8`. Draft blog
posts are excluded from generated LLM indexes and per-post Markdown routes.

## Discovery

The homepage response advertises site-level agent discovery resources via HTTP
`Link` headers:

```text
Link: </.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"
Link: </llms.txt>; rel="service-desc"; type="text/markdown"
Link: </llms-full.txt>; rel="service-desc"; type="text/markdown"
```

`service-desc` is a registered link relation for machine-oriented service
descriptions. It is used here for the curated LLM-facing Markdown resources.
`api-catalog` points to the standards-aligned API catalogue at
`/.well-known/api-catalog`.

Blog post HTML pages emit:

```html
<link
  rel="alternate"
  type="text/markdown"
  href="https://kollitsch.dev/blog/{year}/{slug}.md"
/>
```

The generated Netlify `_headers` file also adds HTTP `Link` headers for both
representations:

```text
Link: </blog/{year}/{slug}.md>; rel="alternate"; type="text/markdown"
Link: </blog/{year}/{slug}/>; rel="alternate"; type="text/html"
```

Both representations include `Vary: Accept` so caches do not collapse future
content-negotiated variants.

## Markdown negotiation

Supported blog post URLs also run through the Netlify Edge Function at
[`netlify/edge-functions/markdown-negotiation.ts`](../../netlify/edge-functions/markdown-negotiation.ts).
The function is scoped to `GET` and `HEAD` requests under `/blog/*`.

For canonical blog post URLs such as `/blog/2026/example-post/`:

* browser-style requests keep receiving the static HTML page,
* requests where `text/markdown` is explicitly named and has a quality value
  greater than or equal to `text/html` receive the generated
  `/blog/2026/example-post.md` representation,
* requests that accept neither `text/html` nor `text/markdown` receive
  `406 Not Acceptable`.

The function compares `Accept` q-values and only resolves ties to Markdown when
the client explicitly named `text/markdown`; wildcard-only requests such as
`*/*` remain HTML. Markdown responses keep `Vary: Accept`, preserve the
reciprocal `Link` header generated for the `.md` asset, and add an approximate
`X-Markdown-Tokens` response header calculated from the generated Markdown
body.

References:

* [RFC 8288, Web Linking](https://datatracker.ietf.org/doc/html/rfc8288)
* [IANA Link Relation Types](https://www.iana.org/assignments/link-relations/link-relations.xhtml)
* [RFC 9727, api-catalog](https://www.rfc-editor.org/rfc/rfc9727)
* [RFC 9264, Linkset](https://www.rfc-editor.org/rfc/rfc9264)
* [Netlify Edge Functions API](https://docs.netlify.com/build/edge-functions/api/)

## Robots policy

[`src/pages/robots.txt.js`](../../src/pages/robots.txt.js) generates the
site's `robots.txt`. The default rule allows normal search indexing and
AI-input use, while reserving training rights:

```text
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /
```

Known AI crawler entries fetched from the external robot list remain blocked
and carry `ai-input=no, ai-train=no`.

## Static-site boundary

The site does not use User-Agent sniffing. Markdown negotiation is limited to
published blog post pages with generated `.md` alternates. Other static pages
continue to rely on explicit Markdown routes and discovery links until they have
their own generated Markdown representation.

The site also does not publish `/.well-known/agent-skills/index.json`.
Repository-local assistant skills under `.agents/skills/` are contributor
tooling, not public website capabilities. See
[`agent-skills.md`](agent-skills.md).

The domain also does not publish DNS-AID records because the site has no public
agent endpoint or organisational agent registry. See
[`dns-aid.md`](dns-aid.md).

The site also does not publish OAuth or OIDC discovery metadata because it has
no first-party issuer, login flow, token endpoint, or protected API surface. See
[`oauth-oidc-discovery.md`](oauth-oidc-discovery.md).

The site also does not publish OAuth protected-resource metadata because none of
its public endpoints require OAuth bearer tokens or scopes. See
[`oauth-protected-resource.md`](oauth-protected-resource.md).

The site also does not publish `/auth.md` because there is no supported or
planned agent-registration flow that could issue scoped credentials. See
[`auth-md.md`](auth-md.md).

The site also does not publish an MCP Server Card because it has no MCP server
transport or tool surface to advertise. See
[`mcp-server-card.md`](mcp-server-card.md).

The site also does not register WebMCP tools because the browser API is still a
draft and early preview feature, and the site has no high-value browser action
that warrants experimental tooling. See [`webmcp.md`](webmcp.md).
