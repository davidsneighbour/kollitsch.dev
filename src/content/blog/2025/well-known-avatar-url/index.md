---
title: .well-known avatar URL for kollitsch.dev
description: >-
  This post explains how I set up a .well-known/avatar URL on my site using
  Netlify, with caching headers and image placement, and plans for future
  improvements.
summary: >-
  A .well-known/avatar URL provides a standardized way to retrieve profile
  images. I implemented it on my site using Netlify, configuring caching headers
  and placing the image in static/.well-known/. Future updates may include
  support for different sizes, formats, and dynamic avatars for greater
  flexibility.
date: 2025-02-08T19:50:44+07:00
resources:
  - title: I'm just an avatar
    src: imkara-visual-3blY8iC2o5M-unsplash.jpg
tags:
  - internals
  - well-known
  - 100daystooffload
cover:
  src: ./imkara-visual-3blY8iC2o5M-unsplash.jpg
  type: image
publisher: rework
---

The idea of a well-known avatar URL has been floating around for a while, and it just makes sense. Instead of manually setting profile images across various services, a standardized `.well-known/avatar` endpoint provides a predictable way to retrieve a user's avatar.

Inspired by [Stefan Judis' post](https://www.stefanjudis.com/blog/a-well-known-avatar-url-would-be-dang-cool/) and [Jim Nielsen's take](https://blog.jim-nielsen.com/2023/well-known-avatar/), I decided to implement my own [here at /.well-known/avatar](https://kollitsch.dev/.well-known/avatar).

Since my site is hosted on Netlify, the setup was straightforward:

1. Configure HTTP Headers

   I added the following rules in my `netlify.toml` file to ensure the avatar is served with appropriate caching and media-type settings:

   ```toml
   [[headers]]
   for = "/.well-known/avatar"
   [headers.values]
   Cache-Control = "public, max-age=2419200"
   Content-Type = "image/jpeg"
   ```

   This sets the `Cache-Control` header to cache the image for **28 days (2,419,200 seconds)** and explicitly defines the `Content-Type` as `image/jpeg` (because, well, my images is a JPEG).

2. Placed the Image in the Correct Location

   I stored the avatar image in the `static/.well-known/avatar` directory **without a file extension**. This ensures a clean and simple URL structure.

This is just the beginning. In the future, I might expand this setup to support:

* Different image **sizes** (e.g., `/avatar?size=128`)
* Additional **formats** like WebP and PNG
* Possibly even a **redirect mechanism** for dynamic avatars

Of course, this depends on how the idea of a well-known avatar URL evolves.

For now, if you want to implement your own, it's as simple as setting up a `.well-known/avatar` endpoint and configuring your web server or hosting provider to serve it correctly.
