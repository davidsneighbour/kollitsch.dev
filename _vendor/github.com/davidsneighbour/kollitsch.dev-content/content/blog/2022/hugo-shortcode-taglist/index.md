---
title: "Hugo Shortcode: Taglist"
description: "I needed a Hugo shortcode to show a list of posts that belonged to a [certain](/tags/laboratory/) tag, which is quite easy. Add the following to `layouts/shortcodes/taglist.html` or whatever name you like to use for the shortcode."
summary: "I needed a Hugo shortcode to show a list of posts that belonged to a [certain](/tags/laboratory/) tag, which is quite easy. Add the following to `layouts/shortcodes/taglist.html` or whatever name you like to use for the shortcode."
date: 2022-03-01T21:18:21+07:00
publishDate: 2022-03-01T21:18:21+07:00
lastmod: 2022-03-01T21:18:21+07:00
resources:
  - title: "Photo by [Joanna Kosinska](https://unsplash.com/@joannakosinska) via [Unsplash](https://unsplash.com/)"
    src: "joanna-kosinska-1_CMoFsPfso-unsplash.jpg"
tags:
  - gohugo
  - shortcode
  - 100DaysToOffload
---

I needed a Hugo shortcode to show a list of posts that belonged to a [certain](/tags/laboratory/) tag, which is quite easy. Add the following to `layouts/shortcodes/taglist.html` or whatever name you like to use for the shortcode.

```go {lineAnchors=code1}
{{- $title := $.Params.title -}}
{{- $tag := $.Params.tag -}}
{{- $limit := int ($.Params.limit) -}}
{{- $tags := (index site.Taxonomies.tags $tag) -}}
{{- if (eq $limit -1) -}}
  {{- $limit = len site.Taxonomies.tags -}}
{{- end -}}
<h3>{{- $title| default "Related Posts" -}}</h3>
<ul>
{{- range (first $limit $tags.Pages) -}}
  <li>
    <a href="{{- .Permalink -}}">{{- .Title -}}</a>
  </li>
{{- end -}}
</ul>
```

The available parameters for this shortcode are:

| param | type | description |
|:-----:|:----:|:-----------|
| title | string | title of the list output, will be put inside of h3 tags |
| tag | string | tag name whose items are to be shown |
| limit | int | number of items to show, -1 for all |

Now calling it via one of the following shortcodes will show a list of recent posts in that tag:

```go {lineAnchors=code2}
{{</* taglist tag="tagname" limit="5" */>}} --- showing 5 items with the default title
{{</* taglist tag="tagname" title="Some Title" */>}} --- showing all items with the custom title
{{</* taglist tag="tagname" limit="-1" */>}} --- showing all items with the default title
```
