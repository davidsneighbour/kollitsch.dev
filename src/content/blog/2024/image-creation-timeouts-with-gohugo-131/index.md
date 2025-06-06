---
title: Image creation timeouts with Gohugo v0.131.0
description: ''
summary: ''
date: '2024-08-04T19:47:01+07:00'
resources:
  - title: GoHugo v0.131.0
    src: hugo-0.131.0.png
tags:
  - gohugo
  - tag2
  - tag3
  - 100DaysToOffload
fmContentType: blog
cover: hugo-0.131.0.png
---

In Hugo v0.131.0, there's an exciting update: the image hashing process now uses `xxHash`, which is much speedier compared to the old MD5 hashing. It trims down those lengthy processed image filenames to a minimum.

But, here is the catch: this nifty update means all your images will be re-processed, potentially causing longer initial build times and even some timeouts.

```plaintext
Error: error building site: render: failed to render pages: render of "page" failed:
"/home/patrick/github.com/davidsneighbour/kollitsch.dev/layouts/_default/single.html:9:22":
execute of template failed:
template: _default/single.html:9:22:
executing "main" at <partials.Include>:
error calling Include: partial "content/post.html" timed out after 30s.
This is most likely due to infinite recursion. If this is just a slow
template, you can try to increase the 'timeout' config setting.
```

No worries, though! Just add this line to your `hugo.toml` or `config.toml`:

```toml
timeout = "600s"
```

This simple hack prolongs the timeout for image processing and ensures your first build runs smoothly, and after that, it's back to the usual speedy Hugo goodness.

For the full details about this update, check out the [release page](https://github.com/gohugoio/hugo/releases/tag/v0.131.0).
