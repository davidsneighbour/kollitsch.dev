---
title: Url shortening service using a static website on Netlify
description: >-
  Learn how to set up a link redirection service on Netlify in minutes. Utilize
  simple steps to manage redirects effortlessly and enhance your project URLs'
  accessibility.
date: '2024-02-14T20:04:51+07:00'
resources:
  - src: header.jpg
    copyright: unsplash-plus
tags:
  - netlify
  - linkshortening
  - networking
  - 100DaysToOffload
fmContentType: blog
cover: header.jpg
---

This is a quick and practical proof of concept of a "free" link redirection service, hosted on [Netlify](https://www.netlify.com/). I am using one of my domains to redirect to various URLs, to my own projects. The setup is simple and can be done in a matter of minutes.

**Step 1**: add your redirects in [`quicklinks/_redirects`](https://github.com/davidsneighbour/namespace/blob/main/quicklinks/_redirects). The accepted format is [documented at Netlify](https://docs.netlify.com/routing/redirects/#syntax-for-the-redirects-file). For more complicated cases add your rules to `netlify.toml`.

For example:

```ini
# general links

/             https://github.com/davidsneighbour/hugo-modules/
/log          https://github.com/davidsneighbour/namespace/blob/main/hugo/logging-system.md
```

**Step 2**: create a [`netlify.toml`](https://github.com/davidsneighbour/namespace/blob/main/netlify.toml) that defines the folder `quicklinks` to be deployed as live site.

```toml
[build]
publish = "quicklinks/"
```

**Step 3**: add your repository to your Netlify organisation and deploy.

**Step 4**: add a custom domain or make your Netlify sub-domain look nice by renaming it to something other than `very-random-string.netlify.app` under "Site Configuration" > "Change site name".

Then use your redirects.

I connected my tool-domain `dnbhub.xyz` to a quick setup of URLs for my projects and you can test it by any arbitrary redirection from this [setup file](https://github.com/davidsneighbour/namespace/blob/main/quicklinks/_redirects) (I admit it's not widely used yet). For example [`https://dnbhub.xyz`](https://dnbhub.xyz) sends you right to my [GoHugo module repository](https://github.com/davidsneighbour/hugo-modules/#readme) and [`https://dnbhub.xyz/hooks`](https://dnbhub.xyz/hooks) sends you to [the landing page for my hooks module](https://github.com/davidsneighbour/hugo-modules/tree/main/modules/hooks#readme).

The initial advantage of having shorter URLs is topped by your ability to change endpoints by just re-deploying a new version of your site instead of having to go through all places where you mentioned this URL. This is a great way to have a "free" URL shortening service for your own projects.
