---
title: Icons

linktitle: hugo-icons
description: ""
summary: ""

date: 2022-07-22T19:10:17+07:00
publishDate: 2022-07-22T19:10:17+07:00
lastmod: 2022-08-03T21:46:51+07:00

resources:
  - src: header-card.png

categories:
  - components

tags:
  - gohugo
  - component
  - design

component:
  slug: hugo-icons
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This is a Hugo theme component that adds several icon sets to your Hugo website.

{{< component-box >}}

## Available Icon Fonts

- **(bs/bootstrap)**: [Bootstrap Icons](https://icons.getbootstrap.com/)
- **(hr/heroicon)**: [Hero Icons](https://heroicons.com/)
- **(tr/tablericon)**: [Tabler Icons](https://tabler-icons.io/)

## Usage

This module adds sample pages with a list of all available icons when run in development mode:

- Bootstrap Icons at `http://localhost:1313/dnb/bootstrap-icons/`.
- Hero Icons at `http://localhost:1313/dnb/heroicons/`.
- Tabler Icons at `http://localhost:1313/dnb/tabler-icons/`.

Call these icons as partials:

```go-html-template
{{ partialCached "bsicon.html" "arrow-right" "arrow-right" }}
{{ partialCached "heroicon.html" "arrow-right" "arrow-right" }}
{{ partialCached "tablericon.html" "arrow-right" "arrow-right" }}
```
