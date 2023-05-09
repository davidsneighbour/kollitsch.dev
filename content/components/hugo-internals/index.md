---
title: Internals
linkTitle: hugo-internals
description: This module attempts to replace internal templates used by Hugo with custom ones and other modules and plugins that add identical features more sophisticated or up-to-date. Internal templates of Hugo are highly opiniated, often out of time and not suitable for use in the production environment of a website. The layouts in this repo and it's modules replace them with our own better setup.
date: 2022-07-31T20:50:06+07:00
publishDate: 2022-07-31T20:50:06+07:00
lastmod: 2023-05-09T19:15:43+07:00
resources:
  - src: header-card.png
categories:
  - components
tags:
  - gohugo
  - component
  - seo
component:
  slug: hugo-internals
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This module attempts to replace internal templates used by Hugo with custom ones and other modules and plugins that add identical features more sophisticated or up-to-date. Internal templates of Hugo are highly opiniated, often out of time and not suitable for use in the production environment of a website. The layouts in this repo and it's modules replace them with our own better setup.

{{< component-box >}}

# Replacements

## [hugo-robots](https://github.com/davidsneighbour/hugo-robots) --- Creating a robots.txt

This component uses [hugo-robots](https://github.com/davidsneighbour/hugo-robots) to create a robots.txt without much configuration. The only step to take is that robots.txt generation needs to be enabled in your configuration, eg. config.toml:

```toml
enableRobotsTXT = true

```

Read more about detailed setup options at [the documentation](https://kollitsch.dev/components/hugo-robots/).

## [hugo-sitemap](https://github.com/davidsneighbour/hugo-sitemap) --- Add a configurable sitemap

## [hugo-youtube](https://github.com/davidsneighbour/hugo-youtube) --- Add youtube videos via shortcode

# Contribute

If you are developing or maintaining a Hugo component or module that replaces one of the internal features of Hugo then feel free to add an [issue](https://github.com/davidsneighbour/hugo-blockify/issues) or a [pull request](https://github.com/davidsneighbour/hugo-internals/compare) adding your work.
