---
title: Installing Firefox on Ubuntu without Snap
description: A practical guide to removing the Snap version of Firefox and installing it from the Mozilla Team PPA on Ubuntu.
date: 2026-03-24T06:29:35.184Z
tags: [firefox, snap, ubuntu]
cover:
  src: "simone-dinoia-L9JMv_ACMK0-unsplash.jpg"
  title: "Photo by [Simone Dinoia](https://unsplash.com/@simonedna) on [Unsplash](https://unsplash.com/photos/a-red-panda-sitting-on-top-of-a-tree-branch-L9JMv_ACMK0)"
---

Ubuntu has made it very clear where it stands on Snap. Firefox is one of the more visible examples. You install a browser and what you actually get is a Snap package, wrapped, sandboxed, and controlled in a way you did not explicitly choose. It's also slower.

This feels patronising. Not because Snap itself is inherently bad, but because the choice is taken away. A core, everyday tool is forced into a specific distribution channel, and the system actively resists alternatives. It's what corporations do. That said, complaining about it is mostly wasted time. Snap is a Canonical product. It is deeply integrated into Ubuntu's direction. They are not going to abandon it.

So you have two realistic options if you want to keep using Ubuntu, but avoid Snap:

* Remove Snap entirely and commit to a fully apt-based system
* Accept Snap exists, but override it selectively where it matters

This post covers the second option. Firefox is a good example because it is widely used and the Snap version has enough friction points that many people prefer a native package.

As a side note, if you want to avoid Snap entirely without fighting the system, distributions like Linux Mint take a different approach. Linux Mint is based on Ubuntu/Debian but deliberately removes Snap integration and provides Firefox as a traditional `.deb` package out of the box. That is a structural decision, not a workaround.

## The goal

The objective is simple:

* Remove the Snap version of Firefox
* Prevent Ubuntu from reinstalling it
* Install Firefox from the official Mozilla Team PPA instead
* Ensure apt always prefers that version

## Step 1: Remove Snap Firefox and the apt meta package

Ubuntu installs Firefox via Snap, but keeps a placeholder apt package that points back to Snap. You need to remove both.

```bash
sudo snap remove firefox
sudo apt --purge autoremove firefox
```

What this does:

* Removes the Snap package completely
* Removes the apt "dummy" package that would otherwise reinstall Snap Firefox

If you skip the second command, Ubuntu may silently pull Snap Firefox back in later.

## Step 2: Define apt pinning rules

This is the critical part. Without pinning, Ubuntu will continue to prioritise its own packages, which means Snap will come back.

Create the file `/etc/apt/preferences.d/mozillateam` and add the following content:

```plaintext
Package: * 
Pin: release o=LP-PPA-mozillateam
Pin-Priority: 100

Package: firefox*
Pin: release o=LP-PPA-mozillateam
Pin-Priority: 1001

Package: firefox*
Pin: release o=Ubuntu
Pin-Priority: -1
```

### What this actually does

* The PPA is allowed for all packages, but with low priority (100)
* Firefox from the PPA gets a very high priority (1001), forcing apt to choose it
* Firefox from Ubuntu repositories is explicitly blocked (priority -1)

You are overriding Ubuntu's defaults here.

## Step 3: Add the Mozilla Team PPA

Now you can add the repository that provides the actual Firefox package:

```bash
sudo add-apt-repository ppa:mozillateam/ppa
```

This repository is maintained by Mozilla/Ubuntu contributors and provides a proper `.deb` package.

## Step 4: Re-install Firefox

```bash
sudo apt install firefox
```

At this point Firefox is installed from the PPA and Snap is no longer involved. Future upgrades will continue to use the PPA version.

This approach is pragmatic, but you are taking responsibilities into your own hands. The PPA for Firefox is generally reliable, but it is not an official Ubuntu package. If it stops working you need to troubleshoot it yourself.

If this annoys you on a broader level, consider switching to a distribution that aligns better with your expectations. Linux Mint is a practical example here. It keeps compatibility with Ubuntu/Debian packaging while intentionally excluding Snap, which avoids this entire class of problems without additional configuration.

Ubuntu is opinionated. That is not new. Snap is part of that opinion. You can either align with it, or override it in specific places. This is one of those places where taking control is straightforward and worth it.
