# Design reviews

Use Impeccable critique snapshots as local review history. Keep `.impeccable/critique/` ignored, including dated reports and source fingerprints. These generated records can contain machine-specific paths, local browser states, and run-specific scores. Do not add them to Git to synchronise personal workstations.

Record actionable findings in GitHub Issues. Record approved design decisions in `DESIGN.md`, `documentation/established-features.md`, and the relevant component documentation. Those maintained sources travel with the repository and remain authoritative when a local critique snapshot is absent or stale.

This decision was recorded on 14 November 2026 in issue #2241. A solo-maintainer workflow still benefits from keeping generated review history separate from maintained project decisions.
