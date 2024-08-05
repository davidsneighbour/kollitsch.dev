---
title: Devtools
description: This is a GoHugo theme component that loads all of DNB's GoHugo development modules at once. It will currently load hugo-debug, hugo-functions, and hugo-hooks.
summary: This is a GoHugo theme component loading all of David's Neighbour's GoHugo development modules at once. It will currently load hugo-debug, hugo-functions, and hugo-hooks.
date: 2023-12-24T19:33:06+07:00
publishDate: 2023-12-24T19:33:06+07:00
lastmod: 2024-02-11T20:40:20+07:00
resources:
- src: header-card.png
categories:
- components
tags:
- gohugo
- component
- development
aliases:
- /components/hugo-devtools/
---

This is a GoHugo theme component loading all of David's Neighbour's GoHugo development modules at once. The following modules are loaded:

* [hugo-debug](https://kollitsch.dev/gohugo/debug/)
* [hugo-functions](https://kollitsch.dev/gohugo/functions/)
* [hugo-hooks](https://kollitsch.dev/gohugo/hooks/)

Add this module to your `config` > `module` section:

```toml
[[imports]]
path = 'github.com/davidsneighbour/hugo-modules/modules/devtools'
```

Documentation to be written.
