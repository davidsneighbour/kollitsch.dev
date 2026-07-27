---
title: Footer
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders the site-wide footer: an about section with author bio, footer navigation, social links, legal links, the Static.Quest web ring widget, feed links, and the [`Colophon`](colophon.md) vanity heading.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/footer/Footer.astro` |
| Data | [`src/data/footernavigation.json`](../../../../src/data/footernavigation.json) (nav links), [`src/data/setup.json`](../../../../src/data/setup.json) (title, introduction, greetings), [`src/content/social.json`](../../../../src/content/social.json) (social links) |
| Tests | [`src/components/layout/footer/Footer.test.ts`](../../../../src/components/layout/footer/Footer.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import Footer from '@components/layout/footer/Footer.astro';
---

<Footer />
```

## Behaviour

- Renders an "About" `<aside>` with the author photo (linked to `/connect/`) and an introduction paragraph rendered from Markdown via `markdown-it`. A greeting-free fallback is rendered server-side; a client-side `<script>` re-renders the introduction with a time-of-day greeting (`morning`, `afternoon`, `evening`, `night`, or `default` from `setup.greetings`) substituted for the `{$greeting}` placeholder, based on `new Date().getHours()`.
- Renders a "Navigation" `<aside>` from `footernavigation.json`, and a "Connect" `<aside>` using `SocialLinks`.
- Renders a copyright line with the current year. The year is set server-side and corrected client-side via an inline script (`document.getElementById(footerYearId).innerText = ...`) to avoid stale build-time years on statically cached pages.
- Fetches `/api/siteinfo.json` client-side and, when a `version` and `releasePage` are present, appends a version link (`៚ vX.Y.Z`, with a leading space) after the copyright line. Failures are silently ignored.
- Renders Privacy Policy and Security Policy links, a Static.Quest web ring widget (previous/random/next), and RSS/Atom/JSON feed links.
- Renders `<Colophon />` after the closing `</footer>` tag.

## Extending

To add or reorder footer navigation links, edit [`footernavigation.json`](../../../../src/data/footernavigation.json). To change the greeting text per time of day, edit `setup.greetings` in [`setup.json`](../../../../src/data/setup.json).
