---
title: PWA
description: ""
summary: ""
date: 2022-07-28T20:50:54+07:00
publishDate: 2022-07-28T20:50:54+07:00
lastmod: 2024-11-30T18:37:47+07:00
resources:
- src: header-card.png
tags:
- gohugo
- component
- seo
aliases:
- /components/hugo-pwa
menus:
  main:
    parent: GoHugo
    params:
      bsicon: puzzle-fill
---

This is a Hugo theme component with helpers to convert your static [GoHugo](https://gohugo.io/) website into a [Progressive Web App (PWA)](https://web.dev/progressive-web-apps/).

> [!IMPORTANT]
> This module is a work in progress. While many parts are already working, some changes to the setup might occur depending on changes to the standards and features of the used browsers. Please watch the releases of this repository to be alerted about breaking changes.

## Features

* :heavy_check_mark: simple PWA setup
* :heavy_check_mark: Favicon for apps and sites
* :heavy_check_mark: Webmanifest creation
* :x: Happy Google lighthouse testing
* :x: Improvements for easier "drop in" to other websites/modules
* :x: Add layout system for offline page creation
* :x: Add configuration system
* :x: improve configuration of implemented functionality in the service worker
* :x: add detailed documentation for all configuration options

## Configuration

To make this component work you need to add the manifest to your _home_ output format in `hugo.toml` or `config/_default/outputs.toml`. The location of this configuration depends on your configuration setup.

For `hugo.toml`:

```toml
[outputs]
home = [ "manifest" ]
```

For `config/_default/outputs.toml`:

```toml
home = [ "manifest"]
```

You already should have an `[output]` section, add `"manifest"` to it. Do not add it anywhere other than in the `home` directive.

## Detailed configuration

> [!IMPORTANT]
> All code samples assume that we configure the module in `config/_default/params.toml`. If you use a different configuration file, adjust the paths accordingly. All configuration (if not stated otherwise) is under the `[params]` section of the configuration file.

### Configure the manifest

The module creates a [manifest.json](https://w3c.github.io/manifest/) file for your website. This file is used by browsers to display your website as an app on mobile devices. The file is created automatically by the module and can be configured in your `[params]` section:

... to be written ...

### Other configuration options

```toml
[dnb.pwa]
dev = true # Enable PWA in development mode, more logging/debugging
```

Set `dev` to `true` to enable the PWA in development mode. This adds verbose logging in the console and set the module to "development" mode.

## Setup layouts

To add the PWA to your website, you need to add two partials to your layouts.

In your theme's header (before `</head>`):

```go-html-template
{{ partialCached "head/pwa.html" . }}
```

This adds a link to the automatically created `manifest.json` with options to install the PWA.

In your footer layout (before `</body>`):

```go-html-template
{{ partialCached "footer/service-worker.html" . }}
```

This sets up the service worker script in the footer of your website.

Both layouts can be cached and contain no page-individual information.

## Troubleshooting

### Testing on local Firefox installations

It appears that the service worker needs to be manually started on local test installations in Firefox. Go to "More Tools" > "Web Developer Tools" > "Applications" > "Service worker" and start the service worker for testing.

### CORS requests (for instance Google Fonts)

To trigger a CORS request and get back a non-opaque response, you need to opt-in to CORS mode by adding the crossorigin attribute to your HTML:

```html
<link crossorigin="anonymous" rel="stylesheet" href="https://example.com/path/to/style.css">
<img crossorigin="anonymous" src="https://example.com/path/to/image.png">
```
