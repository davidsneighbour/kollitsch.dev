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
| `heading` | `string` | `Recent GitHub activity` | Section heading |
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

## Behaviour

The footer places this component below both columns, spanning the terminal grid. An intersection observer starts loading near the viewport. Each day is a keyboard-focusable button with its date and count. Hover and focus show the same text tooltip; leave, blur, and Escape hide it. Month labels use British English and UTC dates. The grid scrolls horizontally on small screens. Local CSS activity variables map semantic levels to the design palette, and reduced motion disables day scaling.

The root reports its loading state with `aria-busy`, and the summary uses a polite live region. A failed request shows a short error message. Without JavaScript, a message explains how to view the calendar.

The versioned, endpoint-specific `localStorage` cache stores validated data and its save time. Valid entries prevent requests for 24 hours by default; longer lifetimes are supported. Expired, malformed, future-dated, and invalid entries are removed. Storage restrictions or quota failures do not prevent rendering. Browsers can clear or evict local storage, so retention cannot be guaranteed. Successful endpoint responses also send `Cache-Control: public, max-age=86400, s-maxage=86400`; errors use `no-store`.

The Cloudflare Worker serves `/api/github-contributions` with GET only. Set `GITHUB_USERNAME=davidsneighbour` and a suitable `GITHUB_TOKEN` as Worker bindings in Cloudflare. For local Worker testing, put the same variables in a gitignored `.dev.vars` file and run Wrangler on an allowed preview port, such as `npx wrangler dev --port 4400`. Static Astro development alone does not serve the Worker endpoint. Never prefix the token with `PUBLIC_`. No Netlify adapter or dependency is needed.

The Worker queries the previous 365 days through GitHub GraphQL and explicitly projects the response to `username`, `generatedAt`, `totalContributions`, and `weeks`. Each week contains `firstDay` and `contributionDays`; each day contains only `contributionCount`, `contributionLevel`, `date`, and `weekday`. It does not return repository names, commit messages, upstream errors, or credentials. Private contribution counts depend on the account's visibility settings and token access. These counts become public through this endpoint; private repository details do not.
