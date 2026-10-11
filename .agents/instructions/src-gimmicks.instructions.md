---
applyTo: "src/components/gimmicks/**"
---

# Gimmicks

Gimmicks are progressive enhancement only. They MUST NOT be required for core content, navigation, layout, or page rendering, and MUST NOT participate unnecessarily in the critical loading or execution path.

- Prefer lazy initialisation and lazy loading.
- Performance and baseline tests must be able to evaluate the core experience without gimmicks.
- A gimmick that fails or is unavailable must leave the site usable and visually intentional.
