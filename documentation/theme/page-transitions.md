# Page, link, and preview-card transitions

Astro's `ClientRouter` (imported in `src/components/layout/head/Head.astro`) drives
cross-document view transitions between full page navigations. `src/layouts/Site.astro`
owns the surrounding lock and animation behaviour.

## Navigation lock

While a transition is in flight, the outgoing page is locked so stray clicks or
scroll input can't land mid-swap:

* `astro:before-preparation` adds the `astro-transitioning` class to `<html>` and
  `inert` to `<body>`.
* `astro:after-swap` and the `pageshow` event (bfcache restores) remove both.

`astro-transitioning` currently sets `cursor: wait` (see the "view transitions"
section of `src/styles/theme.css`); extend that rule for further lock styling.

## Blog preview-card transitions

Blog post preview cards morph into the full single-post article surface when a
visitor opens a post from the card title or the "Read more..." button. Both
ends share the CSS-safe transition name returned by
`getPostPreviewTransitionName(post.id)`:

* Card: `src/components/content/article/Preview.astro` (`<article>`)
* Post page: `src/components/content/article/Post.astro` (`<article>`)

The shared element uses `view-transition-class: post-preview` styling inside the
`prefers-reduced-motion: no-preference` media query in `src/styles/theme.css`: a
420ms strong ease-out morph with clipped overflow and the standard card radius.
The same pairing is used for browser back/forward navigation when Astro's
`ClientRouter` can match the originating preview card.

Because `transition:name` must be unique per rendered page, only apply the
shared preview transition to a post preview list where each post appears once.

## Reduced motion

`@view-transition { navigation: auto; }` is declared only inside
`prefers-reduced-motion: no-preference`, so native cross-document transitions
are opt-in only for visitors who allow motion. For visitors using
`prefers-reduced-motion: reduce`, `theme.css` removes the post-preview
`view-transition-name` and `view-transition-class`, and disables any remaining
view-transition animations (`::view-transition-group/old/new`) as a fallback.

## Link hover

All inline links (`src/styles/theme.css`, base `a` rule) already transition
color on hover/focus (`transition-colors duration-300 ease-in-out`); this is
the site-wide interactive-link motion and needs no per-component repetition.
