---
title: Disable automatic updates in Snapd
description: Learn how to control Snap package updates with the `--hold` option in Snapd.
date: 2025-04-16T18:31:39+07:00
resources:
  - title: >-
      Photo by [Markus Winkler](https://unsplash.com/@markuswinkler) via
      [Unsplash](https://unsplash.com/)
    src: markus-winkler-qPjV8XaXPTQ-unsplash.jpg
tags:
  - ubuntu
  - snapd
  - gohugo
  - 100daystooffload
cover:
  src: ./markus-winkler-qPjV8XaXPTQ-unsplash.jpg
  type: image
publisher: rework
---

By default, Snap packages update automatically in the background - and while that's great for most users, there are cases where you want to control the timing or version of your Snap apps. This is possible since [Snapd 2.58](https://snapcraft.io/docs/snapd-roadmap#p-9464-snapd-258) with the [introduction of the `--hold` option for `snap refresh`](https://snapcraft.io/docs/managing-updates).

Let's go over how to use it.

## Disable automatic updates for specific Snap apps

To prevent automatic updates for a specific Snap package (for example, **Hugo**), run:

```bash
snap refresh --hold hugo
```

You'll get a confirmation like:

```plaintext
General refreshes of "hugo" held indefinitely
```

This means Hugo won't be updated in the background anymore. You can still manually update it using:

```bash
snap refresh hugo
```

## Disable updates temporarily

Want to pause updates only for a short time? You can set a time limit using `--hold=24h` (or `1d`, `2h`, etc.). This works for individual or multiple packages:

```bash
snap refresh --hold=24h hugo firefox
```

To hold all snap updates for 24 hours, skip the package name:

```bash
snap refresh --hold=24h
```

## Disable all Snap updates indefinitely

To stop all automatic snap refreshes:

```bash
snap refresh --hold
```

This will apply the hold to all installed Snap packages.

## Re-enable updates

To allow automatic updates again, use the `--unhold` flag.

For all apps:

```bash
snap refresh --unhold
```

Or just for Hugo:

```bash
snap refresh --unhold hugo
```

## Conclusion

With these commands, you can manage Snap package updates on your system. Whether you want to pause updates temporarily or stop them indefinitely, Snapd gives you the flexibility to control your software environment and makes it easy to use pre-packaged software on Linux.
