---
title: WebMCP assessment
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

KOLLITSCH.dev does not register browser-side WebMCP tools.

## Current decision

Do not add WebMCP tools yet. The current WebMCP specification is a Draft
Community Group Report, not a W3C Standard or W3C Standards Track document.
Chrome describes WebMCP as available for prototyping to early preview programme
participants, not as a broadly deployable browser feature.

The issue text references `navigator.modelContext.provideContext()`, but the
current draft API shape uses `document.modelContext.registerTool()` and
`document.modelContext.getTools()`. That naming drift is a useful warning sign:
the API is still changing.

## Site fit

The site already exposes static and HTTP-discoverable content for agents:

* Markdown routes and `Accept: text/markdown` negotiation for blog posts,
* `/llms.txt` and `/llms-full.txt`,
* an API catalogue,
* public WebFinger and site-info endpoints.

There are no high-value browser actions that need an experimental WebMCP tool
today. Candidate actions such as searching, opening a post, or reading site
metadata are already available through HTML, Markdown, Pagefind, or static JSON.
The contact form is intentionally user-facing and should not become an
agent-callable submission tool without abuse controls and a product decision.

## Revisit criteria

Reconsider WebMCP only when:

* at least one stable browser channel exposes the API without an early preview
  programme,
* the API shape is stable enough to avoid churn,
* this site has a real browser-side workflow that benefits from a named tool,
* the tool can degrade harmlessly when `document.modelContext` is unavailable,
* each tool can provide a truthful name, description, JSON Schema input schema,
  and executable callback.

Until then, no WebMCP script should be added to the page shell.

## References

* [WebMCP draft](https://webmachinelearning.github.io/webmcp/)
* [Chrome WebMCP early preview article](https://developer.chrome.com/blog/webmcp-epp)
