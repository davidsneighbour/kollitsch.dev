---
title: Auditor
linktitle: hugo-auditor
description: This module is a component for GoHugo that adds auditing tools to your
  development website.

date: 2022-11-15T15:04:51+07:00
publishDate: 2022-11-15T15:04:51+07:00
lastmod: 2022-11-15T15:04:52+07:00

resources:
  - src: header-card.png

categories:
  - components

tags:
  - gohugo
  - component
  - development

component:
  slug: hugo-auditor
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

# GoHugo Component / Auditor

This module is a component for [GoHugo](https://gohugo.io) that adds auditing tools to your development website. It is not thought for use in a live deployment. It is work in progress.

## Headers CT

See [CT.css](https://github.com/csswizardry/ct) for details. Enable this feature only on development setup to see information about optimisation approaches for your header tag order.

```toml
[params.dnb.auditor]
ct = true
```

then add somewhere in the footer of your base template:

```gotemplate
{{- partialCached "ct/ct.html" . -}}
```

## Create a JSON file with list of all created URLs

Add output type to `outputs` section in your config:

```toml
home = ["dnblinklist" ]
```

After creation of the site there is a JSON file available at `/links.json` ([http://localhost:1313/links.json](http://localhost:1313/links.json)) containing all created links.
