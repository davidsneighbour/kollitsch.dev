---
title: Auth.md assessment
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

KOLLITSCH.dev does not publish `/auth.md`.

## Current decision

Do not publish Auth.md registration metadata. Auth.md is for applications that
let agents register users, negotiate agent identity, and receive scoped OAuth
credentials. KOLLITSCH.dev is a static personal site with public content,
public metadata routes, and a contact form. It has no user-registration flow,
agent-registration flow, claim ceremony, token endpoint, revocation endpoint, or
protected API scopes.

Publishing `/auth.md` without those flows would imply that agents can register
for service credentials here. They cannot.

## Relationship to OAuth metadata

This decision must stay aligned with:

* [`oauth-oidc-discovery.md`](oauth-oidc-discovery.md),
* [`oauth-protected-resource.md`](oauth-protected-resource.md).

If the site later adds an agent-registration flow, `/auth.md` should be planned
together with real OAuth authorization-server metadata and OAuth
protected-resource metadata. The Auth.md content must point at real endpoints
and scopes, not placeholders.

## Future publication requirements

Only publish `/auth.md` when all of these exist:

* a real agent identity or claim flow,
* a real endpoint where agents can begin registration,
* a real token endpoint that issues scoped credentials,
* real scopes and revocation semantics,
* matching OAuth authorization-server metadata,
* matching OAuth protected-resource metadata.

Until then, `/auth.md` should remain absent.

## References

* [Auth.md overview](https://workos.com/auth-md)
* [Auth.md repository](https://github.com/workos/auth.md)
