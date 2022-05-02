---
title: "Hugo 0.95 - Update Notes"
linkTitle: "Hugo 0.95"
description: ""
date: 2022-03-16T23:16:55+07:00
publishDate: 2022-03-16T23:16:55+07:00
lastmod: 2022-03-16T23:16:55+07:00
resources:
  - title: "GoHugo"
    src: "header.png"
tags:
  - gohugo
  - notes
  - golang
  - 100DaysToOffload
---

[Hugo 0.95.0](https://github.com/gohugoio/hugo/releases/tag/v0.95.0) brings some really useful features (next to smaller speed increases as always) and upgrades the used [Golang version to 1.18](https://go.dev/blog/go1.18).

### New feature: {{ break }} and {{ continue }}

`break` and `continue` are keywords known to developers of any programming language. It's one of the weird characteristics of Golang, that the template package still didn't have these features. With the introduction of these keywords we can now use the following syntax:

#### `{{ break }}` - break out of a range (leaving it completely for all subsequent items)

```go {lineAnchors=code1}
{{ range $i, $p := site.RegularPages }}
  {{ if gt $i 2 }}
    {{/*
        break out of the range, we only want to print
        the first 3 pages in site.RegularPages */}}
    {{ break }}
  {{ end }}
  {{ $p.Title }}
{{ end }}
{{/* after `break` out we continue here */}}
```

#### `{{ continue }}` - leave the current loop of a range (step to the next item)

```go {lineAnchors=code2}
{{ range $i, $p := site.RegularPages }}
  {{/*
      after `continue` (skipping) the third loop
      we continue here */}}
  {{ if eq $i 2 }}
    {{/*
        skip this iteration of the range if it's
        the third item in site.RegularPages */}}
    {{ continue }}
  {{ end }}
  {{ $p.Title }}
{{ end }}
```

The history of this feature in Golang 1.18 is a bit complicated, but nicely explains the mindset of Golang programmers in [two](https://github.com/golang/go/issues/20523) [issues](https://github.com/golang/go/issues/20531) over nearly 5 years. Let's ignore that and enjoy these features availability.

There is [an issue open about a problem with spaces](https://github.com/golang/go/issues/51670) in the `break` and `continue` keywords. For now keep using `{{break}}` and `{{continue}}` if you encounter errors.

### Feature change: `{{ and }}` and `{{ or }}` are short-circuiting

The following snippet previously did throw an error for the second part `(eq .File.Extension "html")`, if`.File` was not defined. Now it will "[short circuit](https://github.com/golang/go/issues/31103)" immediately after Golang evaluates the first part to nil then the second part is not evaluated.

```go {lineAnchors=code3}
{{ if and .File (eq .File.Extension "html") }}
{{ end }}
```

This feature request to Golang is only three years old ;) Well... good things will take time.

### Golang 1.18

As already mentioned, [Golang 1.18](https://go.dev/blog/go1.18) was released today and promptly Hugo updated to use it. This is a major change, because it brings a lot of new features and fixes. It also makes Hugo much faster. You can find [all changes](https://github.com/gohugoio/hugo/releases/tag/v0.95.0) in the release notes.

### Quick Sidenote

The recently introduced CLI parameter `--renderStaticToDisk` was a great way to save only static files on the drive and keep the content files in the memory. It didn't work properly though on Windows so it was subsequently removed. Expect it to be back at some point in the future. For now use `hugo server --renderToDisk` to save *all* files to the disk when you run the development server.
