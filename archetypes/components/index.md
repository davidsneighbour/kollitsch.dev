---
title: GoHugo Components / {{ .Name | title }}
linkTitle: "{{ .Name }}"
description: ""
summary: ""

draft: true

date: {{ .Date }}
publishDate: "{{ .Date }}"
lastmod: "{{ .Date }}"

resources:
  - src: github-card-dark.png

categories:
  - components

tags:
  - gohugo
  - component
  - seo

component:
  slug: "{{ .Name }}"
  status: release
  list: true
  host: github.com
  user: davidsneighbour
---
