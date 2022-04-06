---
title: Giscus Module for GoHugo
date: '2021-10-27T20:25:27+07:00'
description: ''
resources:
  - src: gerry-roarty-slkENpP5PbI-unsplash.jpg
    title: Photo by [Gerry Roarty](https://unsplash.com/@ger54321) via [Unsplash](https://unsplash.com)
tags:
  - gohugo
  - static websites
  - dnb-org
  - giscus
---

[Giscus](https://github.com/giscus/giscus) is a new star on the comment systems for static website generators orbit. It is inspired by the wonderful [utterances](https://github.com/utterance/utterances) and uses Github Discussions to save comments. It's open source, easily configurable, themeable, translatable, and you can [host it on your own server](https://github.com/giscus/giscus/blob/main/SELF-HOSTING.md) (it's JavaScript based) if you like. I tried it, but ran into problems setting it up, so this will be a topic for a later post.

In my opinion this tool is very useful for development websites or smaller developer blogs (like this one) because the discussion can be continued over at Github or on the website, whatever you or your visitors prefer. And... aren't comments discussions? They finally arrived where they belong (at least in Github based websites and projects).

You can see Giscus in action at the end of this post or any other post on this website. Feel free to test, but please try to add a useful comment :wink:

I created a [GoHugo](https://gohugo.io) module in [davidsneighbour/hugo-giscus](https://github.com/davidsneighbour/hugo-giscus/) that you can use easily to add Giscus to your website. The plan is to add the script as unobstrusive as possible to your website and add belated loading and easy design options to it. Just follow these steps to add it to your GoHugo website:

1. Go to [giscus.app/](https://giscus.app/) and fill out the form in the "Configuration" section. Copy the resulting code and paste into your scratch pad.

2. Add the component to your config.toml (or at the appropriate location in your configuration):

   ```toml
   [[module.imports]]
   path = "github.com/davidsneighbour/hugo-giscus"

   ```

3. Add your Giscus configuration to config.toml:

   ```toml
   [giscus]
   dataRepo = "username/reponame"
   dataRepoId = "repo id hash"
   dataCategory = "category"
   dataCategoryId = "category id hash"

   ```

4. Update your modules

   ```bash
   hugo mod get -u ./...
   ```

5. Add the giscus-partial to your single.html or any post layout you are using in your theme:

   ```gotemplate
   {{ with site.Params.giscus }}
     {{ partial "content/giscus.html" . }}
   {{ end }}
   ```

## Available Configuration Parameters

- **src**: (default `https://giscus.app/client.js`) - useful if you host your own version of Giscus
- **dataRepo**: (required, your-github-username/reponame)
- **dataRepoId**: (required)
- **dataCategory**: (required) it's recommended to create a category "Comments" before you start configuration, so all your comments are in the same dedicated category.
- **dataCategoryId**: (required)
- **dataMapping**: (default "title") set up if
- **dataReactionsEnabled**: (default "0")
- **dataEmitMetadata**: (default "0")
- **dataTheme**: (default "light")
- **dataLang**: (default "en") currently available are en, fr, id, pl, ro

## Coming soon

- loading the JS without impacting page performance
- add SASS files for theme creation via configuration
- if you have any ideas feel free to [open an issue](https://github.com/davidsneighbour/hugo-giscus/issues).
