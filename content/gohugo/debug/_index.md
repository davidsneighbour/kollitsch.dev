---
title: Debug
description: Debug everything in Hugo! This module for GoHugo adds debugging partials for everything you need to debug.
date: 2022-07-27T21:17:03+07:00
publishDate: 2022-07-27T21:17:03+07:00
lastmod: 2024-03-15T18:25:02+07:00
resources:
- src: header-card.png
categories:
- components
tags:
- gohugo
- component
- development
component:
  slug: hugo-debug
  host: github.com
  user: davidsneighbour
  status: release
  list: true
aliases:
- /components/hugo-debug
- /gohugo/hugo-debug
cascade:
  params:
    config:
      overviewLabel: "More information"
      band: GoHugo
---

Debug everything in Hugo! This module for GoHugo adds debugging partials for everything you need to debug.

## Notes

* This is a GoHugo module to use while you are developing your theme or website. It slows down the build process. Knowledge about variables in our template and NOT speed is our main priority. It is advised to add the module only the development configuration or check if the layout is processed by the development server to minimise its impact.
* This module is inspired by [kaushalmodi/hugo-debugprint](https://github.com/kaushalmodi/hugo-debugprint).

## Usage

Either add `disabled = true` to your live server configuration or check, if you are on a development server by using `{{- if site.IsServer -}}` around your calls to the partials.

A quick sample for its usage is the following debugging of a pages data:

```go-html-template
{{- if site.IsServer -}}
  <footer id="debugging">
    <div class="container">
      <div class="row">
        <div class="col-12">
          {{- partial "debug-print.html" . -}}
        </div>
      </div>
    </div>
  </footer>
{{- end -}}
```

### Debug from within layouts

To print a variable in one of your layouts:

```go-html-template
{{- partial "debug-print.html" . -}}
{{- partial "debug-print.html" .Params -}}
{{- partial "debug-print.html" site -}}
{{- partial "debug-print.html" site.Menus -}}
{{- partial "debug-print.html" .GitInfo -}}
{{- partial "debug-print.html" .Resources -}}
{{- partial "debug-print.html" .File -}}

{{/* in shortcodes */}}
{{- partial "debug-print.html" . -}} <!-- this will debug the internals of the shortcode -->
{{- partial "debug-print.html" .Position -}} <!-- this will show where the shortcode was called -->
```

Exchange the context `.` with whatever variable you want to debug. Sub-collections or sub-slices might require extra setup to be debugged, depending on the structure and the type of the values.

### Debug from within markdown (content) files

To debug page data from within a Markdown file:

```markdown
{{</* debugprint */>}} <!-- the same as -->
{{</* debugprint "page" */>}} <!-- debugs page variable -->
{{</* debugprint "params" */>}} <!-- debugs page params -->
{{</* debugprint "site" */>}} <!-- debug sites params -->
{{</* debugprint param="bla" */>}} <!-- debugs .Params.bla -->
```

Debugging from within Markdown requires explicit configuration in the shortcode template. [Open a new issue](https://github.com/davidsneighbour/hugo-blockify/issues) if you require a specific debugging subject.

### Debug from your layout file into the CLI/server log

Some times we developers want to inform and warn our users, or even throw an error. The debug partial is your connection to the CLI with some more options than GoHugo's internal error functionality.

[Read On](./debugging/)

### Debug pages in a comprehensive format

While all other debugging options above are flexible options to debug any value, the `debug-page.html` partial opts to show a bunch of interesting information about the page object it is called on. It's quite specific and tries to cut out the noise.

You can add the following call to any layout file:

```go-html-template
{{ partialCached "debug-page.html" . . }}
```

or by using the following shortcode in your Markdown:

```markdown
{{</* debugpage */>}}
```

The Markdown shortcode will take the context of the currently parsed page while the template call will take what you hand over.

## Configuration

The debug component is configurable via the `params` section in your configuration. The following samples will assume your configuration lives in `config/_default/params.toml`. If you are using a root level configuration don't forget to add `params.` in front of each section and put it at the right place.

```toml
[dnb.debug]
namespace = "dnb"
debuglevel = 8
disablenote = false
```

* **`namespace`:** (string) namespace slug for your plugin/theme. keep it short. three characters are enough. There is no restriction on this, but think about the look of the loglines with longer namespaces.
* **`debuglevel`:** (number, 0 to 10) set the severity level that should maximally be shown. The higher the more info/debug on your CLI. 10 is maximum and can be helpful to debug issues.
* **`disablenote`:** (bool) disables the note at the beginning that the debug module is used.
