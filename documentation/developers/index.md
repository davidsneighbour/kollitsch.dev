---
title: "Developernotes"
date: 2023-12-08T15:39:08+07:00
weight: 100
---

## Setup

Install this repository and all submodules via `git clone --recurse-submodules https://gitlab.com/davidsneighbour/kollitsch.dev.git`. If you have cloned the repository before reading this, run `git submodule update --init --recursive` to get the submodules up-to-date.

### Prepare the development environment

- **[Hugo](https://gohugo.io/)** ([Installation instructions](https://gohugo.io/getting-started/installing/))
- **[Node.js](https://nodejs.org/)** ([I recommend using NVM](https://github.com/nvm-sh/nvm) to install Node.js)
- **[Bash](https://www.gnu.org/software/bash/)** (available on any self-respecting operating system)
- **[Shellcheck](https://github.com/koalaman/shellcheck)** (`snap install -channel=edge shellcheck`)
- Running **`npm install`** will add all set-up requirements
- Copy `.env.sample` to **`.env`** and specify the values used by scripts and the build systems for various tasks. You **MUST NOT** commit the `.env` file to the repository for privacy and security reasons. Take notes of your configuration data somewhere safe, like in [Keybase](https://keybase.io) or a password manager.
- Setup signed tags with `npm config set sign-git-tag true`

### Advanced setup steps

- **GitHub Actions:** To enable the step to debug logging for the GitHub Workflows, you must set the following secret in the repository that contains the workflow: `ACTIONS_STEP_DEBUG` to `true`. You find the settings page by following `Settings > Secrets > Actions` from the repositories home page.

### Pre-Commit

Install and set up `pre-commit` to lint commits for quality and security. Python is required for this. Then run the following commands to set up `pre-commit` locally:

```bash
pip install pre-commit
pre-commit install
```

Other `pre-commit` commands are:
If you installed pre-commit and one of your commits won't "get through" due to some weird overzealous configuration, you can always commit manually via `git commit --no-verify`; use your brain on this one.

### SSL/TLS setup

Hugo introduced a new SSL feature in v0.113.0. The setup is still quite manual, but it's a start. To enable SSL/TLS, you need to do the following:

- install mkcert (see [mkcert](https://github.com/FiloSottile/mkcert))

  ```bash
  hugo server trust
  ```

## Development

### Dev Setup

Set `IP` and `PORT` for your local machine in `.env`. `IP` _MAY_ also be a hostname (without protocol).

```ini
IP=192.168.1.201
PORT=1313
```

This configures the Hugo server so you can access the site from other machines (and mobile devices) in your local network. Again: you _MUST NOT_ commit this file to any public code versioning system as it contains private information.

To start the development server, run `npm run server`, which runs the Hugo server with more or less paranoid settings (show translation issues, template issues, be verbose, debug, the more, the better). For example, running just `hugo server` will start Hugo on [localhost:1313](http://localhost:1313).

### Release

Sidenote: I use these scripts only if I want to create a new minor or major release of the website. All other "releases" are done when deploying the website (see [Deploy](#deploy)).

- Create patch release with `npm run release` or `npm run release:patch`
- Create minor release with `npm run release:minor`
- Create major release with `npm run release:major`

### Deploy

As noted, this repository is optimized for Netlify. To create a local copy of the website, run `npm run build` or `./bin/netlify/build`.

Running `npm run deploy` creates a new tag in the `main` branch and deploys the site on Netlify.

### Theme

The theme is part of this repository, mainly in the `layouts` folder.

#### Paradigms

- Spacing (margin and padding) is applied from top to bottom.
- We use responsive design principles with mobile-first.
  No unnecessary `row`s inside of `row`s (container>row>col>row>col) if this isn't explicitly required. It isn't needed anyway.
- Do re-use and recycle styles.

### Netlify setup

```bash
npm install netlify-cli -g && netlify login
netlify --telemetry-disable // shouldn't that be the default?
netlify init
netlify build
```

If any errors come up while running this, then fix them.
