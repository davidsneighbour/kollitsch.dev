---
title: Debug
linktitle: hugo-debug
description: Debug everything in Hugo!
summary: This module for GoHugo adds debugging partials for many use cases.
date: 2022-07-27T21:17:03+07:00
publishDate: 2022-07-27T21:17:03+07:00
lastmod: 2023-05-09T19:15:22+07:00
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
---

This module for GoHugo adds debugging partials for everything you need to debug.

{{< component-box >}}

## Notes

- This is a GoHugo module to use while you are developing your theme or website. It slows down the build process. Knowledge about variables in our template and NOT speed is our main priority. It is advised to add the module only the development configuration or check if the layout is processed by the development server to minimise its impact.
- This module is based on the work in [kaushalmodi/hugo-debugprint](https://github.com/kaushalmodi/hugo-debugprint).

## Usage

Either add `disabled = true` to your live server configuration or check, if you are on a development server by using `{{- if site.IsServer -}}` around your calls to the partials.

A quick sample for its usage is the following debugging of a pages data:

```go-html-template
{{- if site.IsServer -}}
  <footer id="debugging">
    <div class="container">
      <div class="row">
        <div class="col-12">
          {{- partial "debugprint.html" . -}}
          {{- partial "debugprint.html" .Params -}}
          {{- partial "debugprint.html" .Site -}}
          {{- partial "debugprint.html" .Site.Menus -}}
          {{- partial "debugprint.html" .Resources -}}
          {{- partial "debugprint.html" .File -}}
        </div>
      </div>
    </div>
  </footer>
{{- end -}}
```

### Debug from within layouts

To print a variable in one of your layouts:

```go-html-template
{{ partial "debugprint" . }}
{{ partial "debugprint" .Params }}
{{ partial "debugprint" site }}
{{ partial "debugprint" site.Menus }}
{{ partial "debugprint" .GitInfo }}
{{ partial "debugprint" .Resources }}
{{ partial "debugprint" .File }}

{{/* in shortcodes */}}
{{ partial "debugprint" . }} <!-- this will debug the internals of the shortcode -->
{{ partial "debugprint" .Position }} <!-- this will show where the shortcode was called -->
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

```go-html-template
{{- partial "debug.html"
      (dict
        "message" "going into PostProcessing"
        "context" .
        "severity" "warn"
        "level" 4
        "slug" dnb-some-error
      )
-}}
```

_Note:_ Multiline layout functions are supported since Hugo 0.81.0. In older versions remove the new lines in these samples.

The dictionary options are as follows:

- **message:** The message to print. It will be prefixed with the datetime and the severity slug.
- **context:** The context to debug, typically the dot. There is currently nothing else than the dot expected, we have explicit debugging on the todo list where the context can be something to debug to the CLI.
- **severity:** Slug marking the severity level. one of debug, info (default), warn, error or fatal.
- **level:** 1 to 10 for the severity level. Can be used to have a more fine grained control over severity levels.
- **slug:** (not implemented, keep an eye on #71) an ID to use so users can silence errors (level 7 and up)
- **namespace:** (not implemented as partial option, see configuration section) namespace slug to differentiate yourself from others (default dnb)

The resulting error message will look like this:

`SEVERITY TIMESTAMP [namespaceslug/severity-level] message`

_Note:_ GoHugo will print all messages that occur more than once will printed only once. This applies to identical error messages. To work around this (if you wish to for instance notify the user about multiple image transformations not working) you should add an identifier (the image url? the resource id?) to the debugging message.

_Note2:_ Hugo makes only ERROR and WARN levels available, so all `SEVERITY` stamps in the beginning of each log line will be either a red ERROR (from errors and fatals --- 1 to 4) or a yellow WARN for all others (debug to warn --- 5 to 10).

### Debug pages in a comprehensive format

While all other debugging options above are flexible options to debug any value, the `debugpage` partial opts to show a bunch of interesting information about the page object it is called on. It's quite specific and tries to cut out the noise.

You can add the following call to any layout file:

```go-html-template
{{ partialCached "debugpage.html" . . }}
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

- **namespace:** (string) namespace slug for your plugin/theme. keep it short. three characters are enough. There is no restriction on this, but think about the look of the loglines with longer namespaces.
- **debuglevel:** (number, 0 to 10) set the severity level that should maximally be shown. The higher the more info/debug on your CLI. 10 is maximum and can be helpful to debug issues.
- **disablenote:** (bool) disables the note at the beginning that the debug module is used.

## Styling

A quick Bootstrap 5 based SASS style is mounted into `assets/scss/_debugprint.scss` to be used via `@import "debugprint";`. Depending on your own styles you can add your own styles based on the following structure:

```scss
.debugprint table,
table.debugprint {
  td,
  th {
  }
  .true {
  }
  .false {
  }
}
```

## Formatters

Formatters are dedicated layout files for certain variable types. dnb-hugo offers reusable templates for any structural need (two and three column tables or plain printout) and takes over the markup and styling of the output.

The configuration for a single formatter offers the following parameters:

```toml
[[dnb.debug.formatters]]
type = "navigation.MenuEntry"
catch = "navigation\\.MenuEntry$"
class = "struct"
internal = "map"
weight = 100
slug = "menuentry"
label = "Menu Entry"
description = ""

```

- **internal** (required, if no `catch` or `type` is used) - Set to `map` or `slice` to give a general indicator of the variable type.
- **catch** (required, if no `type` or `internal` is used) - A regular expression to match on the type. For instance `"navigation\\.MenuEntry$"`
- **type** (required, if no `catch` or `internal` is used) - A string expression to match on the type. For instance `boolean`.
- **class** - A type class to define the output format. Not yet implemented.
- **weight** - This parameter is used to sort the formatters before they are used to display a variable type. If no weight is given then the order in the configuration is used. First come (based on `type` or `catch`) first serve.
- **slug** (required) - Filename part for the formatter layout in `layouts/partials/debugging-formatters/SLUG.html`.
- **label** (required) - A title to show for the debugging-table that is used to debug dictionaries and slices.
- **description** (required) - A description to show as overlay for the debugging-table that is used to debug dictionaries and slices.

Evaluation of the type is done in the order or `internal`, then `catch`, then `type`. First come first serve.
