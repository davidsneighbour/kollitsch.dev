---
title: "Trusted publishing for npm packages with GitHub Actions"
description: "Trusted publishing for npm packages with GitHub Actions"
summary: ""
draft: true
tags: ["npm", "trusted-publishing", "github-actions", "release-it"]
date: 2026-06-10T03:51:52.404Z
---

Publishing npm packages from CI used to mean creating a long-lived npm automation token, storing it as a GitHub Actions secret, and hoping it never leaked. That works, but it is not ideal. A token can be copied, logged, forgotten, reused from the wrong place, or left active long after the workflow has changed.

npm trusted publishing fixes that by letting npm trust a specific CI workflow instead of a stored token. For GitHub Actions, npm uses OpenID Connect (OIDC): the workflow receives a short-lived identity token from GitHub, npm verifies that the token came from the configured repository and workflow, and the package is published without `NODE_AUTH_TOKEN`.

There is one practical catch: the npm package page must exist before you can configure trusted publishing for it. For new packages, that means the very first publish still has to be done manually. After that, all proper releases can go through the trusted workflow.

## The release model

The setup I use splits releases into two separate responsibilities:

1. `release-it` runs locally and prepares the release.
2. GitHub Actions publishes the package when the release tag is pushed.

That means the local release process handles:

* updating `package.json`
* updating the lockfile, if needed
* updating `CHANGELOG.md`
* committing the release
* creating the version tag
* pushing the commit and tag

The GitHub workflow handles only the actual npm publish.

This keeps npm credentials out of the local release configuration and out of GitHub secrets. The workflow receives `id-token: write`, npm verifies that the workflow is trusted, and the package is published from the tag.

npm’s trusted publishing documentation states that trusted publishing uses OIDC and removes the need for long-lived npm tokens. It currently requires npm CLI `11.5.1` or newer and Node.js `22.14.0` or newer. For GitHub Actions, npm also requires the workflow filename to exist under `.github/workflows/`, and the workflow needs `id-token: write`.

## Step 1: Publish a first pre-release manually

For packages that do not exist on npm yet, start with a small pre-release or setup version. Do not use `1.0.0` for this first publish. I usually use something like `0.1.0`.

This first publish exists only to create the package page on npmjs.com so that trusted publishing can be configured.

Before publishing, make sure the package is named correctly:

```json
{
  "name": "@dnbhq/release-config",
  "version": "0.1.0",
  "type": "module"
}
```

Run the local checks:

```bash
npm install
npm run build
npm test
npm pack --dry-run
```

Then verify that you are logged in to the correct npm account:

```bash
npm whoami
```

For scoped public packages, publish explicitly with public access:

```bash
npm publish --access public
```

The `--access public` flag matters for scoped packages. npm documents scoped packages separately from unscoped packages, and public scoped packages must be published with public access.

At this point the package exists on npm, but this first version is not the real release yet. It is the bootstrap version.

## Step 2: Add the GitHub Actions publish workflow

Add `.github/workflows/publish.yml` to the repository:

```yaml
name: Publish Package

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: read
  id-token: write

jobs:
  publish:
    name: Publish to npm
    runs-on: ubuntu-latest
    environment: npm

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: '24'
          registry-url: 'https://registry.npmjs.org'
          package-manager-cache: false

      - name: Install dependencies
        run: npm ci

      - name: Build package
        run: npm run build --if-present

      - name: Test package
        run: npm test --if-present

      - name: Publish package
        run: npm publish --access public
```

There is intentionally no `NODE_AUTH_TOKEN` here.

The important line is:

```yaml
id-token: write
```

That permission allows GitHub Actions to issue the OIDC token that npm verifies during publishing. npm’s own GitHub Actions example uses the same shape: checkout, setup-node with the npm registry, install, build, test, then `npm publish`.

The `environment: npm` line is optional from npm’s side, but useful. It lets GitHub protect the publishing job with environment rules later, such as required reviewers.

## Step 3: Configure trusted publishing on npm

After the bootstrap package exists, open the package on npmjs.com and go to the package settings.

Add a trusted publisher with these values:

```text
Publisher: GitHub Actions
Organization or user: dnbhq
Repository: release-config
Workflow filename: publish.yml
Environment name: npm
Allowed actions: npm publish
```

The workflow filename should be just `publish.yml`, not `.github/workflows/publish.yml`.

npm’s trusted publisher configuration for GitHub Actions requires the GitHub owner, repository name, workflow filename, and at least one allowed action. The workflow file must exist in `.github/workflows/`.

Once this is saved, npm will accept publishes from that exact workflow.

## Step 4: Keep release-it local and disable npm publishing there

`release-it` should not publish to npm directly in this setup. It should prepare the release and push the tag. The tag is what triggers the GitHub workflow.

A minimal `.release-it.ts` looks like this:

```ts
import type { Config } from 'release-it';
import { createReleaseConfig } from '@dnbhq/release-config';

const config: Config = createReleaseConfig({
  npm: {
    publish: false,
  },
});

export default config;
```

The important part is:

```ts
npm: {
  publish: false,
}
```

That prevents the local release command from trying to publish. Publishing belongs to GitHub Actions now.

## Step 5: Publish the real first release

After the bootstrap version exists and trusted publishing is configured, publish the real first release as `1.0.0`.

Run the release locally:

```bash
npx release-it --release-version 1.0.0
```

Depending on the release-it configuration, this should update the version, update the changelog, create a release commit, create the `v1.0.0` tag, and push both.

If the release command does not push automatically, push manually:

```bash
git push origin main
git push origin v1.0.0
```

When the `v1.0.0` tag reaches GitHub, `publish.yml` runs. The workflow builds and tests the package, npm verifies the trusted publisher identity through OIDC, and the package is published without an npm token.

## Why the first pre-release is necessary

Trusted publishing is configured on a package page, not on a package name that does not exist yet. That means the package must be published once before npm can attach the trusted publisher configuration to it.

This creates a simple two-stage model:

```text
0.1.0  -> manual bootstrap publish
1.0.0  -> first trusted publishing release
```

The bootstrap version should be treated as setup scaffolding. It creates the npm package page, proves that the package name and access level are correct, and unlocks the trusted publishing settings.

The real release happens afterwards.

## Final checklist

Before the manual bootstrap publish:

```bash
npm whoami
npm install
npm run build
npm test
npm pack --dry-run
npm publish --access public
```

Before the first trusted release:

```bash
# Confirm publish.yml exists on main
ls .github/workflows/publish.yml

# Confirm npm trusted publisher is configured:
# owner: dnbhq
# repo: release-config
# workflow filename: publish.yml
# environment: npm
# allowed action: npm publish

npx release-it --release-version 1.0.0
```

After the tag is pushed:

```bash
# Watch the GitHub Actions publish workflow.
# Then verify the package version on npm.
npm view @dnbhq/release-config version
```

## The important rule

Do not mix the two publishing models.

Either publish with a local npm token, or publish with trusted publishing from CI. For this setup, the local machine creates the release and the GitHub workflow publishes it.

The only exception is the first manual bootstrap publish for packages that do not exist on npm yet. After that, remove npm publishing from the local release path and let the trusted workflow own it.
