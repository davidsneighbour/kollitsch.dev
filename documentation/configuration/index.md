---
title: "Configuration"
date: 2023-12-08T15:39:40+07:00
weight: 100
---

## Pagefind configuration

per page:

```yaml
config:
  pagefind: false
```

to remove this specific page from the search index.

## Date setup for individual pages

This theme customizes how GoHugo handles date fields in the frontmatter. These changes override GoHugo's default behavior to provide more control over date metadata, including utilizing Git history timestamps (`:git`) when applicable.

### `date` configuration

```toml
date = ["date", "publishDate", "lastmod", ":git"]
# date = ['date', 'publishdate', 'pubdate', 'published', 'lastmod', 'modified']
```

Darkskies simplifies the `date` configuration by focusing on key frontmatter fields: `date`, `publishDate`, and `lastmod`, while using the Git commit date (`:git`) as a fallback. This ensures that the content date accurately reflects the creation, publication, or modification timeline, especially in environments where Git is used.

### `lastmod` configuration

```toml
lastmod = ["lastmod", ":git", "date", "publishDate"]
# lastmod = [':git', 'lastmod', 'modified', 'date', 'publishdate', 'pubdate', 'published']
```

Darkskies prioritizes the explicit `lastmod` field and uses the Git modification date (`:git`) as a secondary option. If neither is available, it falls back to the `date` and `publishDate` fields, ensuring that the last modification date is derived correctly.

### `publishDate` and `expiryDate` configuration

```toml
publishDate = [":default"]
# publishDate = ['publishdate', 'pubdate', 'published', 'date']
expiryDate = [":default"]
# expiryDate = ['expirydate', 'unpublishdate']
```

Nothing is changed on the default `expiryDate` and `expirydate` configuration.

### Summary of date configuration

To sum it up, the following frontmatter is required to add a proper date to your pages:

If `--enableGitInfo` is set or `enableGitInfo = true` is set in site configuration (which is the default in this theme), and no date frontmatter is set then the Git author date for the last revision of this content file is used as date.


Set the `date` or `publishDate` frontmatter, to override this. `lastmod` will also override this if no other front matter is set.

If GIT is not enabled the frontmatter is defined by `date`, or `publishDate`, or `lastmod` if they are set in this order of priority.

To change the way posts are ordered in list views set a `publishDate` front matter variable. Else `date` is used.

The `lastmod` front matter overrides the git date and all other frontmatter variables to show when a page was updated.

Long story short:

* No date field is required if you use the Git date
* Although adding a `date` field gives you an opportunity to fine-tune the date (and know the date without having to resort to `git` commands to find out when a page was published).
* To show a different date than the date that is used to sort pages on list overviews use `date` and `publishDate` frontmatter.
* To show that a page was substantially changed between publishing and now, use the `lastmod` field.
