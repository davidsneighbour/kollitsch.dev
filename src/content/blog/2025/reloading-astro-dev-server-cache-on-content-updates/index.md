---
title: Reloading Astro dev server cache on content updates
description: How to automatically trigger full reloads in Astro's dev server when new files are added to your images or content directories.
tags:
  - astro
  - vite
  - development
  - automation
date: 2025-09-14T12:44:11.906Z
cover:
  src: ./getty-images-P6AC5E9pxlg-unsplash.jpg
  type: image
  alt: "A lonely astro-naut"
---

While working on an Astro project, I ran into a frustrating issue: adding a new image to `src/assets/images/` didn't result in a server reload, and the image was "missing" until I manually restarted the dev server.

This is because **Astro's dev server (powered by Vite)** by default doesn't watch for _new files_ in certain folders like `src/assets/` or `src/content/`.

This leads to a couple of inconvenient issues:

* New blog posts in `src/content/blog/` don't appear until the development server is restarted.
* New images in `src/assets/images/` throw 404 errors until the development server is restarted.

I fixed that by watching these folders explicitly and triggering a full server reload whenever new files are added or removed.

My solution is a small Vite plugin in `astro.config.js` that watches these directories and triggers a **full reload** when files are added or removed.

## Add the plugin to your Astro config

I kept it simple and defined the plugin inline in `astro.config.mjs` ([see my implementation here](https://github.com/davidsneighbour/kollitsch.dev/blob/4a9d189187ebab5fb5f30a131bd90bec3e214cb9/astro.config.js#L23)):

```ts
import { defineConfig } from 'astro/config'; // you probably already have this
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const watchExtraFiles = () => ({
  configureServer(server) {
    console.log('[watch-extra-files] Plugin loaded');

    const reload = (file) => {
      console.log(`[watch-extra-files] Reload triggered due to: ${file}`);
      server.ws.send({ type: 'full-reload' });
    };

    const watchPaths = [
      path.resolve(__dirname, 'src/assets/images'),
      path.resolve(__dirname, 'src/content/blog'),
    ];

    server.watcher.add(watchPaths);
    console.log('[watch-extra-files] Watching paths:', watchPaths);

    server.watcher.on('add', reload);
    server.watcher.on('unlink', reload);
  },
  name: 'watch-extra-files',
});

export default defineConfig({
  vite: {
    plugins: [
      watchExtraFiles(),
    ],
  },
});
```

## The result

Now, when we run:

```bash
npx astro dev
```

We'll see output like:

```
[watch-extra-files] Plugin loaded
[watch-extra-files] added: /path/to/src/assets/images/new-logo.png
[watch-extra-files] deleted: /path/to/src/content/blog/old-post.md
```

The browser will reload instantly with the added content available.

If you want to go further, you could extend this to watch other folders, debounce reloads, or even trigger full server restarts via CLI automation.

For now, that’s one less thing to worry about.
