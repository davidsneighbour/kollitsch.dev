---
title: DNS-AID assessment
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

KOLLITSCH.dev does not currently publish DNS for AI Discovery records.

## Current decision

Do not publish DNS-AID records for `kollitsch.dev` yet. The website exposes
LLM-readable Markdown, an API catalogue, and discovery headers, but it does not
operate a public agent endpoint, MCP server, A2A endpoint, or organisational
agent registry. Publishing DNS-AID without one of those concrete services would
advertise a capability the domain does not provide.

This is a repository-side documentation decision only. Any future DNS-AID
publication would happen in the external DNS provider, not through Astro or
Netlify source files.

## Live DNS check

Checked on 2026-07-28:

| Query | Result |
| --- | --- |
| `NS kollitsch.dev` | `merlin.ns.cloudflare.com`, `rafe.ns.cloudflare.com` |
| `DNSKEY kollitsch.dev` | present |
| `DS kollitsch.dev` | present |
| `SVCB _index._agents.kollitsch.dev` | no answer |
| `TXT _index._agents.kollitsch.dev` | no answer |

A DNSSEC-aware query for `SVCB _index._agents.kollitsch.dev` returned
`NOERROR` with no answer and signed denial of existence. The zone therefore has
DNSSEC capability, but the DNS-AID entrypoint is not published.

## Future publication requirements

Only publish DNS-AID when there is a real public agent surface to describe. At
that point the required plan is:

| Owner | Type | Value |
| --- | --- | --- |
| `_index._agents.kollitsch.dev.` | `SVCB` | Service binding to a real organisational agent index host. The target name must not contain underscores. |
| `<agent-name>.kollitsch.dev.` or an inventory alias below `_agents.kollitsch.dev.` | `SVCB` | Service binding for each public agent endpoint, including real protocol, port, well-known path, and capability metadata. |
| `_443._tcp.<target-name>.` | `TLSA` | Optional DANE TLSA records only if the endpoint certificate lifecycle is intentionally managed for DANE. If TLSA is published, it must be DNSSEC-signed. |

The draft SVCB parameters currently relevant to a future record include:

* `alpn` for the transport and/or agent protocol suite,
* `port` for the endpoint port,
* `well-known` for the capability or agent-card path,
* `cap` for a capability descriptor locator,
* `cap-sha256` for the base64url SHA-256 digest of the canonical capability
  descriptor,
* `mandatory` when a consumer must understand a parameter before using the
  record.

Do not publish placeholder values. The `well-known`, `cap`, and `cap-sha256`
values must point at a real served descriptor and digest its exact canonical
bytes. If Cloudflare cannot publish the required SVCB parameters through its DNS
UI at the time of implementation, use its API or defer publication.

## References

* [DNS for AI Discovery draft](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
* [RFC 9460, SVCB and HTTPS resource records](https://www.rfc-editor.org/rfc/rfc9460)
