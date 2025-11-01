# `content-object` utility usage

The `src/utils/content-object.ts` module provides helpers for turning assorted
content sources (Astro collection entries, Markdown frontmatter objects, API
responses, …) into a normalized `ContentObject`. Use it whenever you need a
consistent structure for rendering article cards, detail pages, RSS feeds, or
other content surfaces.

## Imported types

```ts
import { createContentObject, createEmptyContentObject } from '@/utils/content-object';
import type { ContentObject } from '@/utils/content-object';
```

## `ContentObject`

`ContentObject` is a plain data structure with the following shape:

- Identity: `id`, `slug`, `collection`
- Text fields: `title`, `description`, `summary`, `content`, `excerpt`
- Dates: `date`, `updated`
- Metadata: `author`, `tags`, `category`, `cover`, `url`, `readingTime`
- Storage for anything else: `meta`

All fields default to `null` (or an empty array/object where appropriate). The
utility keeps the field values lenient so that UI layers can display empty-state
messages or fall back to defaults.

## Creating a blank instance

```ts
const blank = createEmptyContentObject();
```

Use this when you need a fresh object to populate manually. The helper ensures
`tags` is a new array and `meta` is a shallow copy so that mutations do not leak
across instances.

## Normalizing content

`createContentObject(...sources)` accepts any combination of:

- Astro `CollectionEntry` objects (from `astro:content`)
- Plain objects returned from APIs or local data files
- Objects with `frontmatter`, `data`, or `meta` properties (for example a
  Markdown page)

The function merges the sources in the order given, with later sources
overriding earlier values. It performs several normalization steps:

- Recognizes common field aliases (for example `name`, `heading`, or `label`
  become `title`).
- Trims strings and drops empty values.
- Converts ISO strings, timestamps, or `Date` objects into `Date` instances for
  `date` and `updated`.
- Expands author information from strings, arrays, or objects with `name` /
  `fullName` fields.
- Flattens comma-separated tag strings or arrays into a unique, trimmed list.
- Accepts `cover` values as strings, `CoverData` objects, records, or `null`.
- Collects any additional fields into the `meta` bag so the original data is not
  lost.

### Example: Astro collection entry

```ts
import { getCollection } from 'astro:content';
import { createContentObject } from '@/utils/content-object';

const entries = await getCollection('blog');
const posts = entries.map((entry) => createContentObject(entry));
```

Each post now exposes normalized properties (`post.title`, `post.cover`, etc.)
ready for consumption in Astro components.

### Example: Combining multiple sources

```ts
const cmsData = await fetchJson('/api/post/hello-world');
const fallbackMeta = { tags: ['Announcements'] };

const post = createContentObject(cmsData, fallbackMeta);

console.log(post.meta.originalSlug); // extra fields stay in `meta`
```

You can mix and match as many sources as needed. `createContentObject` skips any
`null` or `undefined` inputs, so optional data is easy to include.

## Tips

- Call `createContentObject` as late as possible—ideally right before rendering
  or serializing data—so you always operate on the most complete view of the
  content.
- Use the `meta` property to access fields that are not part of the normalized
  set without losing the original information.
- When you need only lightweight information (for example listing titles), you
  can still use the utility and ignore the richer fields; they will remain `null`
  until populated.
