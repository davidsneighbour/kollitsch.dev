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
