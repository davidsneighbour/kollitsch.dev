---
title: DNS-AID publication plan
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-08-11T13:48:03+07:00
---

KOLLITSCH.dev must publish DNS for AI Discovery through Cloudflare DNS records
under the `_agents.kollitsch.dev` namespace.

## Record to publish

The organisation index entrypoint is the DNS-AID discovery record to publish:

```dns
_index._agents.kollitsch.dev. 3600 IN SVCB 1 kollitsch.dev. alpn="h2" port=443 mandatory=alpn,port
```

This is an organisation-level index pointer, not an A2A or MCP agent endpoint.
The target name is `kollitsch.dev.` because the public site already serves the
machine-readable discovery resources listed in [`llm-visibility.md`](llm-visibility.md).
The target name intentionally contains no underscores so it remains valid for
normal public TLS endpoint validation.

Do not publish `_a2a._agents.kollitsch.dev.` or `_mcp._agents.kollitsch.dev.`
until the domain has a real A2A or MCP service to advertise.

## Live DNS checks

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
DNSSEC capability, but the DNS-AID entrypoint had not been published at that
time.

Checked again on 2026-08-11:

| Query | Result |
| --- | --- |
| `DNSKEY kollitsch.dev` | present with authenticated data |
| `SVCB _index._agents.kollitsch.dev` | no answer |

The public DNS-AID SVCB record still needs to be applied in Cloudflare DNS.

## Cloudflare requirements

Cloudflare DNS is the external source that must hold the live DNS record. The
repository does not contain DNS-as-code for this zone, so Astro and Netlify
builds cannot publish this record by themselves.

| Field | Value |
| --- | --- |
| Type | `SVCB` |
| Name | `_index._agents` |
| Priority | `1` |
| Target | `kollitsch.dev.` |
| Parameters | `alpn="h2" port=443 mandatory=alpn,port` |
| TTL | `3600` |
| Proxy status | DNS only |

DNSSEC must stay enabled for the zone so validating resolvers can authenticate
the discovery answer. Existing DNSSEC material for `kollitsch.dev` was present
in the 2026-07-28 live check.

## Validation

After publication, validate the record through DNS over HTTPS:

```bash
curl -s 'https://cloudflare-dns.com/dns-query?name=_index._agents.kollitsch.dev&type=SVCB' \
  -H 'accept: application/dns-json'
```

The answer must contain the SVCB record above. DNSSEC-aware clients should also
show authenticated data for the signed answer.

Then run the public scanner:

```bash
curl -s https://isitagentready.com/api/scan \
  -H 'content-type: application/json' \
  --data '{"url":"https://kollitsch.dev"}'
```

The `checks.discoverability.dnsAid.status` value should be `pass`.

## Future agent records

When the domain exposes a real public agent endpoint, publish a separate agent
record under its primary owner name or through an `_agents.kollitsch.dev`
inventory alias. Include the real protocol, endpoint port, descriptor path, and
descriptor digest.

Until the DNS-AID draft parameter names are registered with IANA, use numeric
`keyNNNNN` SvcParamKey presentation names for experimental custom parameters
such as capability locators or descriptor hashes.

## References

* [DNS for AI Discovery draft](https://datatracker.ietf.org/doc/draft-mozleywilliams-dnsop-dnsaid/)
* [RFC 9460, SVCB and HTTPS resource records](https://www.rfc-editor.org/rfc/rfc9460)
