---
title: Fixing Slack's missing Signed-By warning in APT
cover:
  type: image
  src: 2.jpg
  format:
    contenttype: jpg
    quality: 75
fmContentType: blog
featured: false
date: 2026-08-26
draft: true
description: bla
---

Running the usual Ubuntu package update recently produced a new warning at the end of an otherwise uneventful run:

```text
$ sudo apt update && sudo apt upgrade

...
Hit:23 https://packagecloud.io/slacktechnologies/slack/debian jessie InRelease
...

All packages are up-to-date.

Notice: Missing Signed-By in the sources.list(5) entry for 'https://packagecloud.io/slacktechnologies/slack/debian'

Summary:
  Upgrading: 0, Installing: 0, Removing: 0, Not Upgrading: 0
```

Nothing was actually broken. Slack's repository was still reachable, its metadata could be downloaded, and there were no packages waiting for an upgrade.

But APT was unhappy about the repository configuration.

## The problem

The active Slack repository configuration on this machine lives in:

```text
/etc/apt/sources.list.d/slack.sources
```

It uses [the newer Deb822-style repository format](https://manpages.ubuntu.com/manpages/resolute/man5/sources.list.5.html) rather than the older one-line `deb ...` syntax.

The file looked like this:

```text
Types: deb
URIs: https://packagecloud.io/slacktechnologies/slack/debian/
Suites: jessie
Components: main
Signed-By:
```

There is a `Signed-By` field, but it is empty.

That explains APT's warning.

It would be easy to call this careless packaging, an installer bug, or something Slack should have handled correctly in the first place.

Maybe it is.

But Linux installations also accumulate history. Package managers change, repository formats change, key-management recommendations change, distribution upgrades happen, and installers have to work across many environments.

Instead of spending more time being annoyed, we can find the signing key Slack already installed and tell APT where it is.

## Finding the Slack repository configuration

First, find every APT source mentioning Slack's Packagecloud repository:

```bash
grep -Rni "packagecloud.io/slacktechnologies" \
  /etc/apt/sources.list \
  /etc/apt/sources.list.d/
```

On this machine that returned:

```text
/etc/apt/sources.list.d/slack.sources:2:URIs: https://packagecloud.io/slacktechnologies/slack/debian/
/etc/apt/sources.list.d/slack.list.bak:3:deb https://packagecloud.io/slacktechnologies/slack/debian/ jessie main
```

The `.bak` file is only a backup. The active configuration is:

```text
/etc/apt/sources.list.d/slack.sources
```

Inspecting it confirms the empty `Signed-By` value:

```bash
cat /etc/apt/sources.list.d/slack.sources
```

```text
Types: deb
URIs: https://packagecloud.io/slacktechnologies/slack/debian/
Suites: jessie
Components: main
Signed-By:
```

## Finding Slack's signing key

The next question is obvious:

Where did Slack put its signing key?

Search the usual APT keyring locations:

```bash
find /etc/apt/keyrings /usr/share/keyrings /etc/apt/trusted.gpg.d \
  -maxdepth 1 \
  -type f \
  \( -iname '*slack*' -o -iname '*packagecloud*' \) \
  -print 2>/dev/null
```

On this system the result was:

```text
/etc/apt/trusted.gpg.d/packagecloud.gpg
/etc/apt/trusted.gpg.d/slack-desktop.gpg
```

There is a keyring explicitly named for Slack:

```text
/etc/apt/trusted.gpg.d/slack-desktop.gpg
```

That path is what the repository configuration is missing.

## Fixing `slack.sources`

Edit the repository file:

```bash
sudoedit /etc/apt/sources.list.d/slack.sources
```

Change this:

```text
Types: deb
URIs: https://packagecloud.io/slacktechnologies/slack/debian/
Suites: jessie
Components: main
Signed-By:
```

to this:

```text
Types: deb
URIs: https://packagecloud.io/slacktechnologies/slack/debian/
Suites: jessie
Components: main
Signed-By: /etc/apt/trusted.gpg.d/slack-desktop.gpg
```

Then run:

```bash
sudo apt update
```

APT can now associate the Slack repository with the key that is supposed to authenticate it, and the warning disappears.

## What `Signed-By` is doing

`Signed-By` restricts which signing key APT accepts for a repository.

Without such a restriction, keys in APT's broader trusted key collection may potentially be trusted for more repositories than necessary.

With:

```text
Signed-By: /etc/apt/trusted.gpg.d/slack-desktop.gpg
```

we are telling APT:

> For this Slack repository, use this specific keyring when verifying repository signatures.

That is more explicit and easier to reason about.

## A note about `/etc/apt/trusted.gpg.d`

There is one wrinkle.

The Slack key on this system lives in:

```text
/etc/apt/trusted.gpg.d/slack-desktop.gpg
```

That works, but `/etc/apt/trusted.gpg.d/` belongs to APT's older global key-management approach.

Modern third-party repository configurations generally keep repository-specific keys in locations such as:

```text
/etc/apt/keyrings/
```

and then reference them explicitly:

```text
Signed-By: /etc/apt/keyrings/slack.gpg
```

Migrating the key there would make the setup cleaner.

For this warning, however, that is a separate concern. The immediate problem was an empty `Signed-By` field, even though the corresponding Slack signing key was already installed.

Sometimes the shortest debugging session is:

1. Read the warning literally.
2. Find the configuration responsible for it.
3. Inspect what is missing.
4. Find the resource that should be referenced.
5. Connect the two.

No reinstall required, and considerably less productive anger directed at a four-line configuration file.
