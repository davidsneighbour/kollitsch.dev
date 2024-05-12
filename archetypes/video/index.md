---
'$schema': /static/_schemata/blog.schema.yaml
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
  - title: Photo by [Name](Link) via [Unsplash](https://unsplash.com/)
    name: image name if other than src
    src: ave-calvar-HcUDHJfd5GY-unsplash.jpg

tags:
  - tag1
  - tag2
  - tag3
  - 100DaysToOffload

video:
  youtube: slug (either youtube or vimeo)
  vimeo: slug (either youtube or vimeo)
---
