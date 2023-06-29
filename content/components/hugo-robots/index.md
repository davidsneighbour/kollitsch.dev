---
title: Robots
linktitle: hugo-robots
description: This component for GoHugo adds a customizable robots.txt to your website.
date: 2023-06-29T19:21:43+07:00
publishDate: 2022-07-19T17:40:35+07:00
lastmod: 2023-06-29T19:22:28+07:00
resources:
  - src: header-card.png
categories:
  - components
tags:
  - gohugo
  - component
  - seo
  - robots.txt
component:
  slug: hugo-robots
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This component for [GoHugo](https://gohugo.io/) adds a customizable robots.txt to your website. This module overrides the internal robots.txt generation of Hugo and lets you configure what robots.txt in your public folder will contain. It also offers a meta-robots tag for your head section.

{{< component-box >}}

## Usage

This component can be used as drop-in without much configuration. However, robots.txt generation must be enabled in your main configuration, for instance `config.toml` or `hugo.toml`:

```toml
enableRobotsTXT = true
```

You can add configuration parameters per content page in its frontmatter:

```yaml
robotsdisallow: true
```

This will add a `Disallow` line for the current URL. Note, that with clean URLs this will disallow bot-access for all sub-folders and sub-urls of the current item.

## Adding global (dis)allows

You can add global additions to your robots.txt via `config/_default/params.toml` configuration:

```toml
[[dnb.robots.useragents]]
name = "Googlebot"
disallow = ["/nogooglebot/", "/anotherdirectory/"]

[[dnb.robots.useragents]]
name = "Googlebot2"
allow = ["/yesgooglebot/", "/anotherdirectory/"]
```

## Configure meta-robots tags

Configure the robots tag with the following individual configuration parameters in your frontmatter:

```yaml
config:
  follow: true
  index: false
```

Add or edit global defaults in the `[params]` section of `config.toml` or in `config/_defaults/params.toml`:

```toml
[dnb.robots]
index = true
follow = true
```

The default without any configuration is `true` for both parameters.

If you are using [davidsneighbour/hugo-head](https://github.com/davidsneighbour/hugo-head) then the `robots` meta tag is automatically added to your head section. If not, you need to add a call to the meta tag:

```go-html-template
{{- partial "head/robots.html" . -}}
```

You can cache this partial, but based on a per-page level:

```go-htmml-template
{{- partialCached "head/robots.html" . page -}}
```

## Are you into ASCII-art?

If you like to do your robots.txt proud --- if you catch my drift --- then you can use the following configuration parameters in `config/_default/params.toml` to add some flourish to your robots.txt:

```toml
[dnb.robots]
concludingComment = "# comment at the end of robots.txt\n"
initialComment = "# comment at the beginning of robots.txt\n"
```

Be careful to properly comment out these parts.

## Remove dnb-org notices

The plugin adds some branding notes to your robots.txt. It's a free plugin. If you need to remove these mentions feel _free_ to set the `disableBranding` option in your `config/_default/params.toml` to true:

```toml
[dnb.robots]
disableBranding = true
```

## See this module in action

- [kollitsch.dev/robots.txt](https://kollitsch.dev/robots.txt)
