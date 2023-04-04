---
title: Youtube Shortcode
date: 2021-04-16T19:56:45+07:00
layout: sc-documentation
lastmod: 2022-05-15T16:05:03+07:00
---

Following are some samples for the usage of the Youtube Shortcode.

**Note:** You can do [multiline GoHugo-tags since v0.81.0](https://github.com/gohugoio/hugo/releases/tag/v0.81.0). With older Hugo versions you need to remove the newlines in the following template examples. On the other side, there shouldn't be any reason to use an old Hugo version ;]

## Default call

```go-html-template
{{</* youtube
        id="3G4kCi_ldr8"
*/>}}
```

{{< youtube id="3G4kCi_ldr8" >}}

## Quick shortcode

Please don't do that ;] But you can if you want. Use the `youtube` shortcode just in combination with the video-ID. You don't even need quotation marks around the ID.

```go-html-template
{{</* youtube
        3G4kCi_ldr8
*/>}}
```

{{< youtube 3G4kCi_ldr8 >}}

## Add an aria-label to the play button

```go-html-template
{{</* youtube
        id="3G4kCi_ldr8"
        title="Jon Hopkins with Ram Dass, East Forest - Sit Around The Fire"
*/>}}
```

{{< youtube id="3G4kCi_ldr8" title="Jon Hopkins with Ram Dass, East Forest - Sit Around The Fire" >}}
