---
title: How to Pin Versions on NPM During Installation
description: "How to save exact npm package versions"
date: 2025-06-28T02:01:18.324Z
draft: true
---

I always (well, for a couple of years now) use exact versions in my package.json. This allows me to have more control over my versions and with tools like Renovate and Dependabot this is easier than ever to maintain.

What is an exact version?

* "react": "^16.0.0" // carat: allow 16.1.0
* "react": "~16.0.0" // tilde: allow 16.0.1
* "react": "16.0.0" // exact: only 16.0.0

Renovate has [a great post on why you would do this dependency-pinning](https://docs.renovatebot.com/dependency-pinning/). Ultimately, it's a personal decision and I am used to do this now.

There are two ways to force NPM to save exact versions in your package.json.

1. Every time a package is installed

   ```bash
   npm install --save --save-exact react
   ```

2. Always, by setting a default in our config

   ```bash
   npm config set save-exact=true
   ```

   This adds `save-exact=true` to your `.npmrc`.
