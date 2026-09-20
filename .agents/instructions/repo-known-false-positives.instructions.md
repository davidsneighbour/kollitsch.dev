---
applyTo: "**"
---

# Known false positives

When a test, lint, type check, or other automated check fails unexpectedly —
especially one that seems to contradict what the running page or output
actually shows — read `documentation/development/known-false-positives.md`
before re-diagnosing it from scratch or changing code to chase the tool's
report. It may already be a documented, evidence-backed false positive.

If the failure is not in that document, do not assume it is a false positive
on your own judgement. Diagnose and fix the real problem, or, only after
verifying with hard evidence (computed values, screenshots, rasterised
pixels, or equivalent — not a hunch), add a new chapter following the
format already used there and reference the GitHub issue tracking the
suppression.

Do not add a chapter, and do not exclude or disable a check, without that
evidence. A test failure is the default-correct signal; treat it as a real
regression until proven otherwise.
