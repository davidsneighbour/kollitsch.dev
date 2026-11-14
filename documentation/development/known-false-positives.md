# Known false positives

This document tracks test, lint, and check failures that were investigated
and proven to be false positives: the underlying page, component, or code is
correct, but a tool reports a failure anyway.

Read this document whenever a test, lint, or other automated check fails
unexpectedly. Check whether the failure already has a chapter here before
spending time re-diagnosing it or changing code to chase the tool's report.

Each chapter must include hard evidence (computed values, screenshots, or
equivalent), not just a hunch that "it's probably fine". A false positive
claim without evidence does not belong here: fix the code instead, or leave
the check failing and open an issue.

When you verify a new false positive, add a chapter below using this shape:

* **Tool / check**: the command or rule that fails.
* **Symptom**: what the tool reports.
* **Root cause**: why the tool is wrong.
* **Evidence**: how this was verified in the real, running page or output.
* **Handling**: how the false positive is suppressed or left visible, and
  the issue tracking it.

No false positives are recorded at the moment. The earlier chapter on the Pagefind search input on `/find/` was removed in [#2032](https://github.com/davidsneighbour/kollitsch.dev/issues/2032): axe-core was right, and the cause was the cascade-layer order of the search styles.
