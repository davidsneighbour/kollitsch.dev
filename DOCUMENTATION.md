*DarkSkies* is a fast and feature-rich theme for GoHugo, the fastest Static Site Generator (SSG) available. This theme is designed to provide an exceptional user experience, while also being highly customizable.

> [!WARNING]
> Please be aware that until recently DarkSkies was my own theme. I am now in the process of cutting it out of my personal website and into a standalone theme. This process will take some time and the theme might not work as expected. Please be patient, use the issue tracker for quite fast help with any issues that might occur, and check back later for updates.

## Features and benefits

* **Dark and Light Themes**: Automatically adapts to the visitor's system settings or personal preference.
* **Opinionated Design**: Built with focus on readability and aesthetics, perfect for blogs and other content-driven websites.
* **Archive Pages**: Organize and display past content with built-in archive capability.
* **Commenting System**: Integrate either Giscus or Disqus to enable user engagement and feedback on your site.
* **Search Engine Optimization**: Ensure your content reaches its full potential with the theme's search engine optimization (SEO) features.

## What sets *DarkSkies* apart

*DarkSkies* is the result of extensive engineering hours and a commitment to quality code. It's crafted to provide a seamless and enjoyable experience for both you, as the site owner, and your visitors.

## Theme documentation

> [!WARNING]
> This documentation is under (re)construction. Check back later for changes and feel free to [open an issue](https://github.com/davidsneighbour/hugo-DarkSkies/issues) if you have questions or suggestions.

* [Configuration](configuration/)
* [Content](content)
* [Developers](developers)
* [Hooks and Filters](hooks-and-filters)
* [Quality Insurance](quality-insurance)
* [Setup](setup)
* [Shortcodes](shortcodes)
* [Styles](styles)
* [Troubleshooting](troubleshooting)

## General notes

* The keywords MUST, MUST NOT, REQUIRED, SHOULD, SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL in this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).
* I am working on Ubuntu, meaning all code samples in this document are working on Ubuntu and any comparable (Debian-based) Linux system. If you use another operating system, you are on your own. I assume most tools, scripts, and procedures should work on other systems with the appropriate changes because I mainly use open source programs and scripts.

## License

This theme's source code is licensed under the [MIT License](https://github.com/davidsneighbour/hugo-DarkSkies/blob/main/LICENSE.md).

## Requirements

```bash
npm install -g netlify-cli
```

### Dart SASS

```bash
brew install sass/sass/sass
```

Note, that there is a difference between Sass Embed and Dart Sass. This theme choses to use Dart Sass.

## Pagefind configuration

per page:

```yaml
config:
  pagefind: false
```

to remove this specific page from the search index.

Run `build:pagefind` to create the search index.

## Date setup for individual pages

This theme customizes how GoHugo handles date fields in the frontmatter. These changes override GoHugo's default behavior to provide more control over date metadata, including utilizing Git history timestamps (`:git`) when applicable.

### `date` configuration

```toml
date = ["date", "publishDate", "lastmod", ":git"]
# date = ['date', 'publishdate', 'pubdate', 'published', 'lastmod', 'modified']
```

Darkskies simplifies the `date` configuration by focusing on key frontmatter fields: `date`, `publishDate`, and `lastmod`, while using the Git commit date (`:git`) as a fallback. This ensures that the content date accurately reflects the creation, publication, or modification timeline, especially in environments where Git is used.

### `lastmod` configuration

```toml
lastmod = ["lastmod", ":git", "date", "publishDate"]
# lastmod = [':git', 'lastmod', 'modified', 'date', 'publishdate', 'pubdate', 'published']
```

Darkskies prioritizes the explicit `lastmod` field and uses the Git modification date (`:git`) as a secondary option. If neither is available, it falls back to the `date` and `publishDate` fields, ensuring that the last modification date is derived correctly.

### `publishDate` and `expiryDate` configuration

```toml
publishDate = [":default"]
# publishDate = ['publishdate', 'pubdate', 'published', 'date']
expiryDate = [":default"]
# expiryDate = ['expirydate', 'unpublishdate']
```

Nothing is changed on the default `expiryDate` and `expirydate` configuration.

### Summary of date configuration

To sum it up, the following frontmatter is required to add a proper date to your pages:

If `--enableGitInfo` is set or `enableGitInfo = true` is set in site configuration (which is the default in this theme), and no date frontmatter is set then the Git author date for the last revision of this content file is used as date.

Set the `date` or `publishDate` frontmatter, to override this. `lastmod` will also override this if no other front matter is set.

If GIT is not enabled the frontmatter is defined by `date`, or `publishDate`, or `lastmod` if they are set in this order of priority.

To change the way posts are ordered in list views set a `publishDate` front matter variable. Else `date` is used.

The `lastmod` front matter overrides the git date and all other frontmatter variables to show when a page was updated.

Long story short:

* No date field is required if you use the Git date
* Although adding a `date` field gives you an opportunity to fine-tune the date (and know the date without having to resort to `git` commands to find out when a page was published).
* To show a different date than the date that is used to sort pages on list overviews use `date` and `publishDate` frontmatter.
* To show that a page was substantially changed between publishing and now, use the `lastmod` field.

> [!WARNING]
> This documentation is under (re)construction. Check back later for changes and feel free to open
> an issue if you have questions or suggestions.

* [General notes](#general-notes)

---

## Content

### Archetypes

This website has the following archetypes with their respective front matters and features:

* `default` - the default archetype for all content types
* `blog` - the archetype for blog posts
* `components` - the archetype for components
* `hugo-release-notes` - the archetype for Hugo release notes
* `music2program2` - the archetype for developer music playlists
* `notes-from-the-laboratory` - the archetype for notes from the laboratory
* `tags` - the archetype for tags

### Front matter parameters

#### Layout options

Sample:

```yaml
theme:
  comments: false
```

The following front matter parameters exist to fine-tune the layouts and theme options:

* `comments` - set to false to turn off comment forms and display (default: true)
* `showdate` - set to false to turn off the date per post display (default: true)

## Setup

Install this repository and all submodules via `git clone --recurse-submodules https://gitlab.com/davidsneighbour/kollitsch.dev.git`. If you have cloned the repository before reading this, run `git submodule update --init --recursive` to get the submodules up-to-date.

### Prepare the development environment

* **[Hugo](https://gohugo.io/)** ([Installation instructions](https://gohugo.io/getting-started/installing/))
* **[Node.js](https://nodejs.org/)** ([I recommend using NVM](https://github.com/nvm-sh/nvm) to install Node.js)
* **[Bash](https://www.gnu.org/software/bash/)** (available on any self-respecting operating system)
* **[Shellcheck](https://github.com/koalaman/shellcheck)** (`snap install -channel=edge shellcheck`)
* Running **`npm install`** will add all set-up requirements
* Copy `.env.sample` to **`.env`** and specify the values used by scripts and the build systems for various tasks. You **MUST NOT** commit the `.env` file to the repository for privacy and security reasons. Take notes of your configuration data somewhere safe, like in [Keybase](https://keybase.io) or a password manager.
* Setup signed tags with `npm config set sign-git-tag true`

### Advanced setup steps

* **GitHub Actions:** To enable the step to debug logging for the GitHub Workflows, you must set the following secret in the repository that contains the workflow: `ACTIONS_STEP_DEBUG` to `true`. You find the settings page by following `Settings > Secrets > Actions` from the repositories home page.

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

* install mkcert (see [mkcert](https://github.com/FiloSottile/mkcert))

  ```bash
  hugo server trust
  ```

## Development

### @params

JavaScripts have `params` injected via GoHugo @params feature. Currently only the following params are set:

* in `assets/data/build.json`: `version` - the current version of the site.
* via template injection: `debug` - true on dev server, false on production server.

```toml

### Release

Sidenote: I use these scripts only if I want to create a new minor or major release of the website. All other "releases" are done when deploying the website (see [Deploy](#deploy)).

* Create patch release with `npm run release` or `npm run release:patch`
* Create minor release with `npm run release:minor`
* Create major release with `npm run release:major`

### Deploy

As noted, this repository is optimized for Netlify. To create a local copy of the website, run `npm run build` or `./bin/netlify/build`.

Running `npm run deploy` creates a new tag in the `main` branch and deploys the site on Netlify.

### Theme

The theme is part of this repository, mainly in the `layouts` folder.

#### Paradigms

* Spacing (margin and padding) is applied from top to bottom.
* We use responsive design principles with mobile-first.
  No unnecessary `row`s inside of `row`s (container>row>col>row>col) if this isn't explicitly required. It isn't needed anyway.
* Do re-use and recycle styles.

### Netlify setup

```bash
npm install netlify-cli -g && netlify login
netlify --telemetry-disable // shouldn't that be the default?
netlify init
netlify build
```

If any errors come up while running this, then fix them.

> [!WARNING]
> This documentation is under (re)construction. Check back later for changes and feel free to open
> an issue if you have questions or suggestions.

* [General notes](#general-notes)

---

Hooks are listed in their order of appearance.

| Hook  | File  | Runs | Depends on | Description  |
| --- | --- | --- | --- | --- |
| init  | partials/init.html  | 1  |  | before anything else runs (before the pagination object is created) |
| init-end  | partials/init.html  | 1  |  | after the pagination object is created and in scratch  |
| setup  | _default/baseof.html | 1  |  | at the beginning of the main layout  |
| body-start  | _default/baseof.html | 1  |  |  |
| body-pre-main | _default/baseof.html | 1  |  |  |
| body-main-start | _default/baseof.html | 1  |  |  |
| body-main-end | _default/baseof.html | 1  |  |  |
| body-post-main | _default/baseof.html | 1  |  |  |
| body-end-pre-script | _default/baseof.html | 1  |  |  |
| body-end  | _default/baseof.html | 1  |  |  |
| teardown  | _default/baseof.html | 1  |  |  |

## Code and Content Quality

### Linting

#### On Save

##### Vale (wording and grammar checks)

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

**Visual Studio Code Plugin:**

Install the [Vale](https://marketplace.visualstudio.com/items?itemName=errata-ai.vale-server) plugin. No configuration is required.

###### Updating Vale

```bash
vale sync
```

##### Markdownlint (markdown format checks)

#### On Commit

## Installing *Darkskies*

To install *Darkskies* as a theme component, navigate to your site's root directory in your terminal and run:

```bash
hugo mod get github.com/davidsneighbour/hugo-darkskies.git
```

Then install the companion package to make sure all packages required for asset processing are available:

```bash
npm install @davidsneighbour/hugo-darkskies
```

## Upgrading *Darkskies*

To upgrade *Darkskies*, run:

```bash
hugo mod get -u ./...
```

The **hugo-theme** implements the following shortcodes:

* `{{/*< color-table >*/}}`
* `{{/*< contact-form >*/}}`
* `{{/*< quote >*/}}`
* `{{/*< taglist >*/}}`

## Inkscape

Generating the component cards requires Inkscape and optipng. Install them with the following:

```bash
sudo apt install inkscape optipng
```
