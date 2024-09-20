---
'$schema': /static/_schemata/blog.schema.yaml
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
  - title: Photo by [Kelsy Gagnebin](https://unsplash.com/@kelsymichael) via [Unsplash](https://unsplash.com/)
    src: header.jpg
categories:
  - kurzschnitte
tags:
  - kurzschnitte
  - bookmarks
  - 100DaysToOffload
type: blog
unsplash:
  imageid: UcEzgZ6k19o

---

INTRODUCTION

## Webdev

## Learn

## Auditing

## Food for though

## Fun and stuff

## Listen

## Watch
 
## What you missed

{{< tagnavigation "kurzschnitte" >}}
