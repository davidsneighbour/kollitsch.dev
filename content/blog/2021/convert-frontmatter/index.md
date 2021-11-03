+++
title = "Converting frontmatter in GoHugo"
date = 2021-11-02T22:49:49+07:00

[[resources]]
title = "Photo by [Ave Calvar](https://unsplash.com/@shotbyrain) via [Unsplash](https://unsplash.com/s/photos/horizon)"
name = "image name if other than src"
src = "ave-calvar-HcUDHJfd5GY-unsplash.jpg"

# taxonomification
categories = [
  "category1"
]
tags = [
  "tag1", 
  "tag2"
]
keywords = [
  "keyword1", 
  "keyword2"
]
+++

Hugo has an easy command, to transform frontmatter from one type to another. 

```bash
hugo convert toJSON
hugo convert toTOML
hugo convert toYAML
```


If Hugo detects any issues, it will decide to NOT transform the frontmatter. In that case you can force it to transform by adding the `--unsafe` option to the call:

```bash

hugo convert toJSON --unsafe
hugo convert toTOML --unsafe
hugo convert toYAML --unsafe
```
