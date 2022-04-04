---
type: default
title: {{ replace .Name "-" " " | title }}
linkTitle: {{ replace .Name "-" " " | title }}
description: ""
summary: ""

date: {{ .Date }}
publishDate: {{ .Date }}
lastmod: {{ .Date }}

resources:
- title: "Photo by [Ave Calvar](https://unsplash.com/@shotbyrain) via [Unsplash](https://unsplash.com/s/photos/horizon)"
  name: "image name if other than src"
  src: "ave-calvar-HcUDHJfd5GY-unsplash.jpg"

author:
- name: "Patrick Kollitsch"
  homepage: "https://kollitsch.de/"
  image: "/images/patrick-kollitsch.jpg"
  email: "patrick@kollitsch.de"

categories:
- category1

tags:
- tag1
- tag2
- tag3

keywords:
- keyword1
- keyword2
- keyword3

---
