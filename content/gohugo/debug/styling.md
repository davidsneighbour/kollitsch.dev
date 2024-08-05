---
title: Styling
date: 2023-11-16T15:46:21+07:00
resources:
- src: header-card.png
categories:
- components
draft: true
tags:
- gohugo
- component
- development
lastmod: 2024-03-15T20:21:17+07:00
---

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
