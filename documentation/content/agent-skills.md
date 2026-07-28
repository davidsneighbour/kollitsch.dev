---
title: Agent Skills Discovery
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

KOLLITSCH.dev does not currently publish an Agent Skills discovery index at
`/.well-known/agent-skills/index.json`.

The local repository contains assistant skills under `.agents/skills/`, but
those files are project maintenance tooling for contributors working inside the
repository. They are not public website capabilities, are not served as stable
site URLs, and are not versioned as public skill artifacts.

Publishing the well-known index would therefore be misleading. The current
decision is:

* Do not publish `/.well-known/agent-skills/index.json`.
* Do not expose `.agents/skills/` through the website.
* Reconsider only if the site intentionally offers public agent-consumable
  skills with stable served artifact URLs.

If a public skills index is added later, it must follow the current discovery
draft:

* include `$schema`,
* include a `skills` array,
* include `name`, `type`, `description`, `url`, and `digest` for each entry,
* use SHA-256 digests for the exact served artifact bytes,
* point each `url` to a stable public site URL.

References:

* [Agent Skills Discovery RFC](https://github.com/cloudflare/agent-skills-discovery-rfc)
* [Agent Skills](https://agentskills.io/)
