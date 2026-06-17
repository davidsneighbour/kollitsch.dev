---
agent: agent
description: Migrate a blog post's cover image to the postimages/ convention. Run for one post at a time or a batch of posts.
---

# Migrate post cover image

Migrate the cover image of one or more blog posts to the `src/assets/images/postimages/` convention.

## Target convention

* Image file lives at `src/assets/images/postimages/postimage-for-{slug}.{ext}`
* Frontmatter uses `cover.src: "postimages/postimage-for-{slug}.ext"`
* `{slug}` = the post's directory name (last path segment under `src/content/blog/{year}/`)

## Per-post questionnaire

For each post being migrated, gather the following before making any changes.

### 1. Identify the post

* Post path: `src/content/blog/{year}/{slug}/index.md` (or `.mdx`)
* Post slug (directory name): `{slug}`
* Current `cover.src` value in frontmatter

### 2. Locate the current image

Determine where the image currently lives:

* **Co-located**—in the same folder as the post (`src/content/blog/{year}/{slug}/`)
* **Global**—already in `src/assets/images/` (or a subfolder)

Check if the image file exists at the referenced path.

### 3. Check for sharing

Search for the current image filename across all posts in `src/content/blog/`:

```bash
grep -r "{current-filename}" src/content/blog/ --include="*.md" --include="*.mdx" -l
```

* **Used by one post only** → name it `postimage-for-{slug}.{ext}`
* **Used by multiple posts in the same series** → ask: *"This image is shared by {list of posts}. Should it be named after the series (for example `postimage-for-{series}-series.{ext}`) or should each post get its own copy?"*
* **Used by unrelated posts** → ask: *"This image is shared by unrelated posts ({list}). Should each post get its own renamed copy, or keep sharing under a descriptive name?"*

### 4. Confirm the new filename

Propose: `postimage-for-{slug}.{ext}`

**Ask if any of these apply:**

* The slug is very long (> 60 chars)—*"The slug is long. Would you prefer a shorter name?"*
* There are multiple cover images for the same post (for example a `.gif` and a `.jpg`)—*"There are two images for this post. Which is the primary cover? Should both be migrated?"*
* The extension will change (for example the post currently references a `.jpeg` but the file is `.jpg`)—flag it

Wait for confirmation before proceeding.

### 5. Execute the migration

Once the filename is confirmed:

1. **Create `src/assets/images/postimages/`** if it does not exist yet
2. **Copy or move** the image:
   * If co-located and not shared: move (delete original)
   * If in global images and not shared: move (delete original)
   * If shared: copy (leave original in place until all referencing posts are migrated)
3. **Update frontmatter** `cover.src` to `postimages/{new-filename}.{ext}`
4. **Verify** the file exists at the new path before committing

### 6. Cleanup check

After migrating, check whether the original image file is still referenced anywhere:

```bash
grep -r "{old-filename}" src/ --include="*.md" --include="*.mdx" --include="*.ts" --include="*.astro" -l
```

If no references remain, delete it.

## Batch mode

When migrating multiple posts at once, run the questionnaire for each post sequentially. Present a summary table at the end:

| Post slug | Old image | New image | Action |
| --------- | --------- | --------- | ------ |
| `the-fungus-that-thrives-on-radiation` | `Fungi-Chernobyl-Cladosporium-sphaerospermum-Medmyco.jpg` (co-located) | `postimage-for-the-fungus-that-thrives-on-radiation.jpg` | moved |
| `kurzschnitte-ii-11` | `kurzschnitte.jpg` (global, shared) | `postimage-for-kurzschnitte-series.jpg` | copied, original kept |

## Done signal

After all migrations in a session are complete, run:

```bash
ls src/assets/images/postimages/
```

and confirm the expected files are present.
