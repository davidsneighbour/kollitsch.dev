---
title: Showing the Current Breakpoint for Bootstrap
linkTitle: Showing the Current Breakpoint for Bootstrap
description: ''
summary: ''
date: '2024-01-03T21:42:52+07:00'
resources:
  - src: header.jpg
tags:
  - shortcode
  - bootstrap
  - development
  - 100DaysToOffload
type: blog
fmContentType: blog
---

The problem: I am refining the display of certain sections of my website and I need to know what exact break point is userd currently by Bootstrap. I am using the latest Bootstrap version.

The solution: I created a shortcode or partial that I can use in my templates to display the current breakpoint. I am
using the Bootstrap 5.

Shortcode or partial "show-breakpoints.html":

```go-template
{{- if hugo.IsServer -}}
  <div class="container responsive-ruler">
    {{- $breakpoints := slice "xs" "sm" "md" "lg" "xl" "xxl" -}}
    {{- range $index, $value := $breakpoints -}}
      {{- $classes := printf "col d-%s-block" $value -}}
      {{- if eq $index 0 -}}
        {{- $classes = printf "d-block %s" $classes -}}
      {{- else -}}
        {{- $classes = printf "d-none %s %s" $classes (printf "d-%s-none" (index $breakpoints (sub $index 1))) -}}
      {{- end -}}
      {{- if lt $index (sub ($breakpoints | len) 1) -}}
        {{- $classes = printf "%s %s" $classes (printf "d-%s-none" (index $breakpoints (add $index 1))) -}}
      {{- end -}}
      <div class="{{- $classes -}}">
        <div class="identifier">{{- . -}}</div>
      </div>
    {{- end -}}
  </div>
{{- end -}}
```

If you are using different breakpoints from the ones defined in Bootstrap you can redefine them in line 3.

Using this partial in your template:

```html
{{ partialCached "show-breakpoints.html" . }}
```

This will display the current breakpoint. You can design the output to your liking by using the `.responsive-ruler` class for the box and the `.responsive-ruler .identifier` class for the breakpoint label.

By the way: the `hugo.IsServer` is used to only display the breakpoints in the development environment. You can remove this if you want to display the breakpoints in production as well. Let me know why you would want to do that, though ;)
