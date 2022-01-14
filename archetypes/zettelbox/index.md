# yaml-langauge-server: $schema=../../etc/schema/frontmatter-zettelbox.json
---
title: '{{ replace .Name "-" " " | title }}'
description: ""
date: {{ .Date }}

zettelboxtags:
  - tag1
  - tag2
  - tag1
---
