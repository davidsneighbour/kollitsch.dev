# Content broken link review prompt

Review broken external links in this repository interactively and reconcile approved unavailable links with the existing broken-link content components and Lychee configuration.

This is an editorial maintenance workflow. Do not automatically suppress, replace, remove, or annotate failing links.

## Existing broken-link implementation

The project already provides two ways to mark intentionally retained but currently unavailable links.

### MDX

Import:

```mdx
import BrokenLink from "@components/content/links/BrokenLink.astro";
```

Usage:

```mdx
<BrokenLink
  href="https://example.com/old-post"
  reason="timeout"
  checked="2026-09-14"
>
  original link text
</BrokenLink>
```

Required props:

- `href`
- `reason`

Optional:

- `checked`
- `title`
- normal anchor attributes

### Markdown

Normal Markdown links remain intact and are followed immediately by the web component:

```markdown
[original link text](https://example.com/old-post) <broken-link reason="timeout" checked="2026-09-14"></broken-link>
```

Markdown files using `<broken-link>` must opt into the web component in frontmatter:

```yaml
options:
  head:
    components:
      - broken-link
```

Preserve existing `options`, `head`, and `components` configuration. Add `broken-link` only if it is not already present.

## Supported broken-link failure reasons

Use only these machine-readable reason identifiers:

```text
redirect-loop
tls-error
timeout
server-error
temporarily-unavailable
unknown
```

Choose the most specific reason supported by the evidence.

Use `unknown` only when the failure cannot reasonably be classified.

Use the current date in `YYYY-MM-DD` format for `checked`.

## Content maintenance marker

For every content file actually modified by this workflow, ensure the file's frontmatter contains:

```yaml
maintenance:
  brokenLinksReviewed: YYYY-MM-DD
```

Use the current date.

Add or update `maintenance.brokenLinksReviewed` when the workflow replaces a URL, removes a link, or adds a `BrokenLink` / `<broken-link>` marker.

Merge this into an existing `maintenance` mapping without overwriting other maintenance keys.

Do not add this marker when the only approved action for that URL was a Lychee-only checker exclusion and the content file itself was unchanged.

At the end of the workflow, report how many content files were marked with `maintenance.brokenLinksReviewed`.

## Checker-blocked links

Treat known-good links that fail only because the checker cannot access them as a separate class from broken links.

Use only these machine-readable checker reason identifiers for Lychee-only exclusions:

```text
bot-blocked
rate-limited
authentication-required
checker-incompatible
```

These are independent of the broken-link failure reasons above. Do not use a checker reason in a `BrokenLink` component or `<broken-link>` marker, and do not use a broken-link reason for a checker-only Lychee exclusion.

Content must remain unchanged for checker-blocked links unless the user separately approves a real content fix or replacement.

Never add `BrokenLink` or `<broken-link>` markers for checker-blocked links.

If the user approves suppression for a checker-blocked link, add only an exact Lychee exclusion for the affected URL. Do not exclude an entire domain unless the user explicitly approves that broader domain exclusion.

Record the source file or files, checker reason, and checked date in comments near the Lychee exclusion, using whatever comment syntax fits the repository's existing Lychee configuration.

## Network access for link checking

Lychee requires real outbound network access to validate external URLs.

Lychee should also expect `GITHUB_TOKEN` to be available in the shell environment for authenticated GitHub checks. Do not print, inspect, request, or store the token value. If `GITHUB_TOKEN` is missing, report that once and continue where practical.

When running Lychee:

- do not treat failures caused by the agent sandbox's lack of network access as broken links;
- if a sandboxed Lychee run cannot access the network, stop that run rather than retrying links inside the sandbox;
- request approval to run the Lychee command with network access / outside the restrictive sandbox, using the environment's normal escalation mechanism;
- once approved, use that network-capable execution for the link-checking phase;
- use authenticated GitHub checks through `GITHUB_TOKEN` when the environment provides it;
- distinguish clearly between:
  - a URL failure returned by the real remote server; and
  - a failure caused by Codex's execution sandbox or network policy.

Never classify or modify content based on a network-disabled sandbox run.

If a GitHub replacement was successfully verified during Phase 1 and a later verification fails only because of GitHub rate limiting, retain the earlier successful verification and report the final verification as rate-limited. Do not reclassify that link as broken based only on the later rate limit.

Do not silently weaken GitHub checking globally.

## Phase 1: find and diagnose failures

Before diagnosing link failures, ensure that the Lychee process has outbound network access. If the current execution sandbox blocks outbound HTTP/HTTPS, request the required execution approval instead of interpreting those failures as link failures.

Run the project's existing Lychee link-checking workflow.

For every failing external URL:

1. Determine every content file containing that URL.
2. Inspect the context in which the link appears.
3. Test the target sufficiently to classify the failure.
4. Where useful, investigate whether:
   - the content moved to another canonical URL;
   - the site's URL structure changed;
   - the destination now redirects elsewhere;
   - an obvious typo or malformed URL exists;
   - the failure appears temporary;
   - the entire origin is malfunctioning;
   - the resource is genuinely gone.

5. Separately classify links that are confirmed reachable for ordinary users or browsers but blocked, rate-limited, authentication-gated, or incompatible with Lychee/checker behaviour.

Do not modify content yet.

Do not treat a Lychee failure by itself as evidence that a link should be marked unavailable.

## Phase 2: interactive review

After Phase 1, do not present all findings and then ask for a batch response.

Review the findings with the user one decision item at a time.

Process items in this order:

1. `Recommended fixes`
2. `Known-good but checker-blocked links`
3. `No confirmed replacement found`

These headings define processing order only. Do not wait until the end of a section before asking the user.

### Per-item interaction

For each decision item:

1. Present only the information needed to make the decision:
   - a short descriptive title;
   - the current external URL as a clickable HTTPS link;
   - each affected repository content file as a clickable local link opening at the relevant line whenever the environment supports this;
   - enough surrounding source context to make the editorial decision understandable;
   - the diagnosed failure or checker condition;
   - a clickable proposed replacement URL when one was found;
   - the recommended action with a short explanation.

2. Then MUST invoke the environment's interactive user-question or choice UI when that capability is available.

3. Do not merely print the available choices as prose and wait for a textual response when an interactive choice UI is available.

4. Wait for the user's decision for that item before proceeding.

5. Apply or record the approved decision.

6. Immediately continue with the next decision item and invoke another interactive question.

Continue until every decision item has been reviewed or the user explicitly stops the process.

Do not avoid interactive questions because there are many findings. An initial archive cleanup with 20–30 broken links is expected to result in roughly 20–30 interactive decisions.

### Source context

For each reviewed link, do not show only terse link text such as `here`, `this`, or `read more`.

Quote enough surrounding source context to make the editorial decision understandable. Prefer the complete containing sentence. If the containing sentence is ambiguous, quote the full paragraph. Avoid dumping excessively long paragraphs; summarise the overflow outside the quote only when needed.

Render the quoted source context in Markdown blockquote form where practical.

Make the affected link or link text visually identifiable within that context where possible without rewriting the source. For example, wrap the affected Markdown link in `**...**` in the displayed quote, or add a short `Affected link text:` line when highlighting inside the quote would make the source misleading.

### Ordinary broken-link choices

For links in `Recommended fixes` and `No confirmed replacement found`, offer:

- `1 - Fix / replace`
- `2 - Mark currently unavailable`
- `3 - Remove link`
- `4 - Ignore for now`

Keep these numbers stable for ordinary broken links. Do not dynamically renumber choices based on what is recommended.

Tell the user they may answer with just the number.

The environment's normal free-text, `Other`, `Something else`, or equivalent option should remain available so the user can provide a custom instruction.

If a reliable replacement was found, make `Fix / replace` the recommended option and show the proposed replacement clearly.

If no replacement was found, recommend the most appropriate remaining action based on the evidence, but do not select it automatically.

### Checker-blocked choices

For links in `Known-good but checker-blocked links`, offer:

- `1 - Add Lychee-only exclusion`
- `2 - Fix / replace` only when a genuine replacement URL was found
- `3 - Ignore for now`

Keep these numbers stable for checker-blocked links. Do not dynamically renumber choices based on what is recommended.

Tell the user they may answer with just the number.

The environment's normal free-text, `Other`, `Something else`, or equivalent option should remain available.

Do not offer `Mark currently unavailable` for checker-blocked links, because the content itself is not known to be unavailable.

Do not change content for a checker-blocked link unless the user explicitly chooses a real content fix or replacement.

### Interaction checkpoints

After every 5 completed decisions, perform an internal interaction checkpoint before presenting the next item:

- keep the remaining queue and all already-recorded decisions;
- re-read and re-apply all Phase 2 interaction requirements;
- restore the exact per-item structure and numbered choice format;
- do not rerun Phase 1;
- do not repeat already reviewed items;
- continue with the next unresolved item.

This is a prompt re-anchoring step only, not a fresh full link check.

### Grouping multiple URLs

One interactive decision may cover multiple URLs only when all of the following are true:

- they occur in the same editorial context;
- they have effectively the same diagnosis;
- the same action clearly applies to all of them.

If different actions could reasonably apply, split them into separate decision items.

If the same URL occurs in multiple content files, show every affected file and ask once when the same decision clearly applies to all occurrences.

If the editorial context differs materially between occurrences, ask separately.

### Clickable references

When referring to repository files, render them as clickable local links opening the relevant file at the relevant line whenever the environment supports this.

Do not show only plain file paths when a navigable local link can be produced.

If the environment cannot create local file links, fall back to the clearest repository-relative path plus line number.

Render every current external URL and every proposed replacement as a clickable HTTPS link.

### Example interaction

Present one item approximately like this:

```markdown
### Go date format reference

Current URL:
[https://programming.guide/go/format-parse-string-time-date-example.html](https://programming.guide/go/format-parse-string-time-date-example.html)

Found in:
[src/content/blog/2021/print-ordinal-date-suffixes-in-gohugo/index.md:55](LOCAL-LINK-TO-FILE-LINE)

Source context:
> The Gohugo docs say that **[Go's reference date format](https://programming.guide/go/format-parse-string-time-date-example.html)** can look strange until you know the magic timestamp behind it.

Failure:
TLS certificate error. The content appears to have moved to a successor site.

Recommended replacement:
[https://yourbasic.org/golang/format-parse-string-time-date-example/](https://yourbasic.org/golang/format-parse-string-time-date-example/)

Recommended action:
1 - Fix / replace, because the original content appears to exist at a confirmed successor URL.

Choices:
1 - Fix / replace
2 - Mark currently unavailable
3 - Remove link
4 - Ignore for now

You may answer with just the number. The environment's free-text / Other option remains available.
```

After presenting this information, invoke the interactive choice UI.

Do not render a prose list of choices as a substitute for invoking that UI when the UI capability exists.

### Applying decisions

The user's explicit decision remains the boundary between diagnosis and modification.

Do not:

- replace a URL;
- add a broken-link marker;
- remove a link;
- add a Lychee exclusion;
- or otherwise change content

until the user has made the corresponding item-level decision.

`Ignore for now` means no content change and no Lychee configuration change.

### Final report

After all interactive decisions have been processed, produce a compact summary grouped by outcome, including:

- URLs fixed or replaced;
- URLs marked currently unavailable;
- URLs given Lychee-only checker exclusions;
- URLs removed;
- URLs ignored or left unresolved.

The final report is a summary only.

Do not use the final report as a substitute for the per-item interactive review.

## Action: fix / replace URL

When the user chooses to fix the link:

- replace only the affected URL;
- preserve the original link text unless a change is clearly necessary;
- do not add a broken-link marker;
- remove any obsolete broken-link marker attached to that link;
- remove any corresponding Lychee exclusion that existed solely because this URL was marked unavailable;
- add or update `maintenance.brokenLinksReviewed` in every content file modified by this action.

Recheck the resulting URL.

## Action: mark currently unavailable

When the user chooses this option, preserve the original external URL.

### MDX files

Convert the affected link to the existing `BrokenLink` component.

For example:

```mdx
[original link text](https://example.com/old-post)
```

becomes:

```mdx
<BrokenLink
  href="https://example.com/old-post"
  reason="redirect-loop"
  checked="CURRENT-DATE"
>
  original link text
</BrokenLink>
```

Ensure this import exists:

```mdx
import BrokenLink from "@components/content/links/BrokenLink.astro";
```

Do not add a duplicate import.

Preserve existing MDX imports and formatting.

### Markdown files

Keep the normal Markdown link and append the marker immediately after it:

```markdown
[original link text](https://example.com/old-post) <broken-link reason="redirect-loop" checked="CURRENT-DATE"></broken-link>
```

Ensure the file's frontmatter includes:

```yaml
options:
  head:
    components:
      - broken-link
```

Merge this into existing frontmatter without overwriting other `options.head.components` entries.

Do not duplicate `broken-link`.

### Lychee

Inspect the repository's existing Lychee configuration and exclusion mechanism before editing it.

Add an exclusion for the exact unavailable URL.

Do not exclude an entire domain merely because one URL is unavailable.

Do not weaken global TLS, redirect, timeout, or HTTP-status checking.

Document the exclusion with enough information to recover its origin later.

The resulting entry should record, in whatever syntax fits the existing Lychee configuration:

```text
source: src/content/posts/2022/example.md
reason: redirect-loop
checked: 2026-09-14
```

If several content files intentionally retain the same unavailable URL, record all relevant source files without creating redundant exclusions.

The exclusion and content marker represent the same editorial decision and must remain consistent.

Ensure every content file modified by this action has `maintenance.brokenLinksReviewed` set to the current date.

## Action: add Lychee-only exclusion

Use this only for links in the `Known-good but checker-blocked links` section and only after the user approves it.

Content must remain unchanged.

Inspect the repository's existing Lychee configuration and exclusion mechanism before editing it.

Add an exclusion for the exact checker-blocked URL only.

Do not exclude an entire domain unless the user explicitly approves that broader exclusion.

Do not weaken global TLS, redirect, timeout, fragment, or HTTP-status checking.

Document the exclusion with enough information to recover its origin later.

The resulting entry should record, in whatever syntax fits the existing Lychee configuration:

```text
source: src/content/posts/2022/example.md
checker-reason: bot-blocked
checked: 2026-09-14
```

If several content files contain the same checker-blocked URL, record all relevant source files without creating redundant exclusions.

Do not add `BrokenLink` or `<broken-link>` markers for this action.

Do not add `maintenance.brokenLinksReviewed` for this action unless the user also approved a real content fix or replacement that changed the content file.

## Action: remove link

If the user decides the historical reference no longer warrants an external link:

- remove the hyperlink while preserving useful surrounding/link text where appropriate;
- remove any corresponding broken-link marker;
- remove any Lychee exclusion associated only with that link;
- add or update `maintenance.brokenLinksReviewed` in every content file modified by this action.

Do not rewrite the surrounding article unnecessarily.

## Action: ignore for now

Make no content or Lychee changes.

The link should continue appearing as a failure in future checks.

For checker-blocked links, `Ignore for now` also means no content change and no Lychee exclusion.

## Existing marked links

Also inspect existing `BrokenLink` and `<broken-link>` markers encountered during the process.

If a marked URL is now healthy again, tell the user and offer to restore it to an ordinary link.

Do not automatically remove the marker.

If approved:

- convert it back to a normal Markdown/MDX link;
- remove the corresponding Lychee exclusion;
- remove the MDX import or Markdown `options.head.components` entry only if it is no longer used anywhere else in that content file.

## Rechecking checker-blocked exclusions

Support a separate operation for rechecking previously ignored or excluded checker-blocked links.

When asked to recheck checker-blocked exclusions:

1. Inspect the repository's Lychee configuration.
2. Collect exclusions annotated with one of the checker reason identifiers:
   - `bot-blocked`
   - `rate-limited`
   - `authentication-required`
   - `checker-incompatible`
3. Test those URLs independently of the normal link-check run.
4. Use direct HTTP checks and browser verification where practical, because Lychee may reproduce the same checker rejection.
5. If the Lychee setup supports `include` overriding `exclude`, use a targeted Lychee invocation or temporary config for those URLs only. Otherwise use an equivalent direct-check mechanism.
6. Do not weaken normal Lychee checks globally.
7. Report which links now work normally, which still require checker-only exclusions, and which have become genuinely broken.
8. Ask the user before removing any checker exclusion or changing any content.

If a checker-blocked URL now works normally in the standard check, recommend removing its Lychee-only exclusion, but do not remove it without approval.

## Consistency requirements

After approved changes:

- every intentionally unavailable link must have an appropriate content marker;
- every intentionally unavailable marked URL should have the corresponding exact Lychee exclusion;
- every checker-blocked exclusion should have a checker reason and should not have a content marker solely because of the checker failure;
- every content file modified by a replacement, link removal, or unavailable marker should have `maintenance.brokenLinksReviewed` set to the current date;
- ordinary broken links must not be hidden from Lychee;
- exclusions without a corresponding editorial or checker decision should be reported;
- duplicate exclusions should be avoided;
- unrelated Lychee configuration must remain untouched.

Do not automatically generate unavailable markers from Lychee output.

The user's explicit decision is the boundary between "broken link detected" and "intentionally retained unavailable link".

## Validation

After completing the reviewed changes:

1. Run the project's formatter and relevant content/type checks.
2. Run Lychee again.
3. Confirm that approved unavailable links are no longer reported.
4. Confirm that ignored/unreviewed failures remain visible.
5. Report:
   - URLs fixed or replaced;
   - URLs marked currently unavailable;
   - URLs removed;
   - URLs left unresolved;
   - the number of content files marked with `maintenance.brokenLinksReviewed`;
   - existing unavailable links found to have recovered;
   - any inconsistencies between content markers and Lychee exclusions.

Do not make unrelated changes.
