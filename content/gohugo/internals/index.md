---
title: Internals
description: This module attempts to replace internal templates used by Hugo with custom ones and other modules and plugins that add identical features more sophisticated or up-to-date. Internal templates of Hugo are highly opiniated, often out of time and not suitable for use in the production environment of a website. The layouts in this repo and it's modules replace them with our own better setup.
date: 2022-07-31T20:50:06+07:00
publishDate: 2022-07-31T20:50:06+07:00
lastmod: 2024-09-11T05:37:45.340Z
resources:
  - src: header-card.png
tags:
  - gohugo
  - component
  - seo
aliases:
  - /components/hugo-internals/
---

This module attempts to replace internal templates used by Hugo with custom ones and other modules and plugins that add identical features more sophisticated or up-to-date. Internal templates of Hugo are highly opinionated, often out of time and not suitable for use in the production environment of a website. The layouts in this repository and the linked modules replace them with our own better[^1] setup.

| Function | Internal layouts | Replacement option |
| --- | --- | --- |
| [robots.txt](https://gohugo.io/templates/robots/) | [robots.txt](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_default/robots.txt) | [hugo-robots](https://dnbhub.xyz/robots) |
| [Sitemap](https://gohugo.io/templates/sitemap/) | [sitemap](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_default/sitemap.xml) and [index](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/_default/sitemapindex.xml) | [hugo-sitemap](https://dnbhub.xyz/sitemap) |

| Shortcode | Internal layouts | Replacement option |
| --- | --- | --- |
| [Youtube](https://gohugo.io/content-management/shortcodes/#youtube) | [youtube](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/shortcodes/youtube.html) | [hugo-youtube](https://dnbhub.xyz/youtube) [^2] |

[^1]: in our own opinion
[^2]: SEO optimized
