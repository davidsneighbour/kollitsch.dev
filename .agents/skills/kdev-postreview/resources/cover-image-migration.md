# Migrate post cover image

Migrate the cover image of one or more blog posts to the `src/assets/images/postimages/` convention.

## Target convention

* Image file lives at `src/assets/images/postimages/postimage-for-{slug}.{ext}`
* Frontmatter uses `cover.src: "postimages/postimage-for-{slug}.{ext}"`
* `{slug}` is the post's directory name, meaning the last path segment under `src/content/blog/{year}/`

## Per-post questionnaire

For each post being migrated, gather the following before making changes.

### 1. Identify the post

Determine:

* post path: `src/content/blog/{year}/{slug}/index.md` or `.mdx`
* post slug: `{slug}`
* current `cover.src` value

Confirm these values by inspecting the repository. Do not infer the slug from the title.

### 2. Locate the current image

Determine whether the image is:

* **co-located** — in the post directory
* **global** — in `src/assets/images/` or a subdirectory
* **missing** — the referenced file cannot be found
* **external** — the value references a remote resource
* **ambiguous** — several possible files match

Verify the actual file path and extension.

Do not proceed with a missing, external, or ambiguous source without reporting it.

### 3. Check for sharing

Search for the current image filename across all posts:

```bash
grep -r "{current-filename}" src/content/blog/ \
  --include="*.md" \
  --include="*.mdx" \
  -l
```

Interpret the result:

* **Used by one post only**
  Propose `postimage-for-{slug}.{ext}`.

* **Used by multiple posts in the same series**
  Report the posts and ask whether to:

  * use a series-level descriptive filename
  * create an individual copy for each post

* **Used by unrelated posts**
  Report the posts and ask whether to:

  * create separately named copies
  * retain a shared descriptively named image

Check references by resolved path where possible. A filename-only search may produce false positives when separate directories contain files with the same name.

### 4. Confirm the destination filename

Default proposal:

```text
postimage-for-{slug}.{ext}
```

Require an explicit decision when:

* the slug exceeds 60 characters
* several cover-image candidates exist
* both animated and static variants exist
* the source and referenced extensions differ
* the proposed destination already exists
* the image is shared
* the filename would conflict with repository conventions

When the destination already exists, compare the files before deciding whether they are duplicates or a collision.

### 5. Execute the migration

After the destination is established:

1. Create the destination directory when absent:

   ```bash
   mkdir -p src/assets/images/postimages/
   ```

2. Determine the appropriate file operation:

   * co-located and unshared: move
   * global and unshared: move
   * shared: copy
   * ownership uncertain: copy unless the user explicitly approves moving
   * destination already contains the identical file: reuse it

3. Preserve the actual extension unless an intentional conversion is separately performed.

4. Update frontmatter:

   ```yaml
   cover:
     src: "postimages/postimage-for-{slug}.{ext}"
   ```

   Preserve all other `cover` properties.

5. Verify the destination file exists before deleting any source.

6. Verify the frontmatter reference resolves correctly according to repository image-loading behaviour.

## Safe file handling

Before moving or deleting an image:

* check whether it is tracked by Git
* check all repository references
* check whether generated files or scripts reference it
* avoid overwriting an existing non-identical file
* inspect case-sensitive filename differences
* preserve file contents exactly unless conversion was requested

Use `git mv` for tracked, unshared files when appropriate.

## 6. Cleanup check

Search the repository for the original filename:

```bash
grep -r "{old-filename}" src/ \
  --include="*.md" \
  --include="*.mdx" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.mjs" \
  --include="*.astro" \
  -l
```

Also inspect other relevant file types used by the repository.

Delete the original only when:

* the destination exists
* the updated post resolves to the destination
* no required references remain
* the image is not intentionally shared
* the deletion is contained within the requested migration

## Validation

After migration:

1. inspect the post frontmatter
2. verify the destination file
3. search for obsolete references
4. inspect `git diff --stat`
5. inspect the complete diff for the post
6. run the repository's relevant content and image checks

Do not rely on `ls` as the only validation.

## Batch mode

When migrating multiple posts:

1. process each post independently
2. detect sharing across the complete batch before moving files
3. defer deletion of shared originals until all relevant posts are processed
4. avoid asking the same series-level question repeatedly
5. provide a summary table

| Post slug                              | Old image                                                 | New image                                                | Action                    |
| -------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------- | ------------------------- |
| `the-fungus-that-thrives-on-radiation` | `Fungi-Chernobyl-Cladosporium-sphaerospermum-Medmyco.jpg` | `postimage-for-the-fungus-that-thrives-on-radiation.jpg` | moved                     |
| `kurzschnitte-ii-11`                   | `kurzschnitte.jpg`                                        | `postimage-for-kurzschnitte-series.jpg`                  | copied; original retained |

## Done signal

After all migrations in the session:

```bash
ls -la src/assets/images/postimages/
```

Confirm:

* every expected destination exists
* every updated post points to the correct destination
* no original was deleted while still referenced
* relevant repository checks pass
