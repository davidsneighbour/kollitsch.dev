---
'$schema': /assets/schemas/blog.schema.yaml
title: {{ replace .Name "-" " " | title }}
linkTitle: {{ replace .Name "-" " " | title }}
description: ''
summary: ''

draft: true

type: video

date: {{ .Date }}
publishDate: {{ .Date }}
lastmod: {{ .Date }}

resources:
  - src: header.jpg

tags:
  - tag1
  - tag2
  - tag3
  - 100DaysToOffload

video:
  youtube: slug (either youtube or vimeo)
  vimeo: slug (either youtube or vimeo)
---
