---
title: Robots
description: This component for GoHugo adds a customizable robots.txt to your website.
date: 2023-06-29T19:21:43+07:00
publishDate: 2022-07-19T17:40:35+07:00
lastmod: 2024-09-09T11:07:18.122Z
tags:
  - gohugo
  - component
  - seo
  - robots.txt
aliases:
  - /components/hugo-robots
---

This component for [GoHugo](https://gohugo.io/) adds a customizable robots.txt to your website. This module overrides the internal `robots.txt` generation of Hugo and lets you configure what's in your robots.txt. It also offers a meta-robots tag for your head section.

## Usage

This component can be used as drop-in without much configuration. However, `robots.txt` generation must be enabled in your main configuration, for instance `config.toml` or `hugo.toml`:

```toml
enableRobotsTXT = true
```

In most themes this might be already the standard setup. [Read more about this.](https://gohugo.io/templates/robots/)

## Individual configuration

Add configuration parameters per content page in its frontmatter to add this page to the `disallow` section:

```yaml
options:
  robots:
    disallow: true
```

This adds a `Disallow` line for the current URL to `User-agent: *`. Note, that with clean URLs this will disallow bot-access for all sub-folders and sub-urls of the current item.

## Adding global (dis)allows for specific bots

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
options:
  robots:
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

If you are using [my head module for GoHugo](https://dnbhub.xyz/head) then the `robots` meta tag is automatically added to your head section. If not, you need to add a call to the meta tag somewhere before the closing `</head>` tag.

```go-html-template
{{- partial "head/robots.html" . -}}
```

You could cache this partial on a per-page level:

```go-html-template
{{- partialCached "head/robots.html" . page -}}
```

## Are you into ASCII-art?

If you like to do your robots.txt proud --- if you catch my drift --- then you can use the following configuration parameters in `config/_default/params.toml` to add some flourish to your robots.txt:

```toml
[dnb.robots]
concludingComment = "# comment at the end of robots.txt\n"
initialComment = "# comment at the beginning of robots.txt\n"
```

Be careful to properly comment out these parts or your `robots.txt` will be invalid.

## Remove branding

The plugin adds some branding notes to your robots.txt. It's a free plugin. If you need to remove these mentions feel _free_ to set the `disableBranding` option in your `config/_default/params.toml` to true:

```toml
[dnb.robots]
disableBranding = true
```

## See this module in action

- [kollitsch.dev/robots.txt](https://kollitsch.dev/robots.txt)
