---
title: "{{ replace .Name "-" " " | title }}"
linkTitle: "{{ replace .Name "-" " " | title }}"
# used for SEO description, should not go over 180 characters
description: ""
# used for the preview of the post on list pages
# if missing or empty the automatic excerpt is used
summary: ""

# dates
date: {{ .Date }}
publishDate: {{ .Date }}
lastmod: {{ .Date }}

# add multiple resources to create a slider gallery
resources:
  - title: "Photo by [Ave Calvar](https://unsplash.com/@shotbyrain) via [Unsplash](https://unsplash.com/s/photos/horizon)"
    name: "image name if other than src"
    src: "ave-calvar-HcUDHJfd5GY-unsplash.jpg"

# remove the author section to use the sites author setup
author: 
  name: "Patrick Kollitsch"
  homepage: "https://kollitsch.de/"
  image: "/images/patrick-kollitsch.jpg"
  email: "patrick@kollitsch.de"

# taxonomification
categories: ["category1"]
tags: ["tag1", "tag2"]
keywords: ["keyword1", "keyword2"]
---
