# Established feature contracts

This file records deliberate interaction and layout behaviours that can look unusual in a narrow audit, but are established parts of the site. Before changing an existing feature, layout, animation, or accessibility exception, check this file, `DESIGN.md`, and the matching component documentation. If a decision changes, update this file in the same change.

## Header theme switcher hover field

Date: 2026-09-12

Decision: The fixed theme switcher keeps a full 8rem top-right corner shell for its hover and focus radial field. The resting visible and clickable area remains a small clipped circle around the icon, but the underlying `.theme-toggle` button deliberately fills the shell so the radial transparency effect can widen into the header on hover or focus.

Reason: The effect is a designed part of the top-of-page header interaction, not an accidental obstruction. The switcher is only visible before the page has scrolled; at that point the animated title is already visible before any interaction with the switcher can cover it. Because of that timing, do not treat the widening radial fade as an accessibility defect or automatically constrain it to a small square.

Change rule: Do not shrink `.theme-corner .theme-toggle` to a 4rem square or centre its clip geometry on the smaller button. Preserve the full-shell button with a small resting `clip-path` unless the site owner explicitly revises this decision.

## Dark-mode heading links

Date: 2026-09-12

Decision: Dark-mode headings across article pages, post cards, taxonomy pages, and non-blog content pages use the `primary-500` heading colour. When a heading is also a link, the heading text stays `primary-500` at rest and the link affordance is a straight `primary-700` underline with skip-ink enabled. On hover, both text and underline brighten to `primary-300`.

Reason: Plain headings and linked headings must look like the same typographic family, while linked headings still need a non-colour affordance. A straight underline keeps the selected prototype's clarity without the stronger visual personality of the wavy version.

Change rule: Do not make linked headings use the body-link colour at rest in dark mode, and do not remove the underline cue from linked headings. Keep ordinary inline links on the `link-dark`/`link-dark-hover` pair so body links remain distinct from heading links.

## Blog-first homepage

Date: 2026-09-16

Decision: The homepage is intentionally blog-first. It must always show the latest post or a featured post in full before the secondary homepage modules.

Reason: The site is a blog and digital garden, not a marketing website with a blog attached. A long featured post can make the homepage tall, and that is acceptable when it reflects the current or selected post.

Change rule: Optimise loading cost, image priority, below-the-fold media, script behaviour, and interaction reliability around the full post. Do not hide, truncate, paginate, remove, or structurally demote the full post as a performance fix unless the site owner explicitly revises this decision.

## Terminal-style footer

Date: 2026-11-13

Decision: The site footer reads as a terminal session. Each section starts with a JetBrains Mono prompt line (`patrick@dnb:~$ whoami`, `cat about.md`, `uname -r && uptime`, `ls ~/`, `ls ~/elsewhere`) that is an `h3` with a screen-reader-only plain name, followed by the site-wide animated heading rule. The `whoami` block is neofetch-style: the author avatar beside a key-value table that includes the live Koh Samui time from `setup.timezone`, a live `online` counter since the first published post, and the post and tag counts. The right column starts with `uname -r && uptime`: the author's age as a kernel version, the boot time (birth date and time), and a live day count with the next round thousand days (updated 2026-11-13, issue #2208). The introduction stays in Exo 2, as two paragraphs, ragged right. Social networks that also show on `/connect/` (`show.connect`) are featured with their handles; the other footer networks are one row of icon-only links. The terminal sections sit in a separate terminal window (transparent background, `rounded-lg`, no outer border or ring, and no decorative title bar), so the footer reads as its own item. The outer ring and decorative title bar were removed at the site owner's request on 13 November 2026 to simplify the panel boundary (issues #2213 and #2214). The background fill was removed at the site owner's request on 13 November 2026 (issue #2216). Keep the content, spacing, and marker animation. The final copyright and links strip spans the full page width, while the terminal section and marker keep their existing content width (13 November 2026, issue #2217). Above it, a decorative `Hey look, we have a footer!!!!111One` sticker note points down at the window (updated 2026-11-13, issue #2212). The marker has an expressive, finite word-pop, arrow-kick, and spark-burst entrance, with five lines of space above it, approved on 13 November 2026 (issue #2219). It settles within 1.2 seconds and replays only after scrolling away and returning, as approved on 13 November 2026 (issue #2220); it never continuously loops. A blinking bar cursor on the last prompt, the rolling digits of the two counters, the scroll-triggered entrance of the sticker note, and pointer-following portrait pupils are the approved footer animations (updated 2026-11-13, issue #2215).

Reason: The previous three-column footer (About, Navigation, Connect) read as a generic list, gave all 19 social networks the same weight, and repeated the header navigation without a visual reason. The terminal session gives the footer an identity that fits a developer's site and creates a clear hierarchy.

Change rule: Keep the introduction in the reading face, not in mono. Keep the featured/more split driven by `show.connect` rather than a hard-coded list. Keep the cursor, digit, and sticker-note animations behind `prefers-reduced-motion: no-preference`, keep the sticker note `aria-hidden` and visible without JavaScript, and keep both counters `aria-hidden` with static text for screen readers (`since <date>` and `<n> days`). Keep the author's uptime as a day count, not years and months: it follows the author's decimal birthdays. Do not return to equal-weight social link lists unless the site owner explicitly revises this decision.

## Pointer-following footer portrait

Date: 2026-11-13

The footer portrait retains its existing size, radius, link, and layout. Eye geometry is calibrated to the 400px source: centres (144, 154) and (220, 154), 16px pupil sprites, and elliptical travel bounded by 8px horizontally and 4.5px vertically. These are image coordinates, scaled with the portrait, rather than theme spacing values. Pupils use the original portrait pixels and colours. Movement follows pointer events directly without easing or an idle animation loop, only while the portrait is visible and motion is allowed. Touch does not prevent scrolling and resets on release or cancellation. Reduced motion and the no-script path show the original static portrait. Preserve these boundaries and fallbacks when changing the portrait.

## Footer GitHub calendar

Date: 14 November 2026. Decision: Show a full-width contribution calendar below both terminal footer columns (issue #2224). Fetch data lazily from the local Worker endpoint and retain valid browser data for at least 24 hours. Reason: Show recent activity without exposing credentials or adding a network request to initial page rendering. Change rule: Preserve the full-width placement, server-only token, accessible annual summary, and minimum cache lifetime unless the owner changes these requirements.

On 14 November 2026, an 8px inline calendar gutter was added to avoid a desktop scrollbar (issue #2226). Preserve contained scrolling when the calendar is wider than its container.

On 14 November 2026, the calendar adopted the footer prompt pattern with `gh api graphql`, a plain accessible name, and monospace output (issue #2227). Keep its typography and muted output aligned with the other terminal sections.

## Footer accessibility exceptions

Date: 14 November 2026. Decision: Copyright-strip paragraph links have permanent underlines with the existing prose-link hover motion, disabled under reduced motion. The non-interactive footer sticker and its effects use the decorative low-contrast exception (issue #2222). Reason: Keep functional links identifiable without colour while preserving the approved decorative entrance. Change rule: Keep the sticker free of controls and essential information; do not extend the exception to blog cards or other functional content.

## Instance-aware social sharing

Date: 14 November 2026. Decision: Configured `{instance}` share links ask for a server on each activation and pre-fill the saved local-storage preference (issue #2205). Reason: Mastodon visitors need to share through their own server without loading optional code or accessing their preference before they choose to share. Change rule: Load instance-handling code only after a click, keep normal links for static networks and the default-instance no-script fallback, allow changing or cancelling the choice, and keep shared URL construction in the common social helper. Do not add page-load, hover, or viewport-triggered instance loading or requests.

## Footer efficiency and decorative calendar

Date: 14 November 2026. Decision: Keep the GitHub annual contribution total accessible, and treat the coloured day grid as a static decorative illustration without controls or tooltips, as approved by the owner (issue #2234). Reason: The calendar is a secondary activity illustration; hundreds of daily tab stops add navigation cost without serving a footer task. Change rule: Preserve the accessible total and inert, hidden-from-assistive-technology grid.

Clock and counter work pauses outside a 256px vertical pre-entry margin and while the tab is hidden. Returning values catch up without animation before normal ticking resumes. Separate mobile footer links have 44px minimum targets below 48rem; desktop and inline prose spacing remain unchanged. Preserve those boundaries when refining the footer.

## Calendar loading space

Date: 14 November 2026. Decision: Reserve the calendar rows and the wrapped summary error-message height in server-rendered markup and CSS across loading, success, and error (issue #2235). Reason: The lazy calendar previously moved the copyright strip by about 129px when data arrived. Change rule: Preserve that reserved geometry without introducing a loading animation or requiring JavaScript for sizing.

## Footer sticker text enlargement

Date: 14 November 2026. Decision: Let the sticker text flex item shrink, and allow its word spans to wrap when enlarged text would exceed the available width (issue #2236). Reason: The decorative final word and arrow must not widen the page at enlarged text sizes. Change rule: Preserve the wording, decorative accessibility exception, normal-size lettering, tilt, and finite entrance animation.

The same adaptation allows terminal columns and fact values to shrink, caps the square portrait at the available width, and permits an uptime unit to wrap internally only when it cannot fit on its own line. These constraints keep the footer usable with enlarged text.

The terminal column gap is capped at the existing 64px spacing value, and feed links may wrap as a group. Preserve these layout constraints at enlarged text sizes.

## Footer sticker arrow attachment

Date: 14 November 2026. Decision: Put the arrow in the final word's inline text flow, with its last letter and the arrow kept together (issue #2238). Reason: An outer flex item detached the arrow from the final line when the text wrapped. Change rule: Keep the arrow beside the final word, while preserving wrapping, its apparent size, decoration, and finite animation.

## Mobile footer end order

Date: 14 November 2026. Decision: Show the web ring, feeds, then policy links below 48rem, with the pledge badge following (issue #2239). Reason: The owner requested that mobile reading order. Change rule: Preserve the existing desktop arrangement and link destinations.

## Footer day-count grouping

Date: 14 November 2026. Decision: Use dots as thousands separators in author uptime and milestone day counts, and remove spaces before online-counter and garden commas (issue #2240). Reason: The owner requested dot grouping and standard comma spacing. Change rule: Keep dates in British English and leave unrelated number formatting unchanged.

## Footer activity fallback and author wording

Date: 14 November 2026. Decision: Failed GitHub activity requests reveal a direct link to the canonical GitHub profile inside the reserved area, outside the decorative grid (issue #2241). Reason: A secondary activity failure should offer a useful destination without moving the links below it. Change rule: Keep the fallback accessible and preserve the reserved geometry.

The phrase `White Lotus'ses third season` is deliberate Patrick-style wording: an exaggerated genitive of the television show title. The owner confirmed it on 14 November 2026. Preserve it rather than treating it as a typo.

## Adaptive header controls

Date: 14 November 2026. Decision: Use compact navigation below a 48rem header container width at the current text size, and let its controls wrap below the brand when they cannot share a row (issue #2237). The menu follows the measured header height, and search follows the controls row. Reason: Enlarged text must not push navigation actions off screen. Change rule: Preserve the full brand, control targets, and wide-layout theme corner field. The compact theme control remains separate from the large site title on first paint, resolving the original concern in issue #1867.

The menu reports its expanded state, makes closed content inert, supports Escape with focus restoration, and closes when search opens. Preserve these interaction and accessibility states during future layout work.
