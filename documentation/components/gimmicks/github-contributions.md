---
title: GitHubContributions
tags: []
created: 2026-08-08T00:00:00+07:00
updated: 2026-08-08T00:00:00+07:00
---

Renders a GitHub contribution-calendar gimmick that fetches the site's contribution data through a server-side API route and displays it as an accessible activity grid.

## File locations

| Field | Value |
| --- | --- |
| Component | [`src/components/gimmicks/GitHubContributions.astro`](../../../src/components/gimmicks/GitHubContributions.astro) |
| Data | [`src/pages/api/github-contributions.ts`](../../../src/pages/api/github-contributions.ts) |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `endpoint` | `string` | `"/api/github-contributions"` | API endpoint used by the browser script to request contribution-calendar data |
| `cacheHours` | `number` | `24` | Number of hours a successful response stays in `localStorage` before the component fetches fresh data |
| `class` | `string` | `undefined` | Additional CSS classes added to the root `<section>` |
| `heading` | `string` | `"Recent GitHub activity"` | Heading rendered above the contribution grid |

## Usage

```astro
---
import GitHubContributions from '@components/gimmicks/GitHubContributions.astro';
---

<GitHubContributions />
```

With all configurable props:

```astro
<GitHubContributions
  heading="GitHub activity"
  cacheHours={24}
  endpoint="/api/github-contributions"
  class="my-github-activity"
/>
```

## Behaviour

The component renders a heading, loading summary, horizontally scrollable calendar grid, hover/focus tooltip, and hidden error message. On page load the inline script initialises every `[data-github-contributions]` root on the page:

- Reads a cached response from `localStorage` using a versioned key based on the endpoint.
- Treats `cacheHours` as a time-to-live in hours, falling back to 24 when the value is missing, invalid, or less than or equal to zero.
- Fetches JSON from `endpoint` when no valid cached data exists.
- Renders one button per contribution day with `role="gridcell"` and an `aria-label` such as `3 contributions on 5 August 2026`.
- Uses GitHub's `contributionLevel` field to select one of five local design levels, while deliberately ignoring GitHub's own calendar colours.
- Shows the day label in a positioned tooltip on pointer hover and keyboard focus.
- Updates the live summary to the yearly total, or exposes the error message when the endpoint fails or returns invalid data.

The server endpoint is not prerendered:

```ts
export const prerender = false;
```

Astro therefore needs an on-demand rendering adapter, such as `@astrojs/netlify`, before this route can run on Netlify.

The endpoint reads `GITHUB_USERNAME` and `GITHUB_TOKEN` from server-side environment variables via `astro:env/server`, queries GitHub's GraphQL API for the previous 365 days, and returns only this public calendar shape to the browser:

```ts
{
  username: string;
  generatedAt: string;
  totalContributions: number;
  weeks: Array<{
    firstDay: string;
    contributionDays: Array<{
      contributionCount: number;
      contributionLevel: 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';
      date: string;
      weekday: number;
    }>;
  }>;
}
```

Configure these variables locally and in Netlify:

```dotenv
GITHUB_USERNAME=davidsneighbour
GITHUB_TOKEN=github_pat_...
```

The token must stay server-side; do not expose it with a `PUBLIC_` prefix. GitHub can include restricted or private contribution counts when the account has private contribution visibility enabled and the token has suitable access. The API response still contains only dates, counts, and contribution levels; it does not send repository names or other private details to the browser.

## Extending

Override the five activity-level variables in the component scope when the site design needs a different palette:

```css
.github-contributions {
  --github-activity-0: var(--your-empty-colour);
  --github-activity-1: var(--your-level-1-colour);
  --github-activity-2: var(--your-level-2-colour);
  --github-activity-3: var(--your-level-3-colour);
  --github-activity-4: var(--your-level-4-colour);
}
```

Keep the variables mapped to local design tokens rather than GitHub's returned colours so the calendar remains part of the site's own visual system.
