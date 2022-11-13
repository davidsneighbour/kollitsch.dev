---
title: PWA
linkTitle: hugo-pwa
description: ""
summary: ""

date: 2022-07-28T20:50:54+07:00
publishDate: 2022-07-28T20:50:54+07:00
lastmod: 2022-08-03T21:46:37+07:00

resources:
  - src: header-card.png

categories:
  - components

tags:
  - gohugo
  - component
  - seo

component:
  slug: hugo-pwa
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This is a Hugo theme component with helpers to convert your static [GoHugo](https://gohugo.io/) website into a [PWA](https://web.dev/progressive-web-apps/).

This is work in progress and while many parts are already working, some changes to the setup will occur. Please watch the releases of this repository to be alerted about changes.

{{< component-box >}}

## Features

- :heavy_check_mark: Favicon for apps and sites
- :heavy_check_mark: simple PWA setup
- :x: Happy Google lighthouse testing
- :x: Improvements for easier "drop in" to other websites/modules
- :x: Add layout system for offline page creation
- :x: Add configuration system
- :x: improve configuration of implemented functionality in the service worker
- :x: add detailed documentation for all configuration options


## Configuration

To make this component work you need to add the manifest to your _home_ output formats in `config.toml`:

```toml
[outputs]
home = [ "manifest" ]
```

or in `config/_default/outputs.toml`:

```toml
home = [ "manifest"]
```

You already should have an `[output]` section, add `"manifest"` to it. Do not add it anywhere other than in the `home` directive.

### Setup layouts

In your themes header (before `</head>`):

```go-html-template
{{ partialCached "head/pwa.html" . }}
```

This will add a link to the automatically created webmanifest with options to install the PWA. Check [Detailed configuration](#detailed-configuration) for information how to configure the contents of this file.

In your footer layout (before `</body>`):

```go-html-template
{{ partialCached "footer/service-worker.html" . }}
```

This will set up the service worker script in the footer of your website.

Notes:

- both layouts can be cached and contain no page-individual information
- check out the [todo section of the readme](#todo) for missing parts or open an issue.

### Detailed configuration

... to be written ...

## Updating

Hugo itself will check on a regular base for updates. To force an update of this module run one of the following commands on your CLI.

```shell
hugo mod get -u github.com/davidsneighbour/hugo-pwa # or
hugo mod get -u # update all modules
```
