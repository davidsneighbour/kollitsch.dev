---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
description: ""
# add multiple resources to create a slider gallery
resources:
  - name = "Photo by [Ave Calvar](https://unsplash.com/@shotbyrain) via [Unsplash](https://unsplash.com/s/photos/horizon)"
    src = "ave-calvar-HcUDHJfd5GY-unsplash.jpg"
# remove the author section to use the sites author setup
author: 
  name: "Patrick Kollitsch"
  homepage: "https://kollitsch.de/"
  image: "/images/patrick-kollitsch.jpg"
  email: "patrick@kollitsch.de"
tags: ["tag1", "tag2"]
categories: ["category1"]
---
