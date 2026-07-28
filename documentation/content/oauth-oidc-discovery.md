---
title: OAuth and OIDC discovery assessment
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

KOLLITSCH.dev does not publish OAuth 2.0 Authorization Server Metadata at
`/.well-known/oauth-authorization-server` or OpenID Connect Provider Metadata at
`/.well-known/openid-configuration`.

## Current decision

Do not publish OAuth or OIDC discovery metadata. This site does not operate an
OAuth authorization server, OpenID Provider, login flow, token endpoint, JWKS
endpoint, session system, or protected user-data API. Publishing either
well-known document would therefore create false issuer and endpoint metadata.

The current public API surface is:

| Route | Protection | Notes |
| --- | --- | --- |
| `/api/siteinfo.json` | Public | Static build metadata used by the footer. |
| `/.well-known/webfinger` | Public | Static profile discovery metadata. |
| `/.netlify/functions/send-email` | Public POST endpoint | Contact-form submission endpoint. It uses server-side Resend credentials but does not issue, accept, or validate OAuth access tokens. |

The contact form has operational secrets, but those secrets are not exposed as
an OAuth-protected resource surface. Agents do not need OAuth or OIDC discovery
metadata to understand this site.

## Future publication requirements

Only publish `/.well-known/oauth-authorization-server` when `kollitsch.dev`
becomes a real OAuth issuer with endpoint URLs to advertise. At minimum, the
metadata would need a real `issuer`, `authorization_endpoint`, `token_endpoint`
where applicable, supported response types, scopes, and authentication methods.

Only publish `/.well-known/openid-configuration` when the site becomes a real
OpenID Provider with OpenID Connect semantics, including a real issuer and
discoverable provider metadata. The OIDC document must not be used as a generic
"this site has AI features" signal.

If a future protected API is served by another issuer, document that external
issuer instead of publishing misleading first-party metadata on `kollitsch.dev`.

## References

* [RFC 8414, OAuth 2.0 Authorization Server Metadata](https://www.rfc-editor.org/rfc/rfc8414)
* [OpenID Connect Discovery 1.0](https://openid.net/specs/openid-connect-discovery-1_0.html)
