# Todo item template

Use this structure for every active item in `ToDo.md`.

```md
### Topic

#### `topic-stable-slug`
* Status: active
* Origin: ai
* Rank: high
* Impact: high
* Effort: medium
* Confidence: high
* Authority: instruction-derived
* Execution mode: autonomous
* References mode: sample
* Dependencies: none

* Issue  
  Describe the problem or opportunity clearly.

* Why it matters  
  Explain why this matters, what it blocks, whether it is a bug, feature, maintenance task, or cosmetic issue.

* References  
  * `path/to/file.ext:10-20`
  * `another/file.ext:30-35`

* References coverage  
  Sample references only. Confirm the complete set before implementation.

* Action / recommendation  
  Describe the expected path to implementation. Say whether the AI may choose the exact solution or must follow a specific plan.
```

## Field notes

* `Status` reflects lifecycle.
* `Origin` tells whether the item was originally added by a human or by AI.
* `Authority` explains why the item exists, for example:
  * `instruction-derived`
  * `config-derived`
  * `heuristic`
  * `carry-over`
  * `human-requested`
* `Dependencies` should list stable IDs or `none`.
