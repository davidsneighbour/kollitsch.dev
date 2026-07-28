---
title: OAuth protected-resource metadata assessment
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

KOLLITSCH.dev does not publish OAuth Protected Resource Metadata at
`/.well-known/oauth-protected-resource`.

## Current decision

Do not publish protected-resource metadata. The site has public static pages,
public metadata endpoints, and a public contact-form POST endpoint, but no
resource that requires OAuth access tokens.

Current resource surface:

| Route | OAuth protection | Notes |
| --- | --- | --- |
| `/api/siteinfo.json` | None | Public static build metadata. |
| `/.well-known/webfinger` | None | Public profile discovery metadata. |
| `/.netlify/functions/send-email` | None | Public contact-form submission endpoint. It validates request shape and uses server-side Resend credentials, but it does not accept bearer tokens or require OAuth scopes. |

Because there is no protected resource, there are no truthful values for:

* `resource`,
* `authorization_servers`,
* `scopes_supported`,
* `bearer_methods_supported`,
* `resource_documentation`.

Publishing placeholder values would mislead clients and agents into expecting
an OAuth-protected API that does not exist.

## Future publication requirements

Only publish `/.well-known/oauth-protected-resource` if a real protected
resource is added. At that point:

* `resource` must exactly match the protected resource identifier,
* `authorization_servers` must name real OAuth issuer identifiers,
* `scopes_supported` must list real scopes accepted by the resource,
* `bearer_methods_supported` must match the accepted bearer-token transport
  methods,
* protected responses should use `WWW-Authenticate` consistently if they point
  clients to resource metadata.

If protected resources are path-specific, publish metadata at the path-derived
well-known URL described by RFC 9728 instead of using one host-level document
for unrelated resources.

## References

* [RFC 9728, OAuth 2.0 Protected Resource Metadata](https://www.rfc-editor.org/rfc/rfc9728)
