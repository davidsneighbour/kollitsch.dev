---
title: Debugging and Logging to CLI
linkTitle: CLI Debugging
date: 2023-11-16T15:46:21+07:00
resources:
- src: header-card.png
categories:
- components
tags:
- gohugo
- component
- development
lastmod: 2024-03-15T20:21:20+07:00
aliases:
- /components/hugo-debug/debugging
- /gohugo/hugo-debug/debugging
---

## Debug from your layout file into the CLI/server log

Some times we developers want to inform and warn our users, or even throw an error. The debug partial is your connection to the CLI with some more options than GoHugo's internal error functionality.

```go-html-template
{{- partial "debug-cli.html"
      (dict
        "message" "going into PostProcessing"
        "context" .
        "severity" "warn"
        "level" 4
        "slug" dnb-some-error
      )
-}}
```

*Note:* Multiline layout functions are supported since Hugo 0.81.0. In older versions remove the new lines in these samples.

The dictionary options are as follows:

* **message:** The message to print. It will be prefixed with the datetime and the severity slug.
* **context:** The context to debug, typically the dot. There is currently nothing else than the dot expected, we have explicit debugging on the todo list where the context can be something to debug to the CLI.
* **severity:** Slug marking the severity level. one of debug, info (default), warn, error or fatal.
* **level:** 1 to 10 for the severity level. Can be used to have a more fine grained control over severity levels.
* **slug:** (not implemented, keep an eye on #71) an ID to use so users can silence errors (level 7 and up)
* **namespace:** (not implemented as partial option, see configuration section) namespace slug to differentiate yourself from others (default dnb)

The resulting error message will look like this:

`SEVERITY TIMESTAMP [namespaceslug/severity-level] message`

*Note:* GoHugo will print all messages that occur more than once will printed only once. This applies to identical error messages. To work around this (if you wish to for instance notify the user about multiple image transformations not working) you should add an identifier (the image url? the resource id?) to the debugging message.

*Note2:* Hugo makes only ERROR and WARN levels available, so all `SEVERITY` stamps in the beginning of each log line will be either a red ERROR (from errors and fatals --- 1 to 4) or a yellow WARN for all others (debug to warn --- 5 to 10).
