---
title: Youtube
linkTitle: hugo-youtube
description: "A shortcode to replace the internal youtube shortcode and add an unobtrusive, privacy conscious and unbloated custom element for YouTube videos using lite-youtube-embed."

date: 2022-08-03T21:21:58+07:00
publishDate: 2022-08-03T21:21:58+07:00
lastmod: 2022-08-03T21:46:18+07:00

resources:
  - src: header-card.png

categories:
  - components

tags:
  - gohugo
  - component
  - shortcode
  - media

component:
  slug: hugo-youtube
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

A responsive and very fast shortcode to add youtube videos to your Hugo website.

{{< component-box >}}

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

- `libs/liteyoutube/lite-yt-embed.js`
- `libs/liteyoutube/lite-yt-embed.scss`

These files are mounted into the `assets` directory. Using `js.Build` in Hugo for instance you can import the script this way:

```js
import 'libs/liteyoutube/lite-yt-embed';
```

If you are not using any Hugo pipelines then add the Javascript at the end of the page before the `</body>` tag and CSS in the header before the `</head>` tag. These files are available via mount into the `static` folder.

```html
<link href="/libs/liteyoutube/lite-yt-embed.css" rel="stylesheet">
<script src="/libs/liteyoutube/lite-yt-embed.js" async defer></script>
```

## Content Security Policy (CSP) rules for this plugin

Using a CSP on your website you will need to whitelist YouTube frame-src for the video and img-src for the preview thumbnail, if you have no local preview thumbnail available. The following rules are required in addition to your normal setup to allow videos to load:

```ini
frame-src = ["https://www.youtube-nocookie.com"]
img-src = ["https://i.ytimg.com", "https://ytimg.googleusercontent.com"]
```
