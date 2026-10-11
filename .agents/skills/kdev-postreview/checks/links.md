# Links

## Purpose

Diagnose links without converting checker failures directly into editorial changes.

## Input

`lychee.toml`, selected content files, installed Lychee, and `../resources/link-review.md` for remediation.

## Verify

External reachability, redirect/TLS failures, checker limitations, and internal routes/anchors. Preserve exclusions and distinguish known-good checker-blocked URLs.

## Method

Run `lychee --config lychee.toml --require-https --no-progress "POST_PATH"` after substituting the concrete path. This uses the repository workflow HTTPS override. Inspect output/exit status and cached/excluded/accepted URLs. The config accepts 429 and resolves root-relative links against production; image/root-fragment exclusions and source/MDX extraction limit coverage. Verify local routes and page anchors separately. Do not print tokens. Network policy failures block rather than establish broken links.

## Output

URL, source context/location, remote versus checker diagnosis, verified replacement if found, and exclusions/cache/internal-route coverage.

## Pass/fail

Confirmed requirement violations fail. Checker-only uncertainty blocks the affected verification; configured exclusions must be disclosed. No links is skipped.

## Remediation

Review mode reports diagnosis only. For any replacement, removal, marker, or exclusion, load `../resources/link-review.md` and obtain each item-level decision through available interactive UI. Preserve exact exclusions, reason vocabularies, and maintenance markers.
