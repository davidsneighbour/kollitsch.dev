---
title: Footer
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-11-13T22:30:00+07:00
---

Renders the site-wide footer as a terminal window, announced by a "we have a footer" sticker note. The window holds a terminal session: a neofetch-style `whoami` block, the introduction, the author's own uptime, the footer navigation, ranked social profiles, and below the window one colophon strip, followed by the [`Colophon`](colophon.md) watermark.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/footer/Footer.astro` |
| Data | [`src/data/footernavigation.json`](../../../../src/data/footernavigation.json) (navigation links), [`src/data/setup.json`](../../../../src/data/setup.json) (`title`, `author` including `born` and `bornTimezone`, `introduction`, `greetings`, `credits`, `timezone`, and the `social` section) |
| Tests | [`src/components/layout/footer/Footer.test.ts`](../../../../src/components/layout/footer/Footer.test.ts), [`src/utils/greeting.pure.test.ts`](../../../../src/utils/greeting.pure.test.ts), [`src/utils/uptime.pure.test.ts`](../../../../src/utils/uptime.pure.test.ts), [`src/utils/introduction.pure.test.ts`](../../../../src/utils/introduction.pure.test.ts), [`src/utils/social.pure.test.ts`](../../../../src/utils/social.pure.test.ts), [`src/utils/footer-mark.pure.test.ts`](../../../../src/utils/footer-mark.pure.test.ts) |

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

- The existing portrait has independent cursor-following pupil sprites. The original image remains the accessible, static fallback. A blank-eye overlay and original pupil crops appear only while the portrait is visible and reduced motion is off. Movement is bounded to each eye, scales with the image, and uses event-driven animation frames. Touch follows while pressed without blocking scrolling and resets on release. Pointer exit, cancellation, window blur, and visibility changes reset the gaze. Listeners and observers are released before Astro page swaps and initialised again on page load. Geometry is tested in `src/components/layout/footer/FooterEyes.test.ts`.

- The footer starts with a decorative, `aria-hidden` sticker note above the window: "Hey look, we have a footer!!!!111One" with a `lucide:corner-right-down` arrow. Its resting state is visible (`data-footer-mark="shown"`), so it shows without JavaScript. On `astro:page-load` the client script calls `footerMarkInitialState()` (`src/utils/footer-mark.pure.ts`). When motion is allowed, `IntersectionObserver` exists, and the window is still below the viewport, the script sets `data-footer-mark="pending"`, which hides the note. When the window's top edge is 15% above the viewport bottom, the script sets it back to `shown` and the CSS transition runs once. Otherwise the note shows at once.
- The terminal sections sit in a terminal window (`[data-footer-window]`): a transparent section with `rounded-lg`, no outer border or ring, and no decorative title bar. The colophon strip stays outside the window, below it.
- Every section starts with a prompt line (`patrick@dnb:~$ <command>`) set in JetBrains Mono. Each prompt is an `h3`; the `user@host` part is `aria-hidden`, and a screen-reader-only suffix gives the plain section name (for example `whoami: about Patrick Kollitsch`). Each section is labelled by its prompt through `aria-labelledby`.
- Below `xl` the sections stack in one column; from `xl` they split into two columns (7/5). The left column holds `whoami` and `cat about.md`; the right column holds `uname -r && uptime`, `ls ~/`, and `ls ~/elsewhere`, so both columns end at about the same height.
- `whoami` shows the author avatar (linked to `/connect/`, with its flat left side flush on the left edge of the window) beside a key-value table: name, alias, role, host, local time, online, stack, and garden (post count from the `blog` collection without drafts, tag count from `getTags()`). If the tag count fails, the tag link is left out.
- The local time is the current time in `setup.timezone`, written into `[data-footer-clock]` by the client script and updated every 15 seconds. Without JavaScript only the time zone name shows.
- `cat about.md` renders `setup.introduction` on the server with `renderIntroductionHtml()` (`src/utils/introduction.pure.ts`), so blank lines become separate paragraphs. The `{$greeting}` placeholder becomes an empty `<span data-greeting-slot>`. The client script fills it with a greeting from `setup.greetings`, chosen by the visitor's local hour with `pickGreeting()` (`src/utils/greeting.pure.ts`): 05-11 morning, 12-16 afternoon, 17-20 evening, 21-04 night.
- The client script runs on `astro:page-load`, so the greeting and clock also work after `ClientRouter` navigations. It reads the greetings from the footer's `data-greetings` attribute and does not bundle `setup.json` or `markdown-it`.
- `ls ~/` lists the top-level entries of `footernavigation.json` as lowercase directory names (`home/`, `posts/`, and so on). Child entries are not rendered.
- `ls ~/elsewhere` lists the networks with `show.footer`. Networks that also have `show.connect` are featured, one row each with icon, network id, and handle. When the visitor hovers or keyboard-focuses a featured row, only its icon takes the network's brand colour. `networkHoverColour()` (`src/utils/social.pure.ts`) reads the colour from `classes.fill` and the link gets it as `--footer-network-colour` and `--footer-network-colour-dark`; a black brand colour becomes white in dark mode. The other networks render as icon-only links with the network label as `aria-label` and `profile.title` as `title`. Their icons take the `classes.fill` hover colour when the pointer is on the icon. These classes apply directly, so an icon-only network with a black brand colour must also have `dark:hover:text-[#ffffff]`, or its icon disappears on the dark footer. The Instagram icon uses `hover:fill-[url(#instagram-gradient)_#FF0069]`: the footer renders a hidden, zero-size `<svg>` with the `instagram-gradient` radial gradient, and `#FF0069` is the fallback when the gradient is missing. They wrap with `text-wrap: balance`, so no icon is left alone on the last line. All links use `social.defaults.target` and `social.defaults.rel` merged with the network's `profile.rel`.
- The `online` row counts from the first published post (the earliest `date` in the `blog` collection, without drafts) in years, months, days, hours, minutes, and seconds, computed with `uptimeParts()` (`src/utils/uptime.pure.ts`) on the UTC calendar. The server renders `since <date>` (for example "since 21 October 2021"). The client script hides that text visually, keeps it for screen readers, and shows the `aria-hidden` counter. One timer, aligned to whole seconds, updates the counter and the clock. Changed digits roll in with the Web Animations API, only while the counter is on screen (`IntersectionObserver`) and the visitor allows motion.
- `uname -r && uptime` shows the author's age from `setup.author.born` (`1975-07-05T05:25:00+01:00`) with three rows. `kernel` is the age as a version number (years.months.days, for example `51.4.8-samui`, from `ageVersion()`). `boot` is the birth date and time in `setup.author.bornTimezone`, with the zone abbreviation (`5 July 1975, 05:25 CET`). `uptime` counts whole days and the time of the current day (`18,759 days, 08:49:39`, from `dayClock()`), and a muted comment line names the next multiple of 1,000 days in `setup.timezone` (`# next: day 19,000, 12 July 2027`, or `# today: day 19,000` on the day, from `nextDayMilestone()` and `formatDayMilestone()`). The day count follows the author's decimal birthdays from the 2022 post "Just another New Year". The server renders all values at build time. The client script corrects the kernel version and the comment line every second, shows the `aria-hidden` rolling counter, and keeps a plain `<n> days` text for screen readers that it sets once per page load.
- Both counters share the timer, the `IntersectionObserver`, and the digit roll. Each counter rolls only while it is on screen.
- An `aria-hidden` final prompt ends with a blinking green bar cursor, aligned with the prompt text. The blink runs only under `prefers-reduced-motion: no-preference`.
- The colophon strip shows the copyright line with the current year, the version link, a credit line with the `Wordmark`, privacy and security policy links, RSS/Atom/JSON feed links, the `Static.Quest` web ring widget (previous, members, next, random), and the [People's Pledge](https://people.pledge.party/) badge (`PeoplePledgeBadge` at 40 px).
- The credit line before the `Wordmark` comes from `setup.credits`. The server renders the first entry, so every build is identical and visitors without JavaScript see a stable line. The client script picks a random entry with `pickCredit()` (`src/utils/greeting.pure.ts`) on every `astro:page-load` and writes it into `[data-credit-slot]`. It reads the list from the `data-credits` attribute and skips blank entries.
- The year is set on the server and corrected by an inline script to avoid stale build-time years. The same inline script fetches `/api/siteinfo.json` and, when a `version` and `releasePage` are present, appends a version link (`៚ vX.Y.Z`) after the site title. Failures are ignored.
- The badge and `Wordmark` use `--color-primary-700` in light mode and `--color-primary-600` in dark mode.
- Renders `<Colophon />` after the closing `</footer>` tag.

## Extending

To add or reorder navigation links, edit [`footernavigation.json`](../../../../src/data/footernavigation.json). To change the greeting text, edit `setup.greetings` in [`setup.json`](../../../../src/data/setup.json). To add, change, or remove a credit line, edit the `setup.credits` list in the same file. To move a network between the featured list and the icon row, change its `show.connect` flag; see [Social media setup](../../../content/social-setup.md).
