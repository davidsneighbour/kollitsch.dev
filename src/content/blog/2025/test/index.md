---
title: Testing the shared Patrick Kollitsch portrait
description: >-
  Demonstrates how to embed the shared Patrick Kollitsch portrait from
  src/assets/images inside a blog post so the picture renders without missing
  asset errors.
summary: >-
  A short check that the portrait stored in src/assets/images/patrick-kollitsch.png
  loads correctly when linked from a blog post.
date: 2025-03-10T12:00:00+00:00
tags:
  - meta
  - testing
cover:
  src: ../../../../assets/images/patrick-kollitsch.png
  title: Patrick Kollitsch portrait
  alt: Portrait of Patrick Kollitsch on a plain background
  type: image
publisher: rework
---

The portrait that appears in the footer lives at
`src/assets/images/patrick-kollitsch.png`. This post links to that shared image
so the page confirms the asset is available to content entries without copying
it into a post-specific folder.

![Patrick Kollitsch portrait](../../../../assets/images/patrick-kollitsch.png)

If the image appears above, the shared assets pipeline is working and no
"missing image" errors should appear when this post renders.
