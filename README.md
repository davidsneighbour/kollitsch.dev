# kollitsch.de

This is the [Hugo](https://gohugo.io/) setup and content for [kollitsch.de](https://kollitsch.de/). The site is hosted on Netlify and most of this repository is set up to work on Netlify and use it's features (like minification).

Note: we will check out Cloudflare Pages soon. More bandwidth and more build time (unlimited).

## setup and update algolia search (might not work)

- copy `.env.sample` to `.env`
- fill in the API information from your [Algolia-Dashboard](https://www.algolia.com/account/api-keys/all) &gt; API keys

## Publishing

- setup signed tags with `npm config set sign-git-tag true`
- create patch release with `npm run release`
- create minor release with `npm run release:minor`
- create major release with `npm run release:major`

## Local Development Environment

### pre-commit

If you want then install and setup `pre-commit` to check commits for quality and security. This requires Python to be installed. Then run the following commands to set up `pre-commit` locally:

```shell
pip install pre-commit
pre-commit install
```

Other `pre-commit` commands are:

```shell
pre-commit run --all-files # check rules on all files
pre-commit autoupdate # update repositories
pre-commit gc # garbage collection
```

## NPM scripts

### Installation and Setup

```shell
npm install
```

### Development server

Add a file named `.env` to the root of your repository containing your local setup:

```ini
IP=192.168.1.201
PORT=1313
ALGOLIA_APP_ID=
ALGOLIA_API_KEY=
ALGOLIA_INDEX_NAME=
```

Do NOT commit this file to the repository.

To run the development server run

```shell
npm run server
```

### Build scripts

This repository is currently optimised for Netlify. To create a local copy of the website run the following command:

```shell
./bin/netlify.sh
```

## HeroIcons

- [Github Repository](https://github.com/tailwindlabs/heroicons)
- [Website with icon overview](https://heroicons.com/)

## Publishing on Netlify

- running `npm run release` will create a new tag in the `main` branch and release on Netlify.

## Design Paradigms for this theme

- Margins are applied to the bottom of items.
- This is a mobile-first design.
- No layouts inside of layouts (container>row>col>row>col) if not explicitly required.
- Do not re-invent the wheel. Reuse, recycle.

## Repository Setup

- To enable step debug logging for the Github Workflows, you must set the following secret in the repository that contains the workflow: ACTIONS_STEP_DEBUG to true.
