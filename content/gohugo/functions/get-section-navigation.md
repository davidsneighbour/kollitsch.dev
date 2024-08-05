---
title: getSectionNavigation
summary: ""

weight: 100
---

Creates an unordered list of pages within the current section.

## Usage

Either call the partial with a single parameter, the section name, or with a dictionary containing the configuration.

```go-html-template
{{- partial "func/getSectionNavigation.html" .Section -}}
```

```go-html-template
{{- $options := dict "section" .Section "summary" true -}}
{{- partial "func/getSectionNavigation.html" $options $options -}}
```

### Parameters

* `section` (string): The name of the section to get the navigation for.
* `summary` (boolean): Whether to include the summary of the page in the navigation. Defaults to `false`.
