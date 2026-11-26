---
title: "Fixing APT's i386 architecture notices without disabling multiarch"
description: "Remove APT's unsupported i386 architecture notices by restricting individual repositories to amd64 while retaining 32-bit support for Steam and Wine."
date: 2026-11-26T07:07:46Z
fmContentType: blog
tags:
  - linux
  - ubuntu
  - apt
  - sysadmin
  - dotfiles
cover:
  src: "postimages/postimage-for-fixing-apt-i386-architecture-notices.jpg"
  type: image
  title: "Image by [Insaanu Studio](https://unsplash.com/@insaanustudio) on [Unsplash](https://unsplash.com/photos/circuit-board-with-glowing-blue-and-green-lines-EaI_VX4uqVs)"
  alt: "3D render of a dark circuit board with glowing blue and green traces between processor chips"
---

Running `sudo apt update` on Ubuntu occasionally produces notices about repositories that do not support the `i386` architecture. While harmless, these notices clutter the terminal output and indicate that APT is looking for package indexes that do not exist.

Fortunately, there is a straightforward fix that does not involve disabling 32-bit support across the entire system.

## The problem

During a regular system update, APT produced the following notices on my workstation:

```text
Notice: Skipping acquire of configured file 'main/binary-i386/Packages' as repository 'https://downloads.claude.ai/claude-desktop/apt/stable stable InRelease' doesn't support architecture 'i386'
Notice: Skipping acquire of configured file 'main/binary-i386/Packages' as repository 'http://deb.gierens.de stable InRelease' doesn't support architecture 'i386'
Notice: Skipping acquire of configured file 'contrib/binary-i386/Packages' as repository 'https://download.virtualbox.org/virtualbox/debian questing InRelease' doesn't support architecture 'i386'
```

The affected repositories provide packages for Claude Desktop, eza, and VirtualBox.

APT attempts to retrieve package indexes for all enabled architectures unless the repository configuration explicitly restricts them. These repositories do not provide `i386` packages, so APT skips the corresponding indexes and tells us about it.

## Why not simply disable i386?

Many solutions suggest removing the architecture altogether:

```bash
sudo dpkg --remove-architecture i386
```

While this might work on some systems, it is not necessarily the right solution.

I have Steam installed on my workstation, which still relies on several 32-bit libraries. Wine and other compatibility tools may have similar requirements.

You can check which additional architectures are enabled on your system:

```bash
dpkg --print-foreign-architectures
```

And identify installed 32-bit packages:

```bash
dpkg-query -W \
  -f='${Architecture}\t${db:Status-Status}\t${Package}\n' \
  | awk '$1 == "i386" && $2 == "installed" {print $3}'
```

Rather than disabling an architecture globally to accommodate a handful of repositories, we can restrict those repositories individually.

## Finding the affected repository configurations

APT stores its repository configurations in `/etc/apt/sources.list` and `/etc/apt/sources.list.d/`.

A quick search identifies the relevant configuration files:

```bash
grep -rnE \
  'downloads\.claude\.ai|deb\.gierens\.de|download\.virtualbox\.org' \
  /etc/apt/sources.list /etc/apt/sources.list.d/
```

Depending on how the repositories were installed, the configuration files use either the modern Deb822 format (`.sources`) or the traditional one-line format (`.list`).

Both support architecture restrictions.

## Fixing modern Deb822 repository configurations

For repositories configured in `.sources` files, add the following field to the relevant stanza:

```yaml
Architectures: amd64
```

A simplified repository configuration might look like this afterwards:

```yaml
Types: deb
URIs: http://deb.gierens.de
Suites: stable
Components: main
Architectures: amd64
```

If an `Architectures` field already exists, adjust its value instead of adding a second field.

Keep all other existing fields, particularly `Signed-By`, unchanged.

## Fixing traditional repository configurations

For repositories configured in `.list` files, the architecture restriction belongs inside the square brackets containing the repository options.

Change:

```text
deb http://deb.gierens.de stable main
```

To:

```text
deb [arch=amd64] http://deb.gierens.de stable main
```

If the repository already has options, add `arch=amd64` alongside them:

```text
deb [arch=amd64 signed-by=/path/to/keyring.gpg] http://deb.gierens.de stable main
```

The keyring path above is illustrative. Preserve the actual signing-key path from your existing configuration.

## Verify the changes

Once the affected repositories have been updated, run:

```bash
sudo apt update
```

The notices should disappear. APT no longer attempts to retrieve the unavailable 32-bit package indexes from those repositories, while repositories that support both architectures continue to work as before.

Steam remains functional, 32-bit support remains available, and the terminal output is a little cleaner.

## A convention for managing third-party repositories

Per-repository architecture restrictions are also a useful convention for automated workstation provisioning and dotfiles management:

- Explicitly declare supported architectures when configuring third-party repositories.
- Prefer [the modern Deb822 `.sources` format](https://repolib.readthedocs.io/en/latest/deb822-format.html).
- Preserve repository-specific signing-key configurations.
- Keep repository setup scripts idempotent.
- Leave system-wide multiarch support independent of individual repository configurations.

One caveat: some applications manage their own APT repository configurations and might overwrite manual changes during subsequent updates. If a notice reappears, check whether the application has regenerated its repository configuration.

The underlying principle applies well beyond APT: fix the configuration at the narrowest appropriate scope rather than introducing a system-wide change to solve a local problem.

## Further reading

- [APT sources.list manual](https://manpages.ubuntu.com/manpages/resolute/en/man5/sources.list.5.html)
- [Debian Multiarch documentation](https://wiki.debian.org/Multiarch)
