---
type: blog
title: Better code highlighting for Hugo with render hooks
description: One of GoHugo's problems is, that the focus is mostly on speed. Simple HTML
  rules are prone to be ignored or freely interpreted (for instance, in the
  internal templates). But it offers ways to override and configure things, so
  not all is lost.

date: 2022-05-04T22:11:55+07:00
publishDate: 2022-05-04T22:11:55+07:00
lastmod: 2022-05-04T22:25:29+07:00

resources:
  - title: Photo by [Ussama Azam](https://unsplash.com/@ussamaazam) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg

tags:
  - gohugo
  - howto
  - render-hook
  - 100DaysToOffload
---

One of GoHugo's problems is, that the focus is mostly on speed. Simple HTML rules are prone to be ignored or freely interpreted (for instance, in the [internal templates](https://github.com/gohugoio/hugo/tree/master/tpl/tplimpl/embedded/templates)). But it offers ways to override and configure things, so not all is lost.

Let's talk about the [highlight](https://gohugo.io/content-management/syntax-highlighting/)ing [shortcode](https://github.com/gohugoio/hugo/blob/master/tpl/tplimpl/embedded/templates/shortcodes/highlight.html) (or the default markup rendering for highlighting code). If you choose to display your highlighting section with line numbers that can be deep-linked, then you are in hot water, if you use two of these sections on a single page. The deeplinks are done via a counter system that is identical if both sections start with the line 1 (which they typically do) resulting in multiple id attributes of `#code-1`, `#code-2`, etc. for each first, second, etc. line.

The `highlight` template can be overridden easily by just adding your own shortcode template. Fixing this for the far more used highlighting markup of MarkDown (three backticks) since v0.93.0 GoHugo also offers [render hooks for code blocks](https://gohugo.io/templates/render-hooks/#render-hooks-for-code-blocks).

Using this render hook we can add the following layout to `layouts/_default/_markup/render-codeblock.html` or any (language or section) specific render hook:

```go-html-template
{{- $options := .Options -}}
{{- $data := newScratch -}}
{{- $data.Set "options" dict -}}
{{- range $key, $value := $options -}}
  {{- $data.SetInMap "options" (lower $key) $value -}}
{{- end -}}
{{- $replacement := (printf "%s%s" "code" (substr (md5 .Inner) 0 7)) -}}
{{- $data.SetInMap "options" "lineanchors" $replacement -}}
{{- highlight .Inner .Type ($data.Get "options") -}}
```

The same should go into your `highlight` shortcode at `layouts/shortcodes/highlight.html`.

What this layout does is, that it exchanges the `lineanchors` option of the code highlighting plugin of GoldMark with an individual string for each separate highlighting code.

This solves the issue of the double-id output for multiple highlighting sections per post or page.

**Sidenote:** Lines 1 to 8 of the code sample above by the way show, how you can replace or update a dict value inside of your layout file. This is one of the not anymore many reasons to use a `.Scratch` in GoHugo. It's a bit convoluted, but that is how Go templates works ;)
