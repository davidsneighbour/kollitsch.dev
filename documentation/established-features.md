# Established feature contracts

This file records deliberate interaction and layout behaviours that can look unusual in a narrow audit, but are established parts of the site. Before changing an existing feature, layout, animation, or accessibility exception, check this file, `DESIGN.md`, and the matching component documentation. If a decision changes, update this file in the same change.

## Header theme switcher hover field

Date: 2026-09-12

Decision: The fixed theme switcher keeps a full 8rem top-right corner shell for its hover and focus radial field. The resting visible and clickable area remains a small clipped circle around the icon, but the underlying `.theme-toggle` button deliberately fills the shell so the radial transparency effect can widen into the header on hover or focus.

Reason: The effect is a designed part of the top-of-page header interaction, not an accidental obstruction. The switcher is only visible before the page has scrolled; at that point the animated title is already visible before any interaction with the switcher can cover it. Because of that timing, do not treat the widening radial fade as an accessibility defect or automatically constrain it to a small square.

Change rule: Do not shrink `.theme-corner .theme-toggle` to a 4rem square or centre its clip geometry on the smaller button. Preserve the full-shell button with a small resting `clip-path` unless the site owner explicitly revises this decision.
