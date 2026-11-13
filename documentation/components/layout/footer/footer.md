---
title: Footer
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-11-13T00:00:00+07:00
---

Renders the site-wide footer as a terminal session: a neofetch-style `whoami` block, the introduction, the footer navigation, ranked social profiles, and one colophon strip, followed by the [`Colophon`](colophon.md) watermark.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/footer/Footer.astro` |
| Data | [`src/data/footernavigation.json`](../../../../src/data/footernavigation.json) (navigation links), [`src/data/setup.json`](../../../../src/data/setup.json) (`title`, `author`, `introduction`, `greetings`, `timezone`, and the `social` section) |
| Tests | [`src/components/layout/footer/Footer.test.ts`](../../../../src/components/layout/footer/Footer.test.ts), [`src/utils/greeting.pure.test.ts`](../../../../src/utils/greeting.pure.test.ts), [`src/utils/uptime.pure.test.ts`](../../../../src/utils/uptime.pure.test.ts), [`src/utils/introduction.pure.test.ts`](../../../../src/utils/introduction.pure.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import Footer from '@components/layout/footer/Footer.astro';
---

<Footer />
```

## Behaviour

- Every section starts with a prompt line (`patrick@koh-samui:~$ <command>`) set in JetBrains Mono. Each prompt is an `h3`; the `user@host` part is `aria-hidden`, and a screen-reader-only suffix gives the plain section name (for example `whoami: about Patrick Kollitsch`). Each section is labelled by its prompt through `aria-labelledby`.
- Below `xl` the sections stack in one column; from `xl` they split into two columns (7/5).
- `whoami` shows the author avatar (linked to `/connect/`, breaking out of the column to the left by one third of its width from 64rem up) beside a key-value table: name, alias, role, host, local time, uptime, stack, and garden (post count from the `blog` collection without drafts, tag count from `getTags()`). If the tag count fails, the tag link is left out.
- The local time is the current time in `setup.timezone`, written into `[data-footer-clock]` by the client script and updated every 15 seconds. Without JavaScript only the time zone name shows.
- `cat about.md` renders `setup.introduction` on the server with `renderIntroductionHtml()` (`src/utils/introduction.pure.ts`), so blank lines become separate paragraphs. The `{$greeting}` placeholder becomes an empty `<span data-greeting-slot>`. The client script fills it with a greeting from `setup.greetings`, chosen by the visitor's local hour with `pickGreeting()` (`src/utils/greeting.pure.ts`): 05-11 morning, 12-16 afternoon, 17-20 evening, 21-04 night.
- The client script runs on `astro:page-load`, so the greeting and clock also work after `ClientRouter` navigations. It reads the greetings from the footer's `data-greetings` attribute and does not bundle `setup.json` or `markdown-it`.
- `ls ~/` lists the top-level entries of `footernavigation.json` as lowercase directory names (`home/`, `posts/`, and so on). Child entries are not rendered.
- `ls ~/elsewhere` lists the networks with `show.footer`. Networks that also have `show.connect` are featured, one row each with icon, network id, and handle. The other networks render as icon-only links with the network label as `aria-label` and `profile.title` as `title`. They wrap with `text-wrap: balance`, so no icon is left alone on the last line. All links use `social.defaults.target` and `social.defaults.rel` merged with the network's `profile.rel`.
- The uptime row counts from the first published post (the earliest `date` in the `blog` collection, without drafts) in years, months, days, hours, minutes, and seconds, computed with `uptimeParts()` (`src/utils/uptime.pure.ts`) on the UTC calendar. The server renders `since <date>` (for example "since 21 October 2021"). The client script hides that text visually, keeps it for screen readers, and shows the `aria-hidden` counter. One timer, aligned to whole seconds, updates the counter and the clock. Changed digits roll in with the Web Animations API, only while the counter is on screen (`IntersectionObserver`) and the visitor allows motion.
- An `aria-hidden` final prompt ends with a blinking green bar cursor, aligned with the prompt text. The blink runs only under `prefers-reduced-motion: no-preference`.
- The colophon strip shows the copyright line with the current year, the version link, "Another production by" with the `Wordmark`, privacy and security policy links, RSS/Atom/JSON feed links, the `Static.Quest` web ring widget (previous, members, next, random), and the [People's Pledge](https://people.pledge.party/) badge (`PeoplePledgeBadge` at 40 px).
- The year is set on the server and corrected by an inline script to avoid stale build-time years. The same inline script fetches `/api/siteinfo.json` and, when a `version` and `releasePage` are present, appends a version link (`៚ vX.Y.Z`) after the site title. Failures are ignored.
- The badge and `Wordmark` use `--color-primary-700` in light mode and `--color-primary-600` in dark mode.
- Renders `<Colophon />` after the closing `</footer>` tag.

## Extending

To add or reorder navigation links, edit [`footernavigation.json`](../../../../src/data/footernavigation.json). To change the greeting text, edit `setup.greetings` in [`setup.json`](../../../../src/data/setup.json). To move a network between the featured list and the icon row, change its `show.connect` flag; see [Social media setup](../../../content/social-setup.md).
