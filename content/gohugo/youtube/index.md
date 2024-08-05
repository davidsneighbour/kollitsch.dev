---
title: Youtube
description: A shortcode to replace the internal youtube shortcode and add an unobtrusive, privacy conscious and unbloated custom element for YouTube videos using lite-youtube-embed.
date: 2023-09-17T18:23:07+07:00
publishDate: 2022-08-03T21:21:58+07:00
lastmod: 2024-02-01T19:49:12+07:00
resources:
- src: header-card.png
categories:
- components
tags:
- gohugo
- component
- shortcode
- media
summary: A responsive and very fast shortcode to add youtube videos to your Hugo website.
aliases:
- /components/hugo-youtube/
- /gohugo/youtube/
---

A responsive and very fast shortcode to add youtube videos to your Hugo website.

## Usage

This shortcode replaces the internal `youtube` shortcode and adds an unobtrusive, privacy conscious and unbloated custom element for YouTube videos. It uses [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed).

```go-html-template
{{</* youtube id="dQw4w9WgXcQ" */>}}
{{</* youtube "dQw4w9WgXcQ" */>}}
{{</* youtube id="dQw4w9WgXcQ" title="Lower your eyelids to die with the sun - M83" */>}}
```

### Parameters

| parameter | default | notes |
| --- | --- | --- |
| *class* | w-100 | classnames to add to the video container |
| *id* |  | ID of the YouTube video to embed |
| *params* |  | [custom parameters](https://developers.google.com/youtube/player_parameters#Parameters) to be added to influence the display and functionality of the player. These parameters should be URLized. |
| *title* |  | title of the video, will be displayed as banner on top of the preview image |

### Resources

You need to add the following files to your pipelines:

* `assets/js/lite-yt-embed.js`
* `assets/scss/_lite-yt-embed.scss`

These files are mounted into the `assets` directory. Using `js.Build` in Hugo for instance you can import the script this way:

```js
import LiteYTEmbed from './lite-yt-embed';
customElements.define('lite-youtube', LiteYTEmbed);
```

and import the styles into your SASS pipeline with

```sass
@import 'lite-yt-embed';
```

If you have your own templating going on you can use the parmeters in `site.params.­dnb.­youtube.­config.­plugins` to add to your pipelines.

## Content Security Policy (CSP) rules for this plugin

Using a CSP on your website you will need to whitelist YouTube frame-src for the video and img-src for the preview thumbnail, if you have no local preview thumbnail available. The following rules are required in addition to your normal setup to allow videos to load:

```ini
frame-src = ["https://www.youtube-nocookie.com"]
img-src = ["https://i.ytimg.com", "https://ytimg.googleusercontent.com"]
```
