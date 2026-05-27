---
title: Pinning GitHub Actions to commit hashes
description: A guide on how to pin GitHub Actions to specific commit hashes for better security and stability.
summary: Learn how to enhance the security and stability of your GitHub workflows by pinning actions to specific commit hashes instead of version tags.
tags:
 - automation
 - github
 - reproducibility
 - security
 - workflows
 - dotfiles
cover:
 src: roman-synkevych-wX2L8L-fGeA-unsplash.jpg
 type: image
 title: Photo by [Roman Synkevych](https://unsplash.com/@synkevych) on [Unsplash](https://unsplash.com/photos/black-and-white-penguin-toy-wX2L8L-fGeA)
date: 2026-05-26T00:52:58.383Z
---

I recently started replacing version tags in my GitHub workflow files with full commit hashes.

Instead of this:

```yaml
uses: actions/checkout@v6
```

I now use this:

```yaml
uses: actions/checkout@de0fde0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
```

That looks less readable at first, but it has an important advantage: the workflow now points to one exact snapshot of the action's source code.

Version tags are convenient, but they are still only references. A tag like `v6` or even `v6.0.2` can theoretically be moved or deleted by the repository owner. A full commit hash points to the exact commit object. That makes it a better choice when we want our workflow to be reproducible and harder to tamper with. It also makes life much harder for attackers who want to compromise our workflows by changing the code behind a tag.

The core benefit is immutability. A version tag is a human-friendly pointer. A commit hash is the permanent identifier of a specific state of the repository.

This helps in a few ways:

* It reduces the risk of supply chain attacks. If an action repository is compromised and a trusted tag is moved to malicious code, a workflow using that tag may run the changed code. A workflow pinned to a full commit hash keeps using the exact commit it was configured for.
* It prevents hidden version drift. A broad tag such as `v6` may change over time. That can be useful for updates, but it also means the workflow may run different code later without the workflow file changing.
* It improves reproducibility. When a workflow breaks, the referenced action code is not a moving target. The same workflow file points to the same action code every time.
* It makes automated auditing easier. Tools such as [OpenSSF Scorecard](https://securityscorecards.dev) check whether GitHub Actions are pinned to immutable references.

The downside is maintenance. Hashes are not readable and they do not update themselves. I usually keep the release version as a comment next to the hash:

```yaml
uses: actions/checkout@de0fde0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
```

That gives me both parts:

* the commit hash for security
* the release tag for human readability

## Tags versus hashes

| Feature | Version tags, for example `@v6` | Commit hashes, for example `@de0fac...` |
| :--- | :--- | :--- |
| Readability | High | Low |
| Stability | Depends on the tag | Immutable |
| Security | Can be affected by tag changes | Stronger against tag switching |
| Updates | Easier, sometimes automatic | Manual or tool-assisted |
| Reproducibility | Weaker | Stronger |

For local projects, personal tooling, and CI pipelines that should behave consistently, I prefer the commit hash.

## The helper script

To make this easier, I of course wrote myself a small Bash script.

It takes a GitHub repository name in `OWNER/REPO` format, finds the latest full GitHub release, resolves the release tag, and prints the commit hash behind that tag.

For example:

```bash
get-last-hash actions/checkout
```

returns:

```text
de0fac2e4500dabe0009e67214ff5f5447ce83dd
```

Using the `--verbose` option, it also prints the tag name and the release name:

```bash
get-last-hash --verbose actions/checkout
```

returns:

```text
{
 "hash": "de0fac2e4500dabe0009e67214ff5f5447ce83dd",
 "tag": "v6.0.2",
 "releaseUrl": "https://github.com/actions/checkout/releases/tag/v6.0.2"
}
```

The script uses the GitHub CLI, so it does not need a custom token handling setup as long as `gh` is already authenticated.

Here it is in all its beauty (or find [the latest version in my dotfiles repository](https://github.com/davidsneighbour/dotfiles/blob/main/bashrc/helpers/gh/get-last-release-hash.bash)):

```bash
#!/bin/bash
# shellcheck shell=bash

set -euo pipefail

show_help() {
 local command_name
 command_name="$(basename "$0")"

 cat <<EOF
Usage:
 ${command_name} --repo OWNER/REPO
 ${command_name} --verbose --repo OWNER/REPO
 ${command_name} OWNER/REPO

Description:
 Prints the commit hash behind the latest full GitHub release of a repository.

 By default, the script prints only the hash.
 With --verbose, the script prints a JSON object with the hash, release tag, and release URL.

Examples:
 ${command_name} --repo actions/checkout
 ${command_name} --verbose --repo actions/checkout
 ${command_name} actions/checkout

Options:
 --repo OWNER/REPO GitHub repository, for example actions/checkout.
 --verbose Print JSON output instead of only the hash.
 --help Show this help message.

Requirements:
 gh GitHub CLI, authenticated for API access.
EOF
}

fail() {
 printf 'Error: %s\n\n' "$1" >&2
 show_help >&2
 exit 1
}

require_command() {
 local command_name="${1}"

 if ! command -v "${command_name}" >/dev/null 2>&1; then
 fail "Required command not found: ${command_name}"
 fi
}

json_escape() {
 local value="${1}"

 value="${value//\\/\\\\}"
 value="${value//\"/\\\"}"
 value="${value//$'\n'/\\n}"
 value="${value//$'\r'/\\r}"
 value="${value//$'\t'/\\t}"

 printf '%s' "${value}"
}

get_latest_release_tag() {
 local repo="${1}"

 gh release list \
 --repo "${repo}" \
 --exclude-drafts \
 --exclude-pre-releases \
 --limit 1 \
 --order desc \
 --json tagName \
 --jq '.[0].tagName'
}

get_release_url() {
 local repo="${1}"
 local tag="${2}"

 gh api \
 "repos/${repo}/releases/tags/${tag}" \
 --jq '.html_url'
}

get_commit_hash_for_tag() {
 local repo="${1}"
 local tag="${2}"
 local ref_data
 local object_type
 local object_sha

 ref_data="$(
 gh api \
 "repos/${repo}/git/ref/tags/${tag}" \
 --jq '.object.type + " " + .object.sha'
 )"

 read -r object_type object_sha <<<"${ref_data}"

 case "${object_type}" in
 commit)
 printf '%s\n' "${object_sha}"
 ;;
 tag)
 gh api \
 "repos/${repo}/git/tags/${object_sha}" \
 --jq '.object.sha'
 ;;
 *)
 fail "Unsupported tag object type for ${repo}@${tag}: ${object_type}"
 ;;
 esac
}

print_verbose_json() {
 local hash="${1}"
 local tag="${2}"
 local release_url="${3}"

 cat <<EOF
{
 "hash": "$(json_escape "${hash}")",
 "tag": "$(json_escape "${tag}")",
 "releaseUrl": "$(json_escape "${release_url}")"
}
EOF
}

main() {
 local repo=""
 local verbose="false"

 require_command "gh"

 while [ "${#}" -gt 0 ]; do
 case "${1}" in
 --repo)
 shift
 [ "${#}" -gt 0 ] || fail "Missing value for --repo."
 repo="${1}"
 ;;
 --verbose)
 verbose="true"
 ;;
 --help | -h)
 show_help
 exit 0
 ;;
 -*)
 fail "Unknown option: ${1}"
 ;;
 *)
 if [ -n "${repo}" ]; then
 fail "Repository was provided more than once."
 fi
 repo="${1}"
 ;;
 esac
 shift
 done

 [ -n "${repo}" ] || fail "Missing repository."
 [[ "${repo}" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] || fail "Repository must use OWNER/REPO format."

 local tag
 local hash
 local release_url

 tag="$(get_latest_release_tag "${repo}")"

 [ -n "${tag}" ] || fail "No full release found for ${repo}."

 hash="$(get_commit_hash_for_tag "${repo}" "${tag}")"

 if [ "${verbose}" = "true" ]; then
 release_url="$(get_release_url "${repo}" "${tag}")"
 print_verbose_json "${hash}" "${tag}" "${release_url}"
 exit 0
 fi

 printf '%s\n' "${hash}"
}

main "$@"
```

For me, this is the right compromise. Workflows stay explicit, pinned, and reproducible, while adding a new action only takes a quick script run and copy-paste.
