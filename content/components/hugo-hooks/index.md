---
title: Hooks
linktitle: hugo-hooks
description: ''
summary: ''
date: 2022-07-27T21:23:50+07:00
publishDate: 2022-07-27T21:23:50+07:00
lastmod: 2023-05-09T19:18:43+07:00
resources:
  - src: header-card.png
categories:
  - components
tags:
  - gohugo
  - component
  - seo
component:
  slug: hugo-hooks
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

Hooks for GoHugo layouts. An easy way for theme developers to let users add partials and blocks at pre-defined safe places to their themes.

We often want to add locations and places in our templates and layouts where it's users can add something on their own. Be it some code for an analytics script, that arbitrary ad or popup or just some space for call to actions or additional footer sections, a banner at the top of the page or some very specific Javascript code, a separator after each fifth post, a button in each header.

You name it. `hugo-hooks` is what you need. This module adds these hooks to your theme and provides a simple way **any theme developer** can add these "layout locations" to "hook" additional features in.

**You as the end-user** can add simple layout files to "hook" into these locations and add whatever pizzazz, panache, flair or sparkle your website needs.

{{< component-box >}}

## Hook principle

Theme users save hooks to the `layouts/partials/hooks` directory. There are no errors if a hook is not found (some themes or modules might provide a feedback if their hook is unused and usage of them is required to get important features working).

If a hook has an added `-cached` to it's name then it will be cached and on re-calls be re-used. Check the documentation of the module or theme that introduces the hook to see if it makes sense to cache that specific hook.

For example:

```go-html-template
{{ partial "func/hook.html" "head-start" }}
```

will load `layouts/partials/hooks/head-start.html` and `layouts/partials/hooks/head-start-cached.html`. The non-cached variant will be loaded **BEFORE** the cached one.

You can force caching by loading the hook via `partialCached` instead.

```go-html-template
{{ partialCached "func/hook.html" "head-start" "cachename"}}
```

These hooks currently **do not return any values**, they execute the layouts. To read more about ideas to extend the hooks to return values read [#2 RFC: Hooks that return values](https://github.com/davidsneighbour/hugo-blockify/issues/14).

## Call hooks in layouts

### Simple Calls

Add the hook name as parameter to simple calls. The context inside of the hook layout will have a hook parameter with that name.

```go-html-template
{{- partial "func/hook.html" "hookname" -}}
{{- partialCached "func/hook.html" "hookname" $CACHENAME -}}
```

### Extended Use (adding parameters to the call)

If the hook supports adding parameters you can call it by adding a `dict` object to your call. The `hook` parameter is required, everything else will be passed through as-is to the hook layout. You should always add `"context" .` to add the local layout-context to your parameters. Can't go wrong with that :)

```go-html-template
{{- partial "func/hook.html" ( dict "hook" "hookname" "context" . ) -}}
{{- partialCached "func/hook.html" ( dict "hook" "hookname" "context" . ) $CACHENAME -}}
```

## Configuration

You can configure the module by setting the following options in the `params` section of your configuration:

```toml
[dnb.hooks]
disable_messages = ["unused_hooks", "running_hooks", "running_cached_hooks", "running_uncached_hooks"]

```

**disable_messages**:

- `unused_hooks` - silences "unused hooks" messages
- `running_hooks` - silences ALL "running hook x" messages
- `running_cached_hooks` - silences all "running cached hook x" messages (`false` if `running_hooks` is false)
- `running_uncached_hooks` - silences all "running uncached hook x" messages (`false` if `running_hooks` is false)

The messages system also uses the methods implemented in `hugo-debug` to silence based on verbosity level.

## Hooks for developers

Implementing the hooks system in your theme or module is easy. There are several ways the system looks for hooks. The following main order is kept:

- hooks in a folder (`layouts/partials/hooks/hook-name/*.html`)
- cached hooks in a folder (`layouts/partials/hooks/hook-name/*-cached.html`)
- hook in a file (`layouts/partials/hooks/hook-name.html`)
- cached hook in a file (`layouts/partials/hooks/hook-name-cached.html`)

### Directory based

### File based

## Best Practices

### "Global" Reusable Hooks

To be very portable between themes the following hooks should be used at the appropriate locations in implementing themes and modules. All of @davidsneighbours GoHugo themes and modules will do so and to support the overall portable format of the underlying idea of the hook system we hope others will too:

| Hookname                | Runs | Location                                                                                                                                                                                                                |
| :---------------------- | :--: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **setup**               |  1   | Runs before anything is put out. Use this hook to set up and configure your scripts.                                                                                                                                    |
| **head-init**           |  1   | Runs right after the `<head>` tag. Layouts using this hook should not print anything out so that the three initial head-tags are printed first. Use `head-start` for things you want in the beginning of the page head. |
| **head-start**          |  1   | Runs after the three initial head-tags.                                                                                                                                                                                 |
| **head-pre-css**        |  1   | Runs inside the head before the stylesheets are added.                                                                                                                                                                  |
| **head-post-css**       |  1   | Runs inside the head after the stylesheets are added.                                                                                                                                                                   |
| **head-end**            |  1   | Runs at the end of the head, before the `</head>` tag.                                                                                                                                                                  |
| **body-start**          |  1   |                                                                                                                                                                                                                         |
| **container-start**     |  1   |                                                                                                                                                                                                                         |
| **content-start**       |  1   |                                                                                                                                                                                                                         |
| **content-end**         |  1   |                                                                                                                                                                                                                         |
| **container-end**       |  1   |                                                                                                                                                                                                                         |
| **footer-start**        |  1   |                                                                                                                                                                                                                         |
| **footer-inside-start** |  1+  |                                                                                                                                                                                                                         |
| **footer-widget-start** |  1+  |                                                                                                                                                                                                                         |
| **footer-widget-end**   |  1+  |                                                                                                                                                                                                                         |
| **footer-inside-end**   |  1+  |                                                                                                                                                                                                                         |
| **footer-end**          |  1   |                                                                                                                                                                                                                         |
| **body-end-pre-script** |  1   | Runs at the end of the body BEFORE the deferred theme javascripts are added.                                                                                                                                            |
| **body-end**            |  1   | Runs at the end of the body AFTER the deferred theme javascripts are added and right before the `</body>` tag.                                                                                                          |
| **teardown**            |  1   | Runs after everything is printed to output. Use this hook to cleanup for your scripts.                                                                                                                                  |

### Namespaced Hooks

For specific modules we advise to use a namespaced hook name (like `dnb-netlification-headers`) to avoid collisions with other modules and hooks. Please document your hooks and refer back to this README so users can dive into the details of the system if required.

### Sample hook usage

Have a look a the following projects to see usage of the hook system:

- [Hooks in the theme of kollitsch.dev](https://github.com/davidsneighbour/kollitsch.dev/search?q=func%2Fhook)
