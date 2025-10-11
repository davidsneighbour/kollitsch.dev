---
title: How to pin npm package versions effectively
description: >-
  Learn how to pin npm package versions effectively to ensure stability and
  control in your projects.
date: 2025-10-11T11:37:50.444Z
tags: [npm, how-to, development, 100daystooffload]
cover:
  src: paul-esch-laurent-oZMUrWFHOB4-unsplash.jpg
  type: image
  alt: Photo by [Paul Esch-Laurent](https://unsplash.com/@pinjasaur) via [Unsplash](https://unsplash.com/)
---

I always (well, for a couple of years now) use exact versions in my `package.json`. One of the reasons is that I will be aware of updates and know exactly what is being used at any time. Critics of the "ecosystem" had their field days earlier this year with multiple breaches of packages whose maintainers were phished and had packages replaced with malicious code. Having a fixed version results in fewer surprises and a more stable development environment. Everyone is using the same version, not just a version of some kind or newer releases.

This allows me to have more control over my versions and with tools like [Renovate](https://www.mend.io/renovate/) and [Dependabot](https://docs.github.com/en/code-security/getting-started/dependabot-quickstart-guide) it's easier than ever to maintain.

How do we tell npm to use exact versions? Let's go through the four common ways of specifying versions in `package.json` first:

* **Mathematical notation:** `>=16.0.0` - this allows the installation of all versions of at least 16.0.0 and above, even allowing version 17.0.0 and higher to be installed.
* **Caret notation:** `^16.0.0` - this allows the installation of all minor updates, for instance 16.1.0 and higher (but not 17.0.0).
* **Tilde notation:** `~16.0.0` - this allows the installation of patch updates, so 16.0.1 and higher, but not 16.1.0 or higher, are installed.
* **Exact version:** `16.0.0` - this allows only exact version 16.0.0 to be installed.

Renovate has [a great post on why you would do this dependency-pinning](https://docs.renovatebot.com/dependency-pinning/). Ultimately, it's a personal decision and I am used to do this now.

Now, having exact versions in our `package.json` is great, but when I install a new package, npm will default to the caret notation. How do we change that to make it always use exact versions?

**Manually** every time a package is installed we add `--save-exact` to the install command:

```bash
npm install --save --save-exact react
```

This installs the latest version of the package and adds it to the `package.json` with an exact version number. If you want to install a specific version, you do so by specifying the version number:

```bash
npm install --save --save-exact react@16.0.0
```

This is quite inconvenient, because we have to remember to add the `--save-exact` option. To **automatically** set the exact versioning when installing a package we can do so by setting a default in our config:

```bash
npm config set save-exact=true
```

This adds `save-exact=true` to your `.npmrc` and will make npm _always_ use exact versions any time we use `npm`.

To verify that the setting has been applied, we run:

```bash
npm config list | grep save-exact
```

and we should see:

```ini
save-exact = true
```

If you want to revert this setting, you can do so by running:

```bash
npm config delete save-exact
```

This will remove the setting from your `.npmrc` and npm will revert to its default behavior, which currently is using caret notation when installing packages.
