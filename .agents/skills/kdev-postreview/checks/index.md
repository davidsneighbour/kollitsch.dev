# Check registry

IDs select definitions, scopes expand into IDs, and presets provide defaults. Expansion is deterministic and deduplicated. Run `publication` last. Individual checks remain selectable without running their entire scope. Checks may reuse evidence, but none silently selects another check; mandatory edit consequences and publish gates are added by orchestration.

## Checks

| ID | Definition | Coverage |
| --- | --- | --- |
| `frontmatter` | [frontmatter](frontmatter.md) | Validate raw post metadata against the current schema and binding formatting rules. |
| `tags` | [tags](tags.md) | Validate topical classification and canonical tag syntax. |
| `seo` | [SEO](seo.md) | Review descriptions, summaries, and metadata consumed by the page head. |
| `cover` | [cover](cover.md) | Verify image/video cover configuration and the mandatory image location convention. |
| `media` | [media](media.md) | Verify body embeds, imports, local assets, and referenced media. |
| `links` | [links](links.md) | Diagnose links without converting checker failures directly into editorial changes. |
| `orthography` | [orthography](orthography.md) | Check spelling and identifier typos with the configured tool. |
| `prose` | [prose](prose.md) | Review grammar, style, and authorial clarity with Vale plus manual judgement. |
| `markdown` | [markdown](markdown.md) | Verify Markdown structure, accessibility-related markup, and configured source conventions. |
| `publication` | [publication](publication.md) | Establish publication readiness and action boundaries. |

## Scopes

| Scope | Check IDs |
| --- | --- |
| `frontmatter` | `frontmatter`, `tags`, `seo`, `cover` |
| `language` | `orthography`, `prose` |
| `grammar` | `prose` |
| `spelling` | `orthography` |
| `assets` | `cover`, `media` |
| `content` | `tags`, `seo`, `orthography`, `prose`, `markdown` |
| `links` | `links` |

With `checks=frontmatter`, select only the schema check. With `scopes=frontmatter`, expand the metadata scope. Bare natural-language names use the stated intent; if ambiguous, use the individual check and announce the expansion.

## Presets

| Preset | Check IDs |
| --- | --- |
| `review` | `frontmatter`, `tags`, `seo`, `cover`, `media`, `orthography`, `prose`, `markdown` |
| `publish` | All review checks, plus `links` and `publication` |
| `all` | All registered checks |

Review/edit without a selection use `review`. Links are opt-in outside publish/all, preserving the existing network/editorial boundary. Cover migration is an operation, not a check or a default review mutation. Editing non-conforming covers remains mandatory under the repository image instructions.
