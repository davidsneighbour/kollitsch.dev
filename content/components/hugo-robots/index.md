---
title: Robots
linktitle: hugo-robots
description: ""
summary: ""

date: 2022-07-19T17:40:35+07:00
publishDate: 2022-07-19T17:40:35+07:00
lastmod: 2022-08-09T1:27:50+07:00

resources:
  - src: github-card-dark.png

categories:
  - components

tags:
  - gohugo
  - component
  - seo

component:
  slug: hugo-robots
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This component for [GoHugo](https://gohugo.io/) adds a customizable robots.txt to your website.

{{< component-box >}}

## Usage

This component can be used as drop-in without much configuration. However, robots.txt generation needs to be enabled in your configuration, eg. config.toml:

```toml
enableRobotsTXT = true
```

You can add configuration parameters per page in your frontmatter:

```yaml
robotsdisallow: true
```

This will add a `Disallow` line for the current URL. Note, that with clean URLs this will disallow bot-access for all sub-folders and sub-urls of the current item.

## Adding global dis/allows

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

Add/edit global defaults in config.toml or config/_defaults/params.toml:

```toml
[dnb.robots]
index = true
follow = true
```

Default without any configuration is `true` in both parameters.

If you are using [davidsneighbour/hugo-head](https://github.com/davidsneighbour/hugo-head) then the meta tag is automatically added to your head-tag. If not you will need to add a call to the meta tag:

```go
{{- partial "head/robots.html" . -}}
```

## Are you into ASCII-art?

If you like to do your robots.txt proud --- you know what I mean --- then you can use the following configuration parameters in `config/_default/params.toml` to add some flourish to your robots.txt:

```toml
[dnb.robots]
initialComment = '''
# comment at the beginning of robots.txt
'''
concludingComment = '''
# comment at the end of robots.txt
'''
```

Be careful to properly comment out these parts.

## Remove dnb-org notices

The plugin adds some branding notes to your robots.txt. It's a free plugin. If you wish to remove these mentions feel _free_ to set the `disableBranding` option in your `config/_default/params.toml` to true:

```toml
[dnb.robots]
disableBranding = true
```

## See this module in action

- [kollitsch.dev/robots.txt](https://kollitsch.dev/robots.txt)
