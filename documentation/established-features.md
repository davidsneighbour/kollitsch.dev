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

Decision: The site footer reads as a terminal session. Each section starts with a JetBrains Mono prompt line (`patrick@dnb:~$ whoami`, `cat about.md`, `uname -r && uptime`, `ls ~/`, `ls ~/elsewhere`) that is an `h3` with a screen-reader-only plain name, followed by the site-wide animated heading rule. The `whoami` block is neofetch-style: the author avatar beside a key-value table that includes the live Koh Samui time from `setup.timezone`, a live `online` counter since the first published post, and the post and tag counts. The right column starts with `uname -r && uptime`: the author's age as a kernel version, the boot time (birth date and time), and a live day count with the next round thousand days (updated 2026-11-13, issue #2208). The introduction stays in Exo 2, as two paragraphs, ragged right. Social networks that also show on `/connect/` (`show.connect`) are featured with their handles; the other footer networks are one row of icon-only links. The terminal sections sit in a separate terminal window (transparent background, `rounded-lg`, no outer border or ring, and no decorative title bar), so the footer reads as its own item. The outer ring and decorative title bar were removed at the site owner's request on 13 November 2026 to simplify the panel boundary (issues #2213 and #2214). The background fill was removed at the site owner's request on 13 November 2026 (issue #2216). Keep the content, spacing, and marker animation. Above it, a decorative "Hey look, we have a footer!!!!111One" sticker note points down at the window (updated 2026-11-13, issue #2212). A blinking bar cursor on the last prompt, the rolling digits of the two counters, the one-time entrance of the sticker note, and pointer-following portrait pupils are the approved footer animations (updated 2026-11-13, issue #2215).

Reason: The previous three-column footer (About, Navigation, Connect) read as a generic list, gave all 19 social networks the same weight, and repeated the header navigation without a visual reason. The terminal session gives the footer an identity that fits a developer's site and creates a clear hierarchy.

Change rule: Keep the introduction in the reading face, not in mono. Keep the featured/more split driven by `show.connect` rather than a hard-coded list. Keep the cursor, digit, and sticker-note animations behind `prefers-reduced-motion: no-preference`, keep the sticker note `aria-hidden` and visible without JavaScript, and keep both counters `aria-hidden` with static text for screen readers (`since <date>` and `<n> days`). Keep the author's uptime as a day count, not years and months: it follows the author's decimal birthdays. Do not return to equal-weight social link lists unless the site owner explicitly revises this decision.

## Pointer-following footer portrait

Date: 2026-11-13

The footer portrait retains its existing size, radius, link, and layout. Eye geometry is calibrated to the 400px source: centres (144, 154) and (220, 154), 16px pupil sprites, and elliptical travel bounded by 8px horizontally and 4.5px vertically. These are image coordinates, scaled with the portrait, rather than theme spacing values. Pupils use the original portrait pixels and colours. Movement follows pointer events directly without easing or an idle animation loop, only while the portrait is visible and motion is allowed. Touch does not prevent scrolling and resets on release or cancellation. Reduced motion and the no-script path show the original static portrait. Preserve these boundaries and fallbacks when changing the portrait.
