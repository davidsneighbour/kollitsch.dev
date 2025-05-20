---
title: Youtube
description: A GoHugo Shortcode to replace the internal youtube shortcode. Adding an unobtrusive, privacy-conscious and unbloated custom component for YouTube videos.
summary: A GoHugo Shortcode to replace the internal youtube shortcode. Adding an unobtrusive, privacy-conscious and unbloated custom component for YouTube videos.
date: 2023-09-17T18:23:07+07:00
publishDate: 2022-08-03T21:21:58+07:00
lastmod: 2024-11-30T18:38:56+07:00
tags:
- gohugo
- component
- shortcode
- media
- youtube
aliases:
- /components/hugo-youtube/
- /gohugo/youtube/
menus:
  main:
    parent: GoHugo
    params:
      bsicon: puzzle-fill
---

A GoHugo Shortcode to replace the internal `{{</* youtube */>}}` shortcode and add an unobtrusive, privacy conscious and unbloated custom element for YouTube videos. It uses [paulirish/lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed).

## Usage

As a shortcode this replaces the internal `youtube` shortcode.

```go-html-template
{{</* youtube id="dQw4w9WgXcQ" */>}}
{{</* youtube "dQw4w9WgXcQ" */>}}
{{</* youtube id="dQw4w9WgXcQ" title="Lower your eyelids to die with the sun - M83" */>}}
```

The partial works the same way. You can use it in your templates like this:

```go-html-template
{{ partial "youtube" (dict "id" "dQw4w9WgXcQ" "title" "Lower your eyelids to die with the sun - M83") }}
```

### Parameters

| param | default | notes |
| --- | --- | --- |
| *id* | | ID of the YouTube video to embed |
| *class* | w-100 | class names to add to the video container |
| *params* | | [custom parameters][1] to be added to influence the display and features of the player. These parameters should be URLized. |
| *title* | | title of the video, displayed as banner on top of the preview image |
| *playlabel* | "Play video" | label for the play button, used as `aria-label`. |
| *jsapi* | false | enable the YouTube JavaScript API for the video |

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

If you have your own templating going on you can use the parameters in `site.params.­dnb.­youtube.­config.­plugins` to add to your pipelines.

## Disable YouTube videos globally

Setting `disable` to `true` in [GoHugo's privacy setup](https://gohugo.io/about/privacy/#all-privacy-settings) will disable all YouTube videos created by this module globally. `privacyEnhanced` has no effect on this module, because all YouTube videos are already embedded with the privacy-enhanced mode.

```toml
[privacy.youtube]
disable = true
privacyEnhanced = false
```

## Content security policy rules for this plugin

The following `frame-src` for the video and `img-src` for the preview thumbnail are required, if you are using a Content Security Policy (CSP) and have no local preview thumbnail available:

```ini
frame-src = ["https://www.youtube-nocookie.com"]
img-src = ["https://i.ytimg.com", "https://ytimg.googleusercontent.com"]
```

[1]: https://developers.google.com/youtube/player_parameters#Parameters
