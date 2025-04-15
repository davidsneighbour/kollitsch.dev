<!--lint disable no-multiple-toplevel-headings -->

[![Netlify Status](https://api.netlify.com/api/v1/badges/02e05c7a-11a0-48e0-988f-7fc12267eb89/deploy-status)](https://app.netlify.com/sites/kollitsch-dev/deploys)

This project is the website setup, features, and theme for [kollitsch.dev](https://kollitsch.dev/).

![Screenshot of kollitsch.dev](.github/screenshots/screenshot.png)

<!--lint ignore-->

* [Site structure](#site-structure)
* [Ask questions](#ask-questions)
* [General notes](#general-notes)
* [Setup repository](#setup-repository)

## Site structure

* [kollitsch.dev](https://github.com/davidsneighbour/kollitsch.dev) - this repository, website configuration and features
* [kollitsch.dev-content](https://github.com/davidsneighbour/kollitsch.dev-content) - the content repository for this website
* [hugo-modules](https://github.com/davidsneighbour/hugo-modules) - GoHugo modules that add reusable components to any Hugo website
* [configurations](https://github.com/davidsneighbour/configurations) - Configuration files for various linting and development tools used in this project

<!--lint ignore-->
|                           |                                                 |
| ------------------------- | ----------------------------------------------- |
| **Domain Registration**   | [Porkbun](https://porkbun.com/products/domains) |
| **DNS**                   | [Cloudflare](https://cloudflare.com)            |
| **CDN**                   | [Cloudflare](https://cloudflare.com)            |
| **Hosting**               | [Netlify](https://netlify.com)                  |
| **Static Site Generator** | [GoHugo](https://gohugo.io)                     |

## Ask questions

Feel free to [open an issue](https://github.com/davidsneighbour/kollitsch.dev/issues/new?assignees=davidsneighbour\&labels=state%3Aunconfirmed\&template=custom.md\&title=) to ask questions, discover undocumented details, or suggest improvements. [Discussions](https://github.com/davidsneighbour/kollitsch.dev/discussions) are also open directly or via commenting on articles.

## General notes

* The keywords MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).
* I am working on Ubuntu, meaning all code samples in this document are working on Ubuntu and any comparable (Debian-based) Linux system. If you use another operating system, you are on your own. I assume most tools, scripts, and procedures should work on other systems with the appropriate changes because I mainly use open source programs and scripts.

## Setup repository

```bash

git submodule update --init --recursive --remote
git submodule foreach git checkout main
git config -f .gitmodules submodule.".frontmatter".update merge

npx simple-git-hooks
```
