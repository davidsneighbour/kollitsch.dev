---
title: Auditor
linktitle: hugo-auditor
description: Improve your GoHugo website's development with this auditing component. These auditing tools ensure you to find hidden performance boosts.
summary: Improve your GoHugo website's development with this auditing component. These auditing tools ensure you to find hidden performance boosts.
date: 2022-11-15T15:04:51+07:00
publishDate: 2022-11-15T15:04:51+07:00
lastmod: 2023-03-24T18:36:41+07:00
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

This component is a module for the static site generator [GoHugo](https://gohugo.io) and adds auditing tools to your website in development. It's not for use in a live deployment and work in progress.

{{< component-box >}}

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
