---
title: getTitle
summary: ""

weight: 100
---

## Functionality

## Usage

```gohtml
{{- $title := partialCached "func/getTitle.html" . page -}}
<title>{{- $title -}}</title>
```

## Configuration

### Via partial configuration

### Via param-section configuration

## Notes

### Cacheability

Should be cached per page object. Title should stay the same in the duration of a rebuild.
