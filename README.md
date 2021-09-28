# kollitsch.de

This is the [Hugo](https://gohugo.io) setup and content for kollitsch.de. The site is hosted on Netlify and most of this repository is set up to work on Netlify and use it's features (like minification).

Note: we will check out Cloudflare Pages soon. More bandwidth and more build time (unlimited).

## setup and update algolia search (might not work)

- copy `.env.sample` to `.env`
- fill in the info from [https://www.algolia.com/apps](https://www.algolia.com/apps) &gt; API keys
- run `npm install -g atomic-algolia` to install globally
- run `npm run algolia` whenever there are updates to the content

## Publishing

- setup signed tags with `npm config set sign-git-tag true`
- create patch release with `npm run release`
- create minor release with `npm run release:minor`
- create major release with `npm run release:major`

## Preparing Development Environment

- ...
