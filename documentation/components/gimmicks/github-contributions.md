---
title: GitHubContributions
tags: []
created: 2026-11-14T12:00:00+07:00
updated: 2026-11-14T12:00:00+07:00
---

The contribution calendar shows recent GitHub activity as a progressive enhancement in the footer.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/gimmicks/GitHubContributions.astro` |
| Data | `src/github-contributions.ts`, `src/components/gimmicks/github-contributions.ts` |
| Tests | `src/github-contributions.test.ts`, `src/components/gimmicks/GitHubContributions.test.ts` |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `heading` | `string` | `Recent GitHub activity` | Section accessible name and default heading |
| `cacheHours` | `number` | `24` | Cache lifetime in hours, with a minimum of 24 |
| `endpoint` | `string` | `/api/github-contributions` | Same-origin endpoint |
| `class` | `string` | `undefined` | Extra root classes |

## Usage

```astro
---
import GitHubContributions from '@components/gimmicks/GitHubContributions.astro';
---
<GitHubContributions />
```

```astro
<GitHubContributions heading="GitHub activity" cacheHours={48} endpoint="/api/github-contributions" class="xl:col-span-12" />
```

The optional `heading` slot replaces the visible heading while the `heading` prop keeps the section labelled. The footer supplies its standard shell prompt with a screen-reader-only "GitHub activity" name.

## Behaviour

The footer places this component below both columns, spanning the terminal grid. A `gh api graphql` prompt replaces the display heading. This label follows the footer shell-session design; it is not an interactive command. Output uses JetBrains Mono, with muted summary and month labels in both themes. An intersection observer starts loading near the viewport. The annual total remains accessible to all visitors. The day grid is a decorative, `aria-hidden` illustration with inert cells, no tab stops, and no per-day interaction. Month labels use British English and UTC dates. The grid scrolls horizontally on small screens. An 8px inline gutter keeps the calendar within its existing layout. Local CSS activity variables map semantic levels to the design palette.

The calendar reserves its month row, seven day rows, gaps, and vertical padding in CSS before JavaScript runs. An invisible, assistive-technology-hidden error-message copy reserves the summary height at each width. Loading, success, and error keep the same geometry, so the links below do not move when the request completes.

The root reports its loading state with `aria-busy`, and the summary uses a polite live region. A failed request shows a short error message. Without JavaScript, a message explains how to view the calendar.

The versioned, endpoint-specific `localStorage` cache stores validated data and its save time. Valid entries prevent requests for 24 hours by default; longer lifetimes are supported. Expired, malformed, future-dated, and invalid entries are removed. Storage restrictions or quota failures do not prevent rendering. Browsers can clear or evict local storage, so retention cannot be guaranteed. Successful endpoint responses also send `Cache-Control: public, max-age=86400, s-maxage=86400`; errors use `no-store`.

The Cloudflare Worker serves `/api/github-contributions` with GET only. Set `GITHUB_USERNAME=davidsneighbour` and a suitable `GITHUB_TOKEN` as Worker bindings in Cloudflare. For local Worker testing, put the same variables in a gitignored `.dev.vars` file and run Wrangler on an allowed preview port, such as `npx wrangler dev --port 4400`. Static Astro development alone does not serve the Worker endpoint. Never prefix the token with `PUBLIC_`. No Netlify adapter or dependency is needed.

The Worker queries the previous 365 days through GitHub GraphQL and explicitly projects the response to `username`, `generatedAt`, `totalContributions`, and `weeks`. Each week contains `firstDay` and `contributionDays`; each day contains only `contributionCount`, `contributionLevel`, `date`, and `weekday`. It does not return repository names, commit messages, upstream errors, or credentials. Private contribution counts depend on the account's visibility settings and token access. These counts become public through this endpoint; private repository details do not.
