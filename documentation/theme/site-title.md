---
title: Site title animations
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-11-26T00:00:00+07:00
---

The large site title (the brand combination mark) has two independent animated behaviours: a pointer-hover reveal of the header photo behind the logo, and a scroll-exit fade of the whole header. Both are decorative and both are reduced under `prefers-reduced-motion: reduce`.

The logo itself never animates per glyph and is never filled with the photo. The photo fill and the per-letter shatter were removed on 26 November 2026 with the new brand identity (issue #2256).

See [SiteTitle](../components/layout/header/title/site-title.md) for timings, props, and the reduced-motion behaviour.
