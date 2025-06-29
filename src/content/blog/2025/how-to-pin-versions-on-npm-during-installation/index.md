---
title: How to Pin Versions on NPM During Installation
description: "How to save exact npm package versions"
date: 2025-06-28T02:01:18.324Z
lastmod: "{{date}}"
type: blog
cover: ""
---


How to save exact npm package versions

#

npm
I've recently started using exact versions in my package.json. This allows me to have more control over my versions and with tools like Renovate this is easier than ever.

What is an exact version?
"react": "^16.0.0" // carat: allow 16.1.0
"react": "~16.0.0" // tilde: allow 16.0.1
"react": "16.0.0" // exact: only 16.0.0
Why
Renovate has great documentation on why you would do this dependency-pinning

How
There are two ways to force npm or yarn to save exact versions in your package.json.

1. Everytime you install a package
// npm
npm install --save --save-exact react

// yarn
yarn add --exact react
2. Set a default in your config
npm config set save-exact=true
This adds save-exact=true to your .npmrc
