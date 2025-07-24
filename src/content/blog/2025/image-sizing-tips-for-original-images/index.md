---
title: Image Sizing Tips for Original Sources
description: file size and resolution guidelines for source images in web projects
draft: true
date: 2025-07-22T11:14:58.521Z
tags: []
cover:
  src: ""
  title: ""
publisher: rework
---

## Recommended maximum image size for source files

**Max dimensions: `3840 × 2160 px` (4K UHD)**
**Reasoning:**

* 4K is becoming the **upper-end baseline** for large screens (TVs, high-res monitors).
* It allows cropping/resizing for all current web use cases (hero images, fullscreen sections, retina displays).
* It avoids overkill (e.g., 8K or RAW sizes) that bloat your Git repository without practical gain.

## Why not go bigger?

* **Human perception on websites** rarely benefits from resolutions > 4K.
* Larger sizes drastically increase file sizes (especially for PNG or uncompressed JPEG).
* Git repos are not ideal for versioning huge binaries - use Git LFS if necessary, but better: **optimize the originals**.

## Tips for managing source images

* Keep source images at `3840px` width max (and scale height accordingly).
* Store optimized lossless originals (e.g., high-quality JPEG or WebP) - avoid TIFF/RAW unless versioned elsewhere.
* Use image pipelines (e.g., [Sharp](https://sharp.pixelplumbing.com/) or `astro:assets`) to:
  * Auto-generate sizes (e.g., 320/640/1280/1920/2400px)
  * Optimize formats (WebP/AVIF for output)
* Tag images with original resolution in metadata or filenames (helps later auditing).

## TL;DR

> Use **3840px width** as your maximum source image size. It covers all current and near-future display needs, is reuse-friendly, and keeps your repo lean.
