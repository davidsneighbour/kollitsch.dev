---
title: {{ replace .Name "-" " " | title }}
linkTitle: {{ replace .Name "-" " " | title }}
description: ""
summary: ""

tags:
  - programming-music
  - music genre
  - artist tag
  - another artist tag
  - 100DaysToOffload
posttype: music

draft: true

resources:
  - src: header.jpg

video:
  youtube: slug (either youtube or vimeo)
  vimeo: slug (either youtube or vimeo)
  artist: slug
  name: (optional) artist name (if it's a collaboration for instance)
  title: name of the video

date: "{{ .Date }}"
publishDate: "{{ .Date }}"
lastmod: "{{ .Date }}"
---

Frontmatter `video > artist` refers to `data/dnb/kollitsch/music.toml`>slug where name/link/description for the videos artist should be saved. Remove this message on publication.
