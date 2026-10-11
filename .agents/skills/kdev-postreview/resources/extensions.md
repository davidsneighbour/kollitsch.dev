# Extension entry points

Selectable verification lives in [the check registry](../checks/index.md). Add checks with [the shared contract](check-contract.md) and [the template](check-template.md); register their IDs and scopes there. This file indexes mutation procedures only, so there is one selection registry.

| Operation | Procedure | Boundary |
| --- | --- | --- |
| Generate tags, description, or summary | [Metadata](metadata-generation.md) | Requested editing only; preserve optional summary fallback |
| Migrate cover image | [Cover migration](cover-image-migration.md) | Explicit migration or mandatory consequence of editing a non-conforming image cover |
| Reconcile link failures | [Link review](link-review.md) | Item-level user decisions; diagnosis alone never authorises changes |

Procedures cannot weaken repository instructions or create new publication authority.
