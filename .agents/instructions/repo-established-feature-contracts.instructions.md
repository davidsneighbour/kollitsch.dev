---
applyTo: "**"
---

# Established feature contracts

Before changing an existing visual feature, layout, animation, interaction pattern, or accessibility exception, check `documentation/established-features.md` for deliberate behaviours that must be preserved or explicitly re-decided.

When work adds, removes, or changes one of those deliberate behaviours, update `documentation/established-features.md` in the same change with the date, decision, reason, and change rule.

The homepage is deliberately blog-first. It must always show the latest post or a featured post in full before the secondary homepage modules. Performance work may reduce loading priority, defer below-the-fold media, or improve interaction cost, but must not hide, truncate, paginate, remove, or structurally demote the full post unless the user explicitly changes this design contract.
