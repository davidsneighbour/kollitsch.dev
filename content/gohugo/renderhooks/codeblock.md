---
title: Codeblock
date: 2024-04-14T20:33:22+07:00
publishDate: 2024-04-14T20:33:22+07:00
lastmod: 2024-09-29T22:35:37.144Z
resources:
  - src: header-card.png
tags:
  - gohugo
  - component
  - development
---

## Sample 1

```toml
[markup.highlight]
  codeFences = true
  guessSyntax = true
  hl_Lines = ""
  lineNoStart = 1
  lineNos = true
  lineNumbersInTable = true
  noClasses = false
  style = "monokai"
  tabWidth = 4
```

## Sample 2

```toml {linenos=[1,"5-6"],something=else,filename="sample.toml"}
[markup.highlight]
  codeFences = true
  guessSyntax = true
  hl_Lines = ""
  lineNoStart = 1
  lineNos = true
  lineNumbersInTable = true
  noClasses = false
  style = "monokai"
  tabWidth = 4
```
