---
title: "Hugo Component / {{ .Title | title }}"
linkTitle: "{{ .Title }}"
description: ""
summary: ""

date: "{{ .Date }}"
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
  slug: "{{ .Title }}"
  status: release
  list: true
---
