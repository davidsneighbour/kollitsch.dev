This project is the website setup and content for [kollitsch.dev](https://kollitsch.dev/).

This site's infrastructure is as follows:

- **Domain Registration:** [Google](https://domains.google.com/)
- **Hosting:** [Netlify](https://netlify.com)
- **SSG Build:** [Hugo](https://gohugo.io)

Feel free to [open an issue](https://github.com/davidsneighbour/kollitsch.dev/issues/new?assignees=davidsneighbour&labels=state%3Aunconfirmed&template=custom.md&title=) to ask questions, discover undocumented details, or suggest improvements.

**Contents:**

- [General notes](#general-notes)
- [Setup](#setup)
	- [Prepare the development environment](#prepare-the-development-environment)
	- [Advanced setup steps](#advanced-setup-steps)
	- [Pre-Commit](#pre-commit)
- [Development](#development)
- [Release](#release)
- [Deploy](#deploy)
- [Theme](#theme)
	- [Paradigms](#paradigms)
- [Netlify setup](#netlify-setup)
- [Hooks (WIP)](#hooks-wip)
- [Front matter parameters](#front-matter-parameters)
	- [Layout options](#layout-options)
- [Linting](#linting)
	- [Vale (wording and grammar checks)](#vale-wording-and-grammar-checks)
	- [Markdownlint (markdown format checks)](#markdownlint-markdown-format-checks)
	- [Search (Algolia)](#search-algolia)
- [Troubleshooting](#troubleshooting)
	- [Inkscape](#inkscape)
- [License](#license)

# General notes

- The keywords MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).
- I am working on Ubuntu, meaning all code samples in this document are working on Ubuntu and any comparable (Debian-based) Linux system. If you use another operating system, you are on your own. I assume, though, that most tools, scripts, and procedures will work on other systems with the appropriate changes due to open-source usage.

# Setup

## Prepare the development environment

- **[Hugo](https://gohugo.io/)** ([Installation instructions](https://gohugo.io/getting-started/installing/))
- **[Node.js](https://nodejs.org/)** ([I recommend using NVM](https://github.com/nvm-sh/nvm
) to install Node.js)
- **[Bash](https://www.gnu.org/software/bash/)** (available on any self-respecting operating system)
- **[Shellcheck](https://github.com/koalaman/shellcheck)** (`snap install -channel=edge shellcheck`)
- Running **`npm install`** will add all set-up requirements
- Copy `.env.sample` to **`.env`** and fill in the values used by scripts and the build systems for various tasks. You **MUST NOT** commit the `.env` file to the repository for privacy and security reasons. Take notes of your configuration data somewhere safe, like in [Keybase](https://keybase.io) or a password manager.
- Setup signed tags with `npm config set sign-git-tag true`
- Run `npm install` to install all dependencies.

## Advanced setup steps

- **Github Actions:** To enable the step to debug logging for the GitHub Workflows, you must set the following secret in the repository that contains the workflow: `ACTIONS_STEP_DEBUG` to `true`. You find the settings page for this by following `Settings > Secrets > Actions` from the repositories home page.


## Pre-Commit
Install and set up `pre-commit` to lint commits for quality and security. Python is required for this. Then run the following commands to set up `pre-commit` locally:

```bash
pip install pre-commit
pre-commit install
```

Other `pre-commit` commands are:
If you installed pre-commit and one of your commits won't "get through" due to some weird overzealous configuration, then you can always commit manually via `git commit -no-verify`. So use your brain on this one.

# Development

Make sure to have set `IP` and `PORT` for your local machine in `.env`. `IP` *MAY* also be a hostname (without protocol in the beginning).

```ini
IP=192.168.1.201
PORT=1313
```

This configures the Hugo server so you can access the site from other machines (and mobile devices) in your local network. Again: you *MUST NOT* commit this file to any public code versioning system as it contains private information.

To start the development server, run `npm run server`, which runs the Hugo server with more or less paranoid settings (show translation issues, template issues, be verbose, debug, the more, the better). Running just `hugo server` will start Hugo on [localhost:1313](http://localhost:1313).

# Release

Sidenote: I use these scripts only if I want to create a new minor or major release of the website. All other "releases" are done when deploying the website (see [Deploy](#deploy)).

- Create patch release with `npm run release` or `npm run release:patch`
- Create minor release with `npm run release:minor`
- Create major release with `npm run release:major`

# Deploy

As noted, this repository is optimized for Netlify. To create a local copy of the website, run `npm run build` or `./bin/netlify/build`.

Running `npm run deploy` creates a new tag in the `main` branch and deploys the site on Netlify.

# Theme

The theme is part of this repository, mainly in the `layouts` folder.

## Paradigms

- Spacing (margin and padding) is applied from top to bottom.
- We use responsive design principles with mobile-first.
No unnecessary `row`s inside of `row`s (container>row>col>row>col) if this isn't explicitly required. It probably isn't needed anyway.
- Do reuse and recycle styles.

# Netlify setup

```bash
npm install netlify-cli -g && netlify login
netlify --telemetry-disable // yeah, well, shouldn't that be default?
netlify init
netlify build
```

If any errors come up while running this, then fix them.

# Hooks (WIP)

Hooks are listed in their order of appearance

<!-- prettier-ignore-start -->
| Hook | File | Runs | Depends on | Description |
| --- | --- | --- | --- | --- |
| init | partials/init.html | 1 |   | before anything else runs (before pagination object is created) |
| init-end | partials/init.html | 1 |   | after the pagination object is created and in scratch |
| setup | _default/baseof.html | 1 |   | at the beginning of the main layout |
| body-start | _default/baseof.html | 1 |   |   |
| body-end-pre-script | _default/baseof.html | 1 |   |   |
| body-end | _default/baseof.html | 1 |   |   |
| teardown | _default/baseof.html | 1 |   |   |
<!-- prettier-ignore-end -->

# Front matter parameters

## Layout options

Sample:

```yaml
theme:
 comments: false
```

The following front matter parameters exist to fine-tune the layouts and theme options:

- `comments` - set to false to turn off comment forms and display (default: true)
- `showdate` - set to false to turn off the date per post display (default: true)

# Linting

## Vale (wording and grammar checks)

kollitsch.dev uses [Vale](https://vale.sh/docs/vale-cli/installation/) to lint markdown content files. Styles and vocab are saved in `tests/vale`.

**Installation:**

```bash
snap install --edge vale
```

**Run tests:**

```bash
vale content
vale README.md
npm run lint:vale
```

**VSCode Plugin:**

Install the [Vale](https://marketplace.visualstudio.com/items?itemName=errata-ai.vale-server) plugin. No configuration is required.

## Markdownlint (markdown format checks)

## Search (Algolia)

- To set up the Algolia search, fill in the API information from your [Algolia-Dashboard](https://www.algolia.com/account/api-keys/all) &gt; API keys.

# Troubleshooting

## Inkscape

Generating the component cards requires Inkscape and optipng. Install them with the following:

```bash
sudo apt install inkscape optipng
```

# License

The written `content` of this website itself is licensed under the [CC BY-NC-SA 4.0](http://creativecommons.org/licenses/by-nc-sa/4.0/), and the underlying `source code` used to format and display that content is licensed under the [MIT License](LICENSE-MIT.md).

While this repository is available publicly, all `content` is subject to copyright and may not be re-used or copied into other website projects. The `content` is everything in this site's `content` folder or documentation and code. Other parts of this project, like `assets` and `layouts`, are available for educational use and can be copied to your projects. You **MUST NOT** reuse the full (complete) theme, but you **MAY** use parts and principles of it.

**TBD: note about fonts that might be licensed**

Long story short: go and create something by yourself, and if you want to know how a feature on this website was realised, feel free to have a look or [ask](https://github.com/davidsneighbour/kollitsch.dev/discussions/new?category=questions
).
