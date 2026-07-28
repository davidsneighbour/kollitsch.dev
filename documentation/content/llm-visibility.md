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

The site does not use User-Agent sniffing. It also does not perform same-URL
`Accept: text/markdown` negotiation in static output; instead, it publishes
explicit Markdown routes and advertises them with HTML and HTTP alternate links.
