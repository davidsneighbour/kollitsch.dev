[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Netlify Status](https://api.netlify.com/api/v1/badges/02e05c7a-11a0-48e0-988f-7fc12267eb89/deploy-status)](https://app.netlify.com/sites/kollitsch-dev/deploys)

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/~/github.com/davidsneighbour/kollitsch.dev)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/davidsneighbour/kollitsch.dev)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/davidsneighbour/kollitsch.dev?devcontainer_path=.devcontainer/devcontainer.json)

This project is the website setup, features, and theme for [kollitsch.dev](https://kollitsch.dev/).

<!--lint ignore-->

* [Used services and tools](#used-services-and-tools)
  * [Legacy tools](#legacy-tools)
* [Commands](#commands)
* [Ask questions](#ask-questions)
* [General notes](#general-notes)
* [Preview of the current state of the website](#preview-of-the-current-state-of-the-website)
* [Badges](#badges)
  * [Linting](#linting)

## Used services and tools

| Function | |Service                                          |
| :------------------------ | --- | :----------------------------------------------- |
| **Domain Registration**   | | [Porkbun](https://porkbun.com/products/domains) |
| **DNS & CDN**                   | [![Cloudflare](https://skillicons.dev/icons?i=cloudflare)](https://cloudflare.com) | [Cloudflare](https://cloudflare.com)             |
| **Hosting**               | [![Netlify](https://skillicons.dev/icons?i=netlify)](https://netlify.com) | [Netlify](https://netlify.com)                   |
| **Static Site Generator** | [![Astro](https://skillicons.dev/icons?i=astro)](https://astro.build/) | [Astro](https://astro.build/)                    |
| **CSS Framework**         | [![Tailwind CSS](https://skillicons.dev/icons?i=tailwind)](https://tailwindcss.com/) | [Tailwind CSS](https://tailwindcss.com/)        |

### Legacy tools

| Function                  | Service                                          |
| :------------------------ | :----------------------------------------------- |
| **Static Site Generator**   | [Website done via GoHugo](https://github.com/davidsneighbour/kollitsch.dev/tree/14171a308d5597705a49d382e8ede290f06b8ecc) |
| **CSS Framework**         | [Theme done via Bootstrap](https://github.com/davidsneighbour/kollitsch.dev/tree/14171a308d5597705a49d382e8ede290f06b8ecc) |

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Install dependencies.                            |
| `npm run dev`             | Start local dev server at `localhost:4321`.      |
| `npm run build`           | Build production site to `./dist/`.              |
| `npm run preview`         | Preview the build locally, before deploying.     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`.|
| `npm run astro -- --help` | Get help using the Astro CLI.                    |

## Ask questions

Feel free to [open an issue](https://github.com/davidsneighbour/kollitsch.dev/issues/new?assignees=davidsneighbour\&labels=state%3Aunconfirmed\&template=custom.md\&title=) to ask questions, discover undocumented details, or suggest improvements. [Discussions](https://github.com/davidsneighbour/kollitsch.dev/discussions) are also open directly or via commenting on articles.

## General notes

* The keywords MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).
* I am working on Ubuntu, meaning all code samples in this document are working on Ubuntu and any comparable (Debian-based) Linux system. If you use another operating system, you are on your own. I assume most tools, scripts, and procedures should work on other systems with the appropriate changes because I mainly use open source programs and scripts.
* Changes to the website and setup that are important are documented in the [release notes on GitHub](https://github.com/davidsneighbour/kollitsch.dev/releases).
* The versioning follows a more or less semantic versioning scheme. Patch releases are for bug fixes and content updates, minor releases are for new features. Major releases are done once a year --- it's a personal website after all ;]

## Preview of the current state of the website

[![Screenshot of kollitsch.dev](.github/screenshot.png)](.github/screenshot.png)

## Badges

### Linting

[![Check Links](https://github.com/davidsneighbour/kollitsch.dev/actions/workflows/link-check.yml/badge.svg)](https://github.com/davidsneighbour/kollitsch.dev/actions/workflows/link-check.yml)
