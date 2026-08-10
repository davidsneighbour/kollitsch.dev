---
fmContentType: blog
title: Fixing release-it changelog links for dotted GitHub repositories
description: How to fix release-it changelog links when a dotted GitHub repository name is truncated, and why explicit release configuration matters.
summary: A dotted GitHub repository name can confuse the release-it conventional changelog chain and generate links to the wrong repository. This post explains the bug, the dependency path involved, and the explicit release configuration that keeps changelog links correct.
draft: true
tags:
  - release-it
  - conventional-changelog
  - github
  - configuration
date: 2026-08-08
cover:
  type: image
  src: postimages/postimage-for-fixing-release-it-changelog-links-dotted-github-repos.jpg
  format:
    contenttype: jpg
    quality: 75
---

I ran into a small but annoying release automation bug on this site. The repository is called `davidsneighbour/kollitsch.dev`, but the generated changelog content suddenly started linking to `davidsneighbour/kollitsch` instead. No `.dev` anymore.

The broken URL is subtle enough that it is easy to miss during a release,
especially if the changelog is generated and pushed automatically. The
repository name still looks almost right. It is just missing the most important
four characters.

## The short version

If a GitHub repository name contains a dot, do not rely on release tooling to
infer the repository context from the Git remote. Set the changelog context and
URL formats explicitly.

This is the relevant part of my `.release-it.ts` configuration:

```ts
import { createReleaseConfig } from "@dnbhq/release-config";
import type { Config } from "release-it";

const REPOSITORY_URL = "https://github.com/davidsneighbour/kollitsch.dev";

const config = createReleaseConfig({
  scopes: {
    minorTypes: ["feat", "content", "prompt", "instructions", "skill"],
  },
});

const changelogPlugin = (config.plugins as Record<string, Record<string, unknown>>)[
  "@release-it/conventional-changelog"
];
const changelogPreset = changelogPlugin.preset as Record<string, unknown>;

changelogPlugin.context = {
  ...(changelogPlugin.context as Record<string, unknown> | undefined),
  host: "https://github.com",
  owner: "davidsneighbour",
  repository: "kollitsch.dev",
  repoUrl: REPOSITORY_URL,
};

changelogPlugin.preset = {
  ...changelogPreset,
  commitUrlFormat: `${REPOSITORY_URL}/commit/{{hash}}`,
  compareUrlFormat: `${REPOSITORY_URL}/compare/{{previousTag}}...{{currentTag}}`,
  issueUrlFormat: `${REPOSITORY_URL}/issues/{{id}}`,
  userUrlFormat: "https://github.com/{{user}}",
};

export default config as Config;
```

The important part is not just `repoUrl`. I set all of these:

* `host`
* `owner`
* `repository`
* `repoUrl`
* `commitUrlFormat`
* `compareUrlFormat`
* `issueUrlFormat`
* `userUrlFormat`

That may look a little redundant, but this is release configuration. Redundancy
is cheaper than a release note pointing at the wrong repository.

## The dependency path

The package I use directly is [`release-it`][release-it]. For conventional
commit based release notes, I use
[`@release-it/conventional-changelog`][release-it-changelog], published on npm
as [`@release-it/conventional-changelog`][release-it-changelog-npm].

That plugin says plainly that it is a wrapper around Conventional Changelog
packages. In the current dependency tree here, the path is:

* [`@release-it/conventional-changelog`][release-it-changelog]
* [`conventional-changelog`][conventional-changelog]
* [`@simple-libs/hosted-git-info`][hosted-git-info]

The public bug I hit is tracked at
[`release-it/conventional-changelog#153`][release-it-issue-153]. The lower-level
parser issue is tracked at [`simple-libs#51`][simple-libs-issue-51].

Locally, the behaviour is easy to reproduce. The SSH remote form loses `.dev`:

```text
git@github.com:davidsneighbour/kollitsch.dev.git
=> https://github.com/davidsneighbour/kollitsch
```

The HTTPS form keeps it:

```text
https://github.com/davidsneighbour/kollitsch.dev.git
=> https://github.com/davidsneighbour/kollitsch.dev
```

So the problem is not that my `package.json` had the wrong repository. It
already contained:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/davidsneighbour/kollitsch.dev.git"
  },
  "bugs": "https://github.com/davidsneighbour/kollitsch.dev/issues"
}
```

The generated release links still found a path back to inferred repository
context, and that inferred context was wrong.

## The maintenance part

This is where I want to be clear without being unfair.

Open source packages are often maintained by a very small number of people. That
is normal. It is also generous. Most of the tools we use every day exist because
somebody chose to spend unpaid or underpaid time making them work.

Release automation sits in a high-trust part of a project. It changes files,
creates tags, writes GitHub releases, comments on issues, and sometimes
publishes packages. For that kind of tooling, project shape matters.

The [`@release-it/conventional-changelog`][release-it-changelog-npm] package
currently presents as a narrow maintenance surface: the visible npm collaborator
list shows one collaborator, and the GitHub repository does not make an obvious
management model, maintainer group, or governance process visible from the
project front door. That does not make the package bad. It does mean I do not
want my release process to depend on implicit behaviour that crosses several
packages and one fragile repository-name parser.

The polite practical conclusion is simple: use the package, appreciate the work,
but make critical release metadata explicit in your own configuration.

## Why the explicit context fixes it

Conventional Changelog has to render several kinds of links:

* compare links between tags
* commit links
* issue references such as `#1841`
* user mentions

Those links are rendered from a mixture of preset options and context. If the
context is incomplete, some code paths can fall back to derived repository data.
That is fine when repository parsing is correct. It is not fine when the parser
treats a dotted repository name as if the dot started a suffix.

The fix therefore has two layers:

1. Tell the changelog renderer what repository it is in.
2. Tell the preset exactly how to format every link type.

Here is the solution again, stripped down to only the relevant configuration:

```ts
const REPOSITORY_URL = "https://github.com/davidsneighbour/kollitsch.dev";

changelogPlugin.context = {
  ...(changelogPlugin.context as Record<string, unknown> | undefined),
  host: "https://github.com",
  owner: "davidsneighbour",
  repository: "kollitsch.dev",
  repoUrl: REPOSITORY_URL,
};

changelogPlugin.preset = {
  ...changelogPreset,
  commitUrlFormat: `${REPOSITORY_URL}/commit/{{hash}}`,
  compareUrlFormat: `${REPOSITORY_URL}/compare/{{previousTag}}...{{currentTag}}`,
  issueUrlFormat: `${REPOSITORY_URL}/issues/{{id}}`,
  userUrlFormat: "https://github.com/{{user}}",
};
```

After that, the resolved plugin configuration contains the full repository name:

```json
{
  "context": {
    "host": "https://github.com",
    "owner": "davidsneighbour",
    "repository": "kollitsch.dev",
    "repoUrl": "https://github.com/davidsneighbour/kollitsch.dev"
  }
}
```

The existing generated [`CHANGELOG.md`][changelog] also needed a one-time
correction, because old generated links were already committed.

The fix for this site is in [`f86b5e3`][fix-commit], which closed
[`kollitsch.dev#1842`][fix-issue].

## The lesson

There are two separate lessons here.

The technical lesson is that dotted repository names are still edge cases in
parts of the JavaScript release tooling stack. If your repository is named like
a domain, test generated changelog output before trusting it.

The process lesson is that release automation should be boring and explicit. A
release config is not the place to be clever. If the correct repository URL
matters, write it down in the config in every format the toolchain accepts.

The tools can still do the useful work: calculating the bump, grouping commits,
updating the changelog, creating the release. They just do that work with less
room to invent the wrong repository.

[changelog]: https://github.com/davidsneighbour/kollitsch.dev/blob/main/CHANGELOG.md
[conventional-changelog]: https://github.com/conventional-changelog/conventional-changelog
[fix-commit]: https://github.com/davidsneighbour/kollitsch.dev/commit/f86b5e3bcab8aa489a9ec5c6219ab0d26cc3f1f3
[fix-issue]: https://github.com/davidsneighbour/kollitsch.dev/issues/1842
[hosted-git-info]: https://github.com/TrigenSoftware/simple-libs/tree/main/packages/hosted-git-info
[release-it]: https://github.com/release-it/release-it
[release-it-changelog]: https://github.com/release-it/conventional-changelog
[release-it-changelog-npm]: https://www.npmjs.com/package/@release-it/conventional-changelog
[release-it-issue-153]: https://github.com/release-it/conventional-changelog/issues/153
[simple-libs-issue-51]: https://github.com/TrigenSoftware/simple-libs/issues/51
