This is the website setup and content for [kollitsch.dev](https://kollitsch.dev/). The site is currently hosted on Netlify and built via GoHugo and most of this repository is set up to work on Netlify and use its features.

Note: we will check out Cloudflare Pages soon. More bandwidth and more build time (unlimited).

**Content**

- [Setup](#setup)
  - [General Notes](#general-notes)
  - [Requirements](#requirements)
  - [Setup development environment](#setup-development-environment)
  - [pre-commit](#pre-commit)
- [Development](#development)
  - [Development server](#development-server)
- [Releasing](#releasing)
- [Deployment](#deployment)
  - [Publishing on Netlify](#publishing-on-netlify)
- [Theme](#theme)
  - [Design paradigms for the used theme](#design-paradigms-for-the-used-theme)
- [Advanced setup](#advanced-setup)

## Setup

### General Notes

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

### Requirements

- [Hugo](https://gohugo.io/)
- [Node.js](https://nodejs.org/)
- [Bash](https://www.gnu.org/software/bash/) (Patrick loves Bash!)

### Setup development environment

- Copy `.env.sample` to `.env` and fill in the values. This will be used by scripts and build system for various tasks. You MUST NOT commit the `.env` file to the repository for obvious reasons. Take notes of your configuration data in something safe, like [Keybase](https://keybase.io/).
- To setup Algolia search fill in the API information from your [Algolia-Dashboard](https://www.algolia.com/account/api-keys/all) &gt; API keys.
- Run `npm install` to install all dependencies.
- Install and setup `pre-commit` if you intend to send commits to the repository. This will ensure that all commits adhere to the quality and security standards of this project.

  ```bash
  pip install pre-commit
  pre-commit install
  ```

- If you installed pre-commit and one of your commits won't "get through" due to some weird overzealous configuration, then you can always commit manually via `git commit --no-verify`. Use your brain on this one.

### pre-commit

If you want then install and setup `pre-commit` to check commits for quality and security. This requires Python to be installed. Then run the following commands to set up `pre-commit` locally:

```bash
pip install pre-commit
pre-commit install
```

Other `pre-commit` commands are:

```bash
pre-commit run blocklint --all-files # check specific hook on all files
pre-commit run --all-files # check rules on all files
pre-commit autoupdate # update repositories
pre-commit gc # garbage collection
```

## Development

### Development server

Make sure to have set `IP` and `PORT` for your local machine in `.env`. `IP` is badly named, as it could also be a hostname (without protocol in the beginning). If that triggers your OCD then open an issue or a PR in either this repo or over at [davidsneighbour/hugo-bin](https://github.com/davidsneighbour/hugo-bin/).

```ini
IP=192.168.1.201
PORT=1313
```

This will be used to configure the Hugo server so that you will be able to access the server from other machines (and mobile devices). Again: You MUST NOT commit this file to the repository as it might contain private information.

To start the development server run `npm run server`. This will run the Hugo server with more or less paranoid settings (show translation issues, template issues, be verbose, debug, the more the better). Running just `hugo server` will run Hugo on [localhost:1313](http://localhost:1313).

## Releasing

- Setup signed tags with `npm config set sign-git-tag true`
- Create patch release with `npm run release` or `npm run release:patch`
- Create minor release with `npm run release:minor`
- Create major release with `npm run release:major`

## Deployment

### Publishing on Netlify

This repository is currently optimised for Netlify. To create a local copy of the website run `npm run build` or `./bin/netlify/build`.

- running `npm run release` will create a new tag in the `main` branch and release on Netlify.

## Theme

Currently the theme is integrated into the repository. I plan to release the theme as [Dark Skies](https://github.com/davidsneighbour/hugo-dark-skies) in a bit.

### Design paradigms for the used theme

- Spacing is applied from top to bottom, meaning that margins are applied to the bottom of items.
- Responsive design principles are applied as mobile-first.
- No rows inside of rows (container>row>col>row>col) if this is not explicitly required.
- Do not re-invent the wheel. Reuse, recycle.

## Advanced setup

- To enable step debug logging for the Github Workflows, you must set the following secret in the repository that contains the workflow: `ACTIONS_STEP_DEBUG` to `true`.
