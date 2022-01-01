---
title: Print ordinal date suffixes (1st/2nd/3rd/4th) in GoHugo
date: '2021-10-28T21:56:41+07:00'
lastmod: '2021-10-28T21:56:41+07:00'
publishDate: '2021-10-28T21:56:41+07:00'
resources:
  - src: mick-haupt-ePHz9WOME0c-unsplash.jpg
    title: Photo by [Mick Haupt](https://unsplash.com/@rocinante_11) via [Unsplash](https://unsplash.com)
tags:
  - quicktip
  - ordinals
  - dateformat
  - gohugo
---

Golangs `$date.Format` is unable to add ordinal suffixes to dates (like 1st, 2nd, 3rd, 4th). Let's not judge Golang for that. The following is how I remedy this issue:

`layouts/partials/func/formatOrdinalDate.html`

```go-html-template
{{- $format := .format -}}
{{- $date := .date -}}
{{- $shortened := "th" -}}
{{- if in (slice 1 21 31) $date.Day -}}
  {{- $shortened = "st" -}}
{{- else if in (slice 2 22) $date.Day -}}
  {{- $shortened = "and" -}}
{{- else if in (slice 3 23) $date.Day -}}
  {{- $shortened = "rd" -}}
{{- end }}
{{- return $date.Format (printf $format $shortened) -}}
```

call to this partial:

```go-html-template
<span title="{{-
  with partialCached
    "func/formatOrdinalDate" (
        dict
            "format" "January 2%s, 2006 at 15:04 UTCMST:00"
            "date" .Lastmod .Lastmod
    )
  -}}
  {{- . -}}
{{- end -}}">
```

Inside of the format string you can use whatever formatting you want to display based on what Golang understands as [date format string](https://programming.guide/go/format-parse-string-time-date-example.html). Then add a `%s` at the location where you wish to have the ordinal suffix.

And that's that.
