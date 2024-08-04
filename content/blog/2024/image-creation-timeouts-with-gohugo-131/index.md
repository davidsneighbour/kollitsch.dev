---
'$schema': /static/_schemata/blog.schema.yaml
title: Image creation timeouts with Gohugo v0.131.0
description: ""
summary: ""

date: 2024-08-04T19:47:01+07:00
publishDate: 2024-08-04T19:47:01+07:00
lastmod: 2024-08-04T19:47:01+07:00

resources:
  - title: GoHugo v0.131.0
    src: hugo-0.131.0.png

tags:
  - gohugo
  - tag2
  - tag3
  - 100DaysToOffload

type: blog

---

In Hugo v0.131.0, there's an exciting update: the image hashing process now uses `xxHash`, which is much speedier compared to the old MD5 hashing. It trims down those lengthy processed image filenames to a minimum.

But, here is the catch: this nifty update means all your images will be re-processed, potentially causing longer initial build times and even some timeouts. No worries, though! Just add this line to your `hugo.toml` or `config.toml`:

```toml
timeout = "600s"
```

This simple hack prolongs the timeout for image processing and ensures your first build runs smoothly, and after that, it's back to the usual speedy Hugo goodness.

For the full details about this update, check out the [release page](https://github.com/gohugoio/hugo/releases/tag/v0.131.0).
