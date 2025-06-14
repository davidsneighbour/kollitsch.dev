[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Netlify Status](https://api.netlify.com/api/v1/badges/02e05c7a-11a0-48e0-988f-7fc12267eb89/deploy-status)](https://app.netlify.com/sites/kollitsch-dev/deploys)

This project is the website setup, features, and theme for [kollitsch.dev](https://kollitsch.dev/).

<!--lint ignore-->

* [Preview of the current state of the website](#preview-of-the-current-state-of-the-website)
* [Used services](#used-services)
* [Commands](#commands)
* [Ask questions](#ask-questions)
* [General notes](#general-notes)

## Preview of the current state of the website

[![Screenshot of kollitsch.dev](.github/screenshot.png)](.github/screenshot.png)

## Used services

| Function                  | Service                                          |
| :------------------------ | :----------------------------------------------- |
| **Domain Registration**   | [Porkbun](https://porkbun.com/products/domains)  |
| **DNS**                   | [Cloudflare](https://cloudflare.com)             |
| **CDN**                   | [Cloudflare](https://cloudflare.com)             |
| **Hosting**               | [Netlify](https://netlify.com)                   |
| **Static Site Generator** | [Astro](https://astro.build/)                    |

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
