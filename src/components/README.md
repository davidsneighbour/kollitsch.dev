# Components directory

This directory is organized by the primary responsibility of each component so that
the purpose of a file is immediately visible from its location.

## Top-level groups

- `content/` – pieces that render long-form content (articles, metadata, typography,
  media helpers, taxonomy blocks, and breadcrumb navigation).
- `layout/` – building blocks that make up the global shell such as the document
  head, navigation, footer, and branding utilities.
- `features/` – standalone functional additions that can be dropped into pages
  (search, comments, social sharing helpers, feed promotions, etc.).
- `pages/` – page-specific assemblies that only make sense within a particular
  route (home sections, release listings, and similar composites).
- `forms/` – reusable form fields and form related UI.
- `shared/` – low-level UI primitives like buttons and links that are reused
  across multiple groups.
- `devtools/` – development only utilities that assist during implementation.
- `seo/` – structured data helpers and related head metadata fragments.
- `support/fixtures/` – test fixtures and miscellaneous building blocks that do
  not belong to any of the functional buckets. Use this as a parking spot until a
  clearer category appears.

## Components to revisit

The following components still have sizeable TODOs or behavioural caveats and
should be reviewed during a future refactor:

- `content/article/Post.astro` – mixes content rendering, pagination, comments,
  and schema output; needs a decomposition plan.
- `content/metadata/PostMeta.astro` – accepts entire `post` objects and still
  delegates to several TODO-heavy subcomponents.
- `content/media/PostImage.astro` – embeds YouTube fallbacks and performs cover
  lookups; verify that all edge cases are still handled after the move.
- `features/feeds/FeedReader.astro` – bespoke promotional component with hard
  coded defaults that likely deserves its own feature module.
- `features/social/ShareToMastodon.astro` & `features/social/SocialLinks.astro`
  – social integrations that should be audited for consistency and localization.
