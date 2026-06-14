---
title: "Automating Ananke theme updates with GitHub workflows"
description: "Automating Ananke theme updates with GitHub workflows"
summary: ""
draft: true
tags: []
date: 2026-06-13T05:58:41.638Z
---

The Ananke theme has two official template repositories:

* `gohugo-ananke/template-hugo-mod`
* `gohugo-ananke/template-git-submod`

They solve the same problem from two different directions.

One template uses Hugo Modules. The other uses Git submodules. Both are useful. Both should stay current. Both should be tested against the newest Ananke release without somebody manually checking tags, running update commands, committing dependency changes, and opening issues when something breaks.

This workflow automates that maintenance loop.

It checks the latest tag in `gohugo-ananke/ananke`, compares it with the version used by the template repository, runs the repository's own update command, commits the resulting change, and reports failures back to the Ananke repository.

The important detail is this:

> The template repository owns the update mechanics.
> The workflow owns the scheduling, comparison, commit, and failure reporting.

That separation keeps the workflow small enough to reason about, while still allowing the two template repositories to update Ananke in different ways.

## What this workflow does

The workflow does five things:

1. Detect the latest Ananke release tag.
2. Detect the Ananke version currently used by the template repository.
3. Run `npm run update` when a newer Ananke version exists.
4. Commit the update using a predictable commit message.
5. Create or update an issue in `gohugo-ananke/ananke` when the update fails.

The commit message follows this format:

```text
chore(update): upgrade to Ananke version vX.Y.Z
```

The failure issue title follows this format:

```text
failure: upgrade REPONAME to Ananke VERSIONNAME
```

For example:

```text
failure: upgrade template-hugo-mod to Ananke v2.12.3
```

or:

```text
failure: upgrade template-git-submod to Ananke v2.12.3
```

The issue is created in the Ananke repository, not in the template repository. This is intentional. The failure is usually not interesting only to the template repository. It is a compatibility signal for the theme itself.

## The two template strategies

The workflow is shared, but the update result is different depending on the template.

### Hugo Module template

Repository:

```text
gohugo-ananke/template-hugo-mod
```

This template consumes Ananke as a Hugo Module:

```toml
[module]
[[module.imports]]
path = 'github.com/gohugo-ananke/ananke/v2'
```

The relevant files are normally:

```text
go.mod
go.sum
```

A successful update should change one or both of those files.

The workflow detects this mode by checking whether `go.mod` contains the configured Ananke module path:

```text
github.com/gohugo-ananke/ananke/v2
```

For the Hugo Module template, the workflow should only stage these files:

```bash
git add go.mod go.sum
```

That keeps the commit narrow and prevents unrelated generated files from slipping into the automated update commit.

### Git submodule template

Repository:

```text
gohugo-ananke/template-git-submod
```

This template consumes Ananke as a Git submodule:

```bash
git submodule add https://github.com/gohugo-ananke/ananke.git themes/ananke
```

The relevant changed path is normally:

```text
themes/ananke
```

This is not a normal directory update in the parent repository. A Git submodule commit records a pointer to a commit in the child repository.

For the Git submodule template, the workflow should only stage this path:

```bash
git add themes/ananke
```

Again, this avoids accidental commits.

## Why `npm run update` should not commit

Originally, the `update` scripts in the two template repositories committed their own changes.

That works for local maintenance, but it is awkward inside a workflow that needs to create a consistent commit message.

A script like this is too opinionated for this workflow:

```json
{
  "scripts": {
    "update": "hugo mod get -u ./... && hugo mod tidy && git add go.mod go.sum && git commit -m 'build(deps): update go module'"
  }
}
```

The same problem exists for a submodule update script like this:

```json
{
  "scripts": {
    "update": "git submodule update --remote --merge && git add themes/ananke && git commit -m 'build(deps): update git submodule'"
  }
}
```

The workflow should be responsible for the commit. The `npm run update` command should only update the working tree.

A better split is:

For the Hugo Module template:

```json
{
  "scripts": {
    "update": "hugo mod get -u ./... && hugo mod tidy"
  }
}
```

For the Git submodule template:

```json
{
  "scripts": {
    "update": "git submodule update --remote --merge"
  }
}
```

This gives the workflow full control over:

* what is staged
* what is committed
* what the commit message says
* what happens when there are no changes
* how failures are reported

That is cleaner than letting each script perform half of the workflow's job.

## Why the workflow checks tags instead of releases

The requirement is tag-based:

> check if `gohugo-ananke/ananke` has a new release version based on tag

That means the workflow does not need to inspect GitHub Releases. It looks at repository tags instead.

The workflow fetches all tags from `gohugo-ananke/ananke`, filters semantic version tags, sorts them, and picks the newest one.

The relevant logic is:

```bash
latest_tag="$(
  gh api --paginate "repos/${ANANKE_REPOSITORY}/tags" \
    --jq '.[].name' \
    | grep -E '^v[0-9]+(\.[0-9]+){2}$' \
    | sort -V \
    | tail -n 1
)"
```

This accepts tags like:

```text
v2.12.0
v2.12.1
v3.0.0
```

It ignores tags that do not follow the expected release format.

That is useful because repositories sometimes have historical tags, test tags, pre-release tags, or other labels that should not trigger this workflow.

## Why scheduled runs skip unchanged versions

A scheduled workflow should be quiet when there is nothing to do.

If the template already points at the latest Ananke version, the workflow exits cleanly:

```yaml
- name: Skip unchanged release
  if: steps.current.outputs.version == steps.ananke.outputs.version && github.event_name != 'workflow_dispatch'
  shell: bash
  run: |
    echo "Ananke ${{ steps.ananke.outputs.version }} is already configured. Nothing to update."
```

Manual runs are treated differently.

A manual `workflow_dispatch` run is allowed to continue even when the current version already matches the latest tag. That makes it possible to test the update machinery, rerun a failed update, or confirm the current setup without waiting for the next tag.

## Checkout configuration

The checkout step uses a pinned action version:

```yaml
- name: Checkout repository
  uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
  with:
    fetch-depth: 0
    submodules: recursive
    persist-credentials: false
    token: ${{ github.token }}
```

There are four important details here.

### `fetch-depth: 0`

The workflow needs enough Git history and tag context to work correctly, especially for the submodule case.

Shallow clones are faster, but they are often the wrong default for automation that compares versions, updates submodules, or writes commits.

### `submodules: recursive`

The Git submodule template needs `themes/ananke` to exist as a real submodule checkout.

Without this, commands that inspect or update the submodule may fail or behave inconsistently.

### `persist-credentials: false`

This prevents `actions/checkout` from leaving the GitHub token in the local Git config.

That is a safer default. The workflow can still push later, but it must do so explicitly.

This keeps authentication visible at the point where it is used.

### `token: ${{ github.token }}`

The default GitHub token is enough to read the current repository and push commits back to it, provided the workflow has:

```yaml
permissions:
  contents: write
```

The Ananke issue token is separate and is only used for writing issues to `gohugo-ananke/ananke`.

## Pushing with explicit credentials

Because `persist-credentials` is disabled, a plain `git push` will not have stored credentials.

So the workflow pushes with an explicit authenticated remote URL:

```bash
git push "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" HEAD:${GITHUB_REF_NAME}
```

The commit step therefore needs the token in its environment:

```yaml
env:
  GITHUB_TOKEN: ${{ github.token }}
```

This keeps the authentication scoped to the step that needs it.

## Why the workflow should not commit all changed files

A simple version of the workflow could stage everything:

```bash
git add --all
```

That works, but it is too broad for this kind of maintenance automation.

`git add --all` stages:

* modified tracked files
* deleted tracked files
* new untracked files

That means the workflow might accidentally commit logs, generated files, cache artefacts, lock files, or anything else created by `npm run update`.

For a dependency update workflow, that is risky.

The safer approach is to stage only the files that are expected to change.

For Hugo Modules:

```bash
git add go.mod go.sum
```

For Git submodules:

```bash
git add themes/ananke
```

This turns the commit into a controlled output rather than a snapshot of whatever happened in the workspace.

## Failure handling

The workflow does not only fail.

It reports.

When `npm run update` returns a non-zero exit code, the workflow captures the full output and opens or updates an issue in:

```text
gohugo-ananke/ananke
```

The issue title is deterministic:

```text
failure: upgrade REPONAME to Ananke VERSIONNAME
```

This means repeated failures for the same repository and same Ananke version update the existing issue instead of creating duplicates.

The issue body includes:

* source repository
* template mode
* previous Ananke version
* target Ananke version
* exit code
* workflow run URL
* full CLI output

That is enough context to inspect the failure without opening the workflow logs first.

## Why issues are created in the Ananke repository

The template repositories are consumers of Ananke.

If the update fails, the failure might be caused by:

* a broken theme release
* a changed module path
* a missing tag
* a Hugo Module issue
* a submodule checkout problem
* a compatibility problem with Hugo
* an invalid generated file
* a repository-specific template problem

Not every failure is an Ananke bug. But the Ananke repository is the best place to collect the signal because both official templates depend on it.

This makes failures visible where maintainers already think about theme releases.

## Token separation

The workflow uses two tokens.

### `github.token`

Used for:

* checking out the current repository
* reading tags
* pushing commits back to the current template repository

Configured through:

```yaml
permissions:
  contents: write
```

### `secrets.ANANKE_ISSUE_TOKEN`

Used for:

* creating issues in `gohugo-ananke/ananke`
* updating existing failure issues in `gohugo-ananke/ananke`

The workflow checks that this secret exists before attempting issue creation:

```bash
if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "::error::Missing secret ANANKE_ISSUE_TOKEN. This token needs issue write access to ${TARGET_ISSUE_REPOSITORY}."
  exit 1
fi
```

This token should be a fine-grained token with issue write access to the Ananke repository.

It should not be used for normal repository checkout or pushing.

## The workflow

Save this file as:

```text
.github/workflows/ananke-release-update.yaml
```

Use the same workflow file in both template repositories.

````yaml
name: Update Ananke release

on:
  workflow_dispatch:
  schedule:
    # Daily at 03:40 UTC / 10:40 UTC+7.
    - cron: "40 3 * * *"

permissions:
  contents: write

concurrency:
  group: ananke-release-update
  cancel-in-progress: false

env:
  TARGET_ISSUE_REPOSITORY: gohugo-ananke/ananke
  ANANKE_REPOSITORY: gohugo-ananke/ananke
  ANANKE_MODULE_PATH: github.com/gohugo-ananke/ananke/v2
  ISSUE_LABELS: status:blocked,prio:critical

jobs:
  update-ananke:
    name: Update Ananke release
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          fetch-depth: 0
          submodules: recursive
          persist-credentials: false
          token: ${{ github.token }}

      - name: Configure Git user
        shell: bash
        run: |
          set -Eeuo pipefail

          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

      - name: Detect latest Ananke release tag
        id: ananke
        shell: bash
        env:
          GH_TOKEN: ${{ github.token }}
          ANANKE_REPOSITORY: ${{ env.ANANKE_REPOSITORY }}
        run: |
          set -Eeuo pipefail

          latest_tag="$(
            gh api --paginate "repos/${ANANKE_REPOSITORY}/tags" \
              --jq '.[].name' \
              | grep -E '^v[0-9]+(\.[0-9]+){2}$' \
              | sort -V \
              | tail -n 1
          )"

          if [[ -z "${latest_tag}" ]]; then
            echo "::error::Could not detect latest Ananke release tag."
            exit 1
          fi

          {
            echo "version=${latest_tag}"
            echo "release_url=https://github.com/${ANANKE_REPOSITORY}/releases/tag/${latest_tag}"
          } >> "${GITHUB_OUTPUT}"

          echo "Latest Ananke tag: ${latest_tag}"

      - name: Detect current Ananke version
        id: current
        shell: bash
        env:
          ANANKE_MODULE_PATH: ${{ env.ANANKE_MODULE_PATH }}
        run: |
          set -Eeuo pipefail

          mode="unknown"
          current_version=""

          if [[ -f "go.mod" ]] && grep -q "${ANANKE_MODULE_PATH}" go.mod; then
            mode="hugo-module"
            current_version="$(
              go list -m -f '{{.Version}}' "${ANANKE_MODULE_PATH}" 2>/dev/null || true
            )"
          elif [[ -d "themes/ananke/.git" || -f "themes/ananke/.git" ]]; then
            mode="git-submodule"

            git submodule update --init --recursive themes/ananke

            current_version="$(
              git -C themes/ananke describe --tags --exact-match 2>/dev/null \
                || git -C themes/ananke describe --tags --abbrev=0 2>/dev/null \
                || true
            )"
          fi

          if [[ "${mode}" == "unknown" ]]; then
            echo "::error::Could not detect whether this repository uses Ananke as Hugo Module or Git submodule."
            exit 1
          fi

          {
            echo "mode=${mode}"
            echo "version=${current_version}"
          } >> "${GITHUB_OUTPUT}"

          echo "Template mode: ${mode}"
          echo "Current Ananke version: ${current_version:-<unknown>}"

      - name: Skip unchanged release
        if: steps.current.outputs.version == steps.ananke.outputs.version && github.event_name != 'workflow_dispatch'
        shell: bash
        run: |
          echo "Ananke ${{ steps.ananke.outputs.version }} is already configured. Nothing to update."

      - name: Prepare latest Hugo
        if: steps.current.outputs.version != steps.ananke.outputs.version || github.event_name == 'workflow_dispatch'
        shell: bash
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          set -Eeuo pipefail

          latest_json="$(gh api repos/gohugoio/hugo/releases/latest)"
          hugo_version="$(jq -r '.tag_name' <<< "${latest_json}")"

          if [[ -z "${hugo_version}" || "${hugo_version}" == "null" ]]; then
            echo "::error::Could not detect latest Hugo release."
            exit 1
          fi

          asset_name="hugo_${hugo_version#v}_linux-amd64.tar.gz"

          asset_url="$(
            jq -r --arg asset_name "${asset_name}" '
              .assets[]
              | select(.name == $asset_name)
              | .browser_download_url
            ' <<< "${latest_json}"
          )"

          if [[ -z "${asset_url}" || "${asset_url}" == "null" ]]; then
            echo "::error::Could not find Hugo asset: ${asset_name}"
            exit 1
          fi

          mkdir -p "${RUNNER_TEMP}/hugo"

          curl --fail --location --silent --show-error \
            --output "${RUNNER_TEMP}/hugo/hugo.tar.gz" \
            "${asset_url}"

          tar -xzf "${RUNNER_TEMP}/hugo/hugo.tar.gz" -C "${RUNNER_TEMP}/hugo"
          chmod +x "${RUNNER_TEMP}/hugo/hugo"

          echo "${RUNNER_TEMP}/hugo" >> "${GITHUB_PATH}"

      - name: Verify runtime tools
        if: steps.current.outputs.version != steps.ananke.outputs.version || github.event_name == 'workflow_dispatch'
        shell: bash
        run: |
          set -Eeuo pipefail

          node --version
          npm --version
          git --version
          hugo version

          if [[ "${{ steps.current.outputs.mode }}" == "hugo-module" ]]; then
            go version
          fi

      - name: Run Ananke update
        id: update
        if: steps.current.outputs.version != steps.ananke.outputs.version || github.event_name == 'workflow_dispatch'
        shell: bash
        run: |
          set +e

          log_file="${RUNNER_TEMP}/ananke-update.log"
          exit_code_file="${RUNNER_TEMP}/ananke-update-exit-code.txt"

          {
            echo "Repository: ${GITHUB_REPOSITORY}"
            echo "Workflow run: ${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}"
            echo "Template mode: ${{ steps.current.outputs.mode }}"
            echo "Previous Ananke version: ${{ steps.current.outputs.version }}"
            echo "Target Ananke version: ${{ steps.ananke.outputs.version }}"
            echo "Command: npm run update"
            echo
            echo "----- update output -----"

            npm run update
            update_exit_code="$?"

            echo "${update_exit_code}" > "${exit_code_file}"

            echo "----- end update output -----"
          } 2>&1 | tee "${log_file}"

          tee_exit_code="${PIPESTATUS[1]}"

          if [[ "${tee_exit_code}" -ne 0 ]]; then
            echo "::error::Failed to write update output log."
            exit "${tee_exit_code}"
          fi

          if [[ ! -f "${exit_code_file}" ]]; then
            echo "::error::Update command did not run to completion. No exit code was captured."
            exit 1
          fi

          exit_code="$(cat "${exit_code_file}")"

          {
            echo "exit_code=${exit_code}"
            echo "log_file=${log_file}"
          } >> "${GITHUB_OUTPUT}"

          exit 0

      - name: Commit update
        id: commit
        if: >-
          (steps.current.outputs.version != steps.ananke.outputs.version || github.event_name == 'workflow_dispatch') &&
          steps.update.outputs.exit_code == '0'
        shell: bash
        env:
          GITHUB_TOKEN: ${{ github.token }}
        run: |
          set -Eeuo pipefail

          if [[ "${{ steps.current.outputs.mode }}" == "hugo-module" ]]; then
            git add go.mod go.sum
          elif [[ "${{ steps.current.outputs.mode }}" == "git-submodule" ]]; then
            git add themes/ananke
          else
            echo "::error::Unknown template mode: ${{ steps.current.outputs.mode }}"
            exit 1
          fi

          if git diff --quiet && git diff --cached --quiet; then
            echo "changed=false" >> "${GITHUB_OUTPUT}"
            echo "No repository changes after npm run update."
            exit 0
          fi

          git status --short

          git commit -m "chore(update): upgrade to Ananke version ${{ steps.ananke.outputs.version }}"
          git push "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" HEAD:${GITHUB_REF_NAME}

          echo "changed=true" >> "${GITHUB_OUTPUT}"

      - name: Create or update failure issue
        if: >-
          (steps.current.outputs.version != steps.ananke.outputs.version || github.event_name == 'workflow_dispatch') &&
          steps.update.outputs.exit_code != '0'
        shell: bash
        env:
          GH_TOKEN: ${{ secrets.ANANKE_ISSUE_TOKEN }}
          TARGET_ISSUE_REPOSITORY: ${{ env.TARGET_ISSUE_REPOSITORY }}
          ISSUE_LABELS: ${{ env.ISSUE_LABELS }}
          SOURCE_REPOSITORY: ${{ github.repository }}
          SOURCE_REPOSITORY_URL: ${{ github.server_url }}/${{ github.repository }}
          WORKFLOW_RUN_URL: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
          ANANKE_VERSION: ${{ steps.ananke.outputs.version }}
          ANANKE_RELEASE_URL: ${{ steps.ananke.outputs.release_url }}
          PREVIOUS_ANANKE_VERSION: ${{ steps.current.outputs.version }}
          TEMPLATE_MODE: ${{ steps.current.outputs.mode }}
          EXIT_CODE: ${{ steps.update.outputs.exit_code }}
          LOG_FILE: ${{ steps.update.outputs.log_file }}
        run: |
          set -Eeuo pipefail

          if [[ -z "${GH_TOKEN:-}" ]]; then
            echo "::error::Missing secret ANANKE_ISSUE_TOKEN. This token needs issue write access to ${TARGET_ISSUE_REPOSITORY}."
            exit 1
          fi

          repo_name="${SOURCE_REPOSITORY##*/}"
          title="failure: upgrade ${repo_name} to Ananke ${ANANKE_VERSION}"
          body_file="${RUNNER_TEMP}/ananke-update-issue.md"

          {
            echo "The Ananke template upgrade failed in [\`${SOURCE_REPOSITORY}\`](${SOURCE_REPOSITORY_URL})."
            echo
            echo "- Source repository: [\`${SOURCE_REPOSITORY}\`](${SOURCE_REPOSITORY_URL})"
            echo "- Template mode: \`${TEMPLATE_MODE}\`"
            echo "- Previous Ananke version: \`${PREVIOUS_ANANKE_VERSION:-<unknown>}\`"
            echo "- Target Ananke version: [\`${ANANKE_VERSION}\`](${ANANKE_RELEASE_URL})"
            echo "- Exit code: \`${EXIT_CODE}\`"
            echo "- Workflow run: ${WORKFLOW_RUN_URL}"
            echo
            echo "## Full CLI output"
            echo
            echo '```text'
            cat "${LOG_FILE}"
            echo '```'
          } > "${body_file}"

          existing_issue_number="$(
            gh issue list \
              --repo "${TARGET_ISSUE_REPOSITORY}" \
              --state open \
              --search "${title} in:title" \
              --json number,title \
              --jq ".[] | select(.title == \"${title}\") | .number" \
              | head -n 1
          )"

          label_args=()

          if [[ -n "${ISSUE_LABELS}" ]]; then
            label_args=(--label "${ISSUE_LABELS}")
          fi

          if [[ -n "${existing_issue_number}" ]]; then
            edit_args=(
              issue edit "${existing_issue_number}"
              --repo "${TARGET_ISSUE_REPOSITORY}"
              --body-file "${body_file}"
            )

            if [[ -n "${ISSUE_LABELS}" ]]; then
              edit_args+=(--add-label "${ISSUE_LABELS}")
            fi

            gh "${edit_args[@]}"
          else
            gh issue create \
              --repo "${TARGET_ISSUE_REPOSITORY}" \
              --title "${title}" \
              --body-file "${body_file}" \
              "${label_args[@]}"
          fi

      - name: Fail workflow after reporting issue
        if: >-
          (steps.current.outputs.version != steps.ananke.outputs.version || github.event_name == 'workflow_dispatch') &&
          steps.update.outputs.exit_code != '0'
        shell: bash
        run: |
          echo "::error::Ananke upgrade failed and was reported to gohugo-ananke/ananke."
          exit 1
````

## Step-by-step walkthrough

### 1. The workflow trigger

The workflow runs manually and on a schedule:

```yaml
on:
  workflow_dispatch:
  schedule:
    - cron: "40 3 * * *"
```

The scheduled run happens daily.

This does not mean the repository is changed daily. The workflow first checks whether the latest Ananke tag is already in use. If it is, the scheduled run exits without updating anything.

Manual runs are always useful for testing, so they are allowed to continue through the update path.

### 2. Permissions

The workflow needs write access to the current repository contents:

```yaml
permissions:
  contents: write
```

This is required because the workflow commits and pushes changes to the template repository.

This permission does not give the workflow permission to create issues in `gohugo-ananke/ananke`. That is handled by the separate `ANANKE_ISSUE_TOKEN` secret.

### 3. Concurrency

The workflow has a concurrency group:

```yaml
concurrency:
  group: ananke-release-update
  cancel-in-progress: false
```

This prevents overlapping update attempts in the same repository.

`cancel-in-progress: false` is the safer choice here. If one run is already updating the dependency, a second run should wait instead of cancelling the first one halfway through.

### 4. Shared environment values

The environment block defines the central knobs:

```yaml
env:
  TARGET_ISSUE_REPOSITORY: gohugo-ananke/ananke
  ANANKE_REPOSITORY: gohugo-ananke/ananke
  ANANKE_MODULE_PATH: github.com/gohugo-ananke/ananke/v2
  ISSUE_LABELS: status:blocked,prio:critical
```

`TARGET_ISSUE_REPOSITORY` is where failure issues are created.

`ANANKE_REPOSITORY` is where tags are checked.

`ANANKE_MODULE_PATH` is used to recognise the Hugo Module template.

`ISSUE_LABELS` defines labels added to failure reports. These labels must exist in the target repository if you want issue creation to succeed reliably.

### 5. Checkout

The checkout step fetches the repository, including submodules:

```yaml
with:
  fetch-depth: 0
  submodules: recursive
  persist-credentials: false
  token: ${{ github.token }}
```

This is deliberately not the minimal checkout.

The workflow may need full Git information, and the submodule template needs recursive submodule checkout.

`persist-credentials: false` means the token is not left in the local Git configuration. That is why the push later uses an explicit tokenised remote URL.

### 6. Git user configuration

The workflow commits as the GitHub Actions bot:

```bash
git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
```

This makes automated commits clearly identifiable.

### 7. Latest Ananke tag detection

The workflow uses the GitHub CLI to read Ananke tags:

```bash
gh api --paginate "repos/${ANANKE_REPOSITORY}/tags"
```

It then extracts tag names, filters semantic version tags, sorts them, and takes the newest one:

```bash
--jq '.[].name' \
| grep -E '^v[0-9]+(\.[0-9]+){2}$' \
| sort -V \
| tail -n 1
```

The result is written to `GITHUB_OUTPUT`:

```bash
{
  echo "version=${latest_tag}"
  echo "release_url=https://github.com/${ANANKE_REPOSITORY}/releases/tag/${latest_tag}"
} >> "${GITHUB_OUTPUT}"
```

Later steps can reference this as:

```yaml
${{ steps.ananke.outputs.version }}
```

### 8. Current version detection

The workflow then detects how the current template consumes Ananke.

For Hugo Modules:

```bash
if [[ -f "go.mod" ]] && grep -q "${ANANKE_MODULE_PATH}" go.mod; then
  mode="hugo-module"
  current_version="$(
    go list -m -f '{{.Version}}' "${ANANKE_MODULE_PATH}" 2>/dev/null || true
  )"
```

For Git submodules:

```bash
elif [[ -d "themes/ananke/.git" || -f "themes/ananke/.git" ]]; then
  mode="git-submodule"

  git submodule update --init --recursive themes/ananke

  current_version="$(
    git -C themes/ananke describe --tags --exact-match 2>/dev/null \
      || git -C themes/ananke describe --tags --abbrev=0 2>/dev/null \
      || true
  )"
```

The detected mode controls what files are staged later.

### 9. Update skip

The workflow skips normal scheduled work when the current version already matches the latest tag:

```yaml
if: steps.current.outputs.version == steps.ananke.outputs.version && github.event_name != 'workflow_dispatch'
```

This prevents noisy commits and unnecessary failure reports.

### 10. Hugo preparation

The update script needs Hugo. Rather than relying on whatever happens to be installed on the runner, the workflow downloads the latest Hugo release.

The workflow uses the standard non-extended Linux AMD64 asset:

```bash
asset_name="hugo_${hugo_version#v}_linux-amd64.tar.gz"
```

Then it downloads and exposes the binary through `GITHUB_PATH`:

```bash
echo "${RUNNER_TEMP}/hugo" >> "${GITHUB_PATH}"
```

If the template update ever requires Hugo Extended, this asset name is the line to change.

### 11. Runtime verification

The workflow prints versions for the relevant tools:

```bash
node --version
npm --version
git --version
hugo version
```

For the Hugo Module template, it also checks Go:

```bash
if [[ "${{ steps.current.outputs.mode }}" == "hugo-module" ]]; then
  go version
fi
```

This is a small but useful debugging step. When an update fails, the logs show the runtime context.

### 12. Running the update

The update step runs:

```bash
npm run update
```

It captures output into a log file:

```bash
log_file="${RUNNER_TEMP}/ananke-update.log"
```

It also captures the exit code separately:

```bash
exit_code_file="${RUNNER_TEMP}/ananke-update-exit-code.txt"
```

The step itself exits with `0` even when `npm run update` fails:

```bash
exit 0
```

That is intentional.

The workflow needs to continue into the issue-reporting step. If this step failed immediately, the issue creation step would be skipped unless every later condition used `failure()` carefully.

Instead, the update result is stored in step outputs:

```bash
{
  echo "exit_code=${exit_code}"
  echo "log_file=${log_file}"
} >> "${GITHUB_OUTPUT}"
```

The later steps decide what to do with that result.

### 13. Staging only expected files

The commit step stages only expected files.

For Hugo Modules:

```bash
git add go.mod go.sum
```

For Git submodules:

```bash
git add themes/ananke
```

This is better than:

```bash
git add --all
```

because it prevents accidental commits.

If `npm run update` changes something unexpected, the workflow will not automatically commit it. That is usually the right behaviour for dependency automation.

### 14. No-change handling

After staging, the workflow checks whether there is anything to commit:

```bash
if git diff --quiet && git diff --cached --quiet; then
  echo "changed=false" >> "${GITHUB_OUTPUT}"
  echo "No repository changes after npm run update."
  exit 0
fi
```

This is useful for edge cases:

* the tag check says an update should happen, but the update command resolves to the same state
* a manual workflow run is executed without a real dependency change
* the repository is already current but version detection was incomplete

A no-change run is not a failure.

### 15. Commit and push

The commit uses the required message:

```bash
git commit -m "chore(update): upgrade to Ananke version ${{ steps.ananke.outputs.version }}"
```

The push uses explicit credentials because checkout did not persist them:

```bash
git push "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" HEAD:${GITHUB_REF_NAME}
```

This keeps authentication local to the push step.

### 16. Failure issue creation

When `npm run update` fails, the workflow builds an issue body containing the full update log:

```bash
cat "${LOG_FILE}"
```

The title is deterministic:

```bash
title="failure: upgrade ${repo_name} to Ananke ${ANANKE_VERSION}"
```

Before creating a new issue, it checks whether an open one already exists:

```bash
existing_issue_number="$(
  gh issue list \
    --repo "${TARGET_ISSUE_REPOSITORY}" \
    --state open \
    --search "${title} in:title" \
    --json number,title \
    --jq ".[] | select(.title == \"${title}\") | .number" \
    | head -n 1
)"
```

If it exists, the workflow updates the issue body.

If it does not exist, the workflow creates a new issue.

This keeps repeated runs from creating a pile of duplicate issues.

### 17. Failing after reporting

After the issue has been created or updated, the workflow fails deliberately:

```bash
echo "::error::Ananke upgrade failed and was reported to gohugo-ananke/ananke."
exit 1
```

This gives the workflow run the correct status.

A failed update should show as failed in GitHub Actions, but the failure should also be visible as an issue in the Ananke repository.

## What counts as success

A scheduled run is successful when one of these things happens:

1. The template already uses the latest Ananke tag and the workflow skips.
2. The template updates successfully, commits the expected files, and pushes the commit.
3. The update command succeeds but produces no changes.

The third case can happen during manual runs or if the version detection does not exactly match the update command's result.

## What counts as failure

The workflow reports a failure issue when:

```text
npm run update
```

returns a non-zero exit code.

Typical causes include:

* Hugo Module resolution failure
* Go module failure
* Git submodule update failure
* missing or unreachable repository
* malformed configuration
* incompatible Ananke release
* missing Hugo binary
* broken update script
* network failure during the update

The workflow does not report an issue when there are simply no changes to commit.

No changes are not an error.

## What gets committed

The workflow does not commit all changed files.

It commits only the expected Ananke update artefacts.

For `template-hugo-mod`:

```text
go.mod
go.sum
```

For `template-git-submod`:

```text
themes/ananke
```

This is deliberate.

A broad `git add --all` is convenient, but it is the wrong default for this workflow. Dependency automation should be narrow, predictable, and boring.

## Required repository setup

Each template repository needs the workflow file at:

```text
.github/workflows/ananke-release-update.yaml
```

Each repository also needs an `npm run update` script.

For the Hugo Module template, the script should update only the module files:

```json
{
  "scripts": {
    "update": "hugo mod get -u ./... && hugo mod tidy"
  }
}
```

For the Git submodule template, the script should update only the submodule checkout:

```json
{
  "scripts": {
    "update": "git submodule update --remote --merge"
  }
}
```

The scripts should not commit.

The workflow owns commits.

## Required secret

The workflow needs this secret in both template repositories:

```text
ANANKE_ISSUE_TOKEN
```

This token is used only for writing issues to:

```text
gohugo-ananke/ananke
```

The token should have issue write access to that repository.

If the secret is missing, the workflow cannot report failures to the Ananke repository and will fail with a clear error.

## Why this design is useful

This workflow gives the Ananke templates a maintenance loop that is both automatic and explicit.

It does not silently mutate dependencies.

It does not hide failures in logs.

It does not commit random workspace changes.

It does not rely on a person checking tags by hand.

The two template repositories remain separate examples of two installation strategies, but they share the same release tracking behaviour.

That is the important part.

Ananke can release a new tag. The templates notice. The templates update themselves. If something breaks, the breakage is reported in the repository where maintainers can act on it.

This is exactly the kind of automation I like: small surface area, visible failure mode, predictable commits, and no magic hiding in the corners.
