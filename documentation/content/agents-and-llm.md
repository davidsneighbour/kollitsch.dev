---
title: Agents and LLM readiness
tags: []
created: 2026-08-11T00:00:00+07:00
updated: 2026-08-11T00:00:00+07:00
---

KOLLITSCH.dev is treated as a content website for agent-readiness checks: it
publishes public content, agent-readable representations, and discovery hints,
but does not advertise application, authentication, MCP, commerce, or
agent-registration services that do not exist.

## Audit profile

Use the content-site profile when auditing the public site:
[isitagentready.com/kollitsch.dev?profile=content](https://isitagentready.com/kollitsch.dev?profile=content).

The content profile matches the current site boundary. It checks the surfaces
that apply to a blog, reference site, or static content property:

* `robots.txt`,
* sitemap discovery,
* HTTP `Link` headers,
* DNS for AI Discovery,
* Markdown negotiation,
* AI bot rules,
* Content Signals.

Run the same profile from the command line with:

```bash
npm run audit:agent-ready
```

The command calls the public isitagentready.com scanner with the same enabled
checks as the `profile=content` URL. It is intentionally not wired into CI or
deployment pipelines because the scanner is an external service and the audit
result can vary with network, DNS, cache, and service availability.

## Implemented surfaces

| Surface | Documentation | Purpose |
| --- | --- | --- |
| LLM Markdown resources | [`llm-visibility.md`](llm-visibility.md) | Publishes `/llms.txt`, `/llms-full.txt`, per-post Markdown routes, and Markdown negotiation. |
| API catalogue | [`api-catalog.md`](api-catalog.md) | Lists the small set of public machine-readable site resources. |
| DNS for AI Discovery | [`dns-aid.md`](dns-aid.md) | Publishes the DNS-AID organisation index pointer through Cloudflare DNS. |
| Robots and Content Signals | [`llm-visibility.md`](llm-visibility.md#robots-policy) | Declares crawl and AI-content-use policy in `robots.txt`. |

## Explicit non-services

Several audit checks are useful for applications, APIs, and agent platforms but
do not apply to the current site. KOLLITSCH.dev leaves those well-known routes
absent instead of publishing placeholder metadata.

| Surface | Documentation | Current decision |
| --- | --- | --- |
| OAuth and OIDC discovery | [`oauth-oidc-discovery.md`](oauth-oidc-discovery.md) | Do not publish issuer metadata without a real issuer, login flow, token endpoint, or JWKS. |
| OAuth protected-resource metadata | [`oauth-protected-resource.md`](oauth-protected-resource.md) | Do not publish resource metadata without an OAuth-protected resource and real scopes. |
| Auth.md | [`auth-md.md`](auth-md.md) | Do not publish agent-registration instructions without a registration flow or credential exchange. |
| MCP Server Card | [`mcp-server-card.md`](mcp-server-card.md) | Do not publish MCP server metadata without a real MCP transport or tool surface. |
| Agent Skills Discovery | [`agent-skills.md`](agent-skills.md) | Do not expose repository-local assistant skills as public website capabilities. |
| WebMCP | [`webmcp.md`](webmcp.md) | Do not register experimental browser tools without a stable browser API and a real page action. |

Publishing a well-known discovery document is a contract with automated
clients. If the underlying service does not exist, a `404` is more truthful
than a schema-shaped document that points nowhere.
