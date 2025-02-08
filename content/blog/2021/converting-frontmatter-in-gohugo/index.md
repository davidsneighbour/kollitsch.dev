---
title: Converting frontmatter in GoHugo
tags:
  - gohugo
  - frontmatter
  - configuration
date: 2021-11-02T15:49:49.000Z
resources:
  - src: ferenc-almasi-HfFoo4d061A-unsplash.jpg
    title: >-
      Photo by [Ferenc Almasi](https://unsplash.com/@flowforfrank) via
      [Unsplash](https://unsplash.com)
lastmod: 2024-03-10T04:16:42.000Z
type: blog
description: 'How to convert frontmatter in GoHugo between TOML, YAML and JSON.'
fmContentType: blog
---

Some days ago I realised, that I keep all my configurations for GoHugo in the TOML format, while using YAML for the frontmatters in my content folder. That did not seem right ;) so I changed those too to TOML.

Hugo has an easy command [`convert`](https://gohugo.io/commands/hugo_convert/), to transform frontmatter from one type to another.

```shell {lineAnchors=code1}
hugo convert toJSON
hugo convert toTOML
hugo convert toYAML
```

If Hugo detects any issues, it will decide to NOT transform the frontmatter. In that case you can force it to transform by adding the `--unsafe` option to the call:

```shell {lineAnchors=code2}
hugo convert toJSON --unsafe
hugo convert toTOML --unsafe
hugo convert toYAML --unsafe
```

After running this command your frontmatter will be in the new format. The only problem that I experienced was, that after converting from YAML to TOML all frontmatter items were in alphabetical order, which is nice, but might confuse us later on. I like my frontmatter sorted by topics.

Don't forget to change your archetypes too (there is no command for this, so you need to do it manually), so all future content too is in your new preferred format.
