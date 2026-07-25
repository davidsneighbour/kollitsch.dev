---
applyTo: "src/content/blog/**,src/assets/images/postimages/**"
---

# Post cover image convention

## Directory and naming

All post cover images live in **`src/assets/images/postimages/`**.

Name pattern: `postimage-for-{slug}.{ext}`

* `{slug}` is the URL slug of the post—the last path segment of the post's directory name (for example `the-fungus-that-thrives-on-radiation`)
* `{ext}` is the original file extension, unchanged (`.jpg`, `.png`, `.gif`, `.webp`, …)
* Keep the original format; do not convert at source

Examples:

```text
src/assets/images/postimages/postimage-for-the-fungus-that-thrives-on-radiation.jpg
src/assets/images/postimages/postimage-for-kollitsch-dev-header-animation.gif
src/assets/images/postimages/postimage-for-writing-the-perfect-bug-report.jpg
```

## Series and shared images

When the same image is intentionally shared across a series of posts, name it after the series rather than a single post slug:

```text
postimage-for-kurzschnitte-series.jpg
postimage-for-pizening-series.jpg
```

All posts in the series reference the same file.

## Frontmatter reference

```yaml
cover:
  src: "postimages/postimage-for-{slug}.jpg"
```

The image resolver looks up `src/assets/images/postimages/{filename}` automatically—no path prefix beyond `postimages/` is needed.

## When the right name is not obvious

If the slug is ambiguous (for example, a post about a general topic where the slug won't be a stable identifier, or a GIF alongside a JPG for the same post), **ask the user** what name to use before renaming or creating the file. Do not guess.

Prompt: *"What should this image be named in postimages/? The post slug is `{slug}` — does `postimage-for-{slug}.{ext}` work, or would you prefer a different name?"*

## Applying the convention

**New posts:** create the image in `src/assets/images/postimages/` with the correct name from the start. Set `cover.src` in the frontmatter to `postimages/postimage-for-{slug}.ext`.

**Edited posts:** if you touch the frontmatter or content of an existing post and its cover image is not yet following this convention (co-located in the post folder, named after the photographer, etc.), migrate it as part of the same edit:

1. Copy or move the image to `src/assets/images/postimages/postimage-for-{slug}.ext`
2. Update `cover.src` in the frontmatter
3. Delete the old image file if it was co-located and is no longer referenced elsewhere
