---
'$schema': /assets/schemas/blog.schema.yaml
type: blog
title: {{ replace .Name "-" " " | title }}
linkTitle: {{ replace .Name "-" " " | title }}
description: ""
summary: ""

draft: true

date: "{{ .Date }}"
publishDate: "{{ .Date }}"
lastmod: "{{ .Date }}"

resources:
  - title: Photo by [Name](Link) via [Unsplash](https://unsplash.com/)
    name: image name if other than src
    src: ave-calvar-HcUDHJfd5GY-unsplash.jpg

author:
  name: Patrick Kollitsch
  homepage: https://kollitsch.dev/
  image: /images/patrick-kollitsch.jpg

authors:
  - name: Patrick Kollitsch
    homepage: https://kollitsch.dev/
    image: /images/patrick-kollitsch.jpg

tags:
  - tag1
  - tag2
  - tag3
  - 100DaysToOffload

---
