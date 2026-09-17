---
title: "Enpass 6.12 on Linux: fixing the X11 installation"
description: "Enpass 6.12 stops starting on X11 after a normal apt upgrade. Switch to the X11 APT repository to fix it, correcting an error in Enpass's own docs."
summary: "Enpass 6.12 reworks its entire desktop interface, and on X11-based Linux systems a normal apt upgrade leaves Enpass unable to start. The fix is to switch the Enpass APT repository entry from stable to the x11 variant, then reinstall. This post also flags a formatting error in Enpass's own installation instructions, where a required command is incorrectly split across two lines, and closes with some thoughts on whether it's time to look at alternatives to Enpass."
tags:
  - enpass
  - password-security
  - x11
  - linux
  - apt
  - ubuntu
  - open-source
cover:
  src: enpass-new-look-linux-cover.png
  type: image
  title: "Enpass's new interface design, from the Enpass blog post announcing it for Linux"
date: 2026-09-17T08:56:15.215Z
fmContentType: "blog"
---

With the move from Enpass 6.11 to 6.12, [Enpass decided](https://www.enpass.io/blog/announcement/enpasss-new-look-comes-to-linux/) to rework essentially the entire desktop interface. Despite what looks like a relatively minor version change, Enpass describes 6.12 itself as having been "redesigned from the ground up", including layouts, settings, workflows, icons, typography, and most other parts of the interface.

Unfortunately, that change has also introduced plenty of issues.

On my Linux/X11 setup, a normal update through `apt upgrade` resulted in Enpass no longer starting. The solution is to switch the Enpass APT repository to its X11-specific variant.

Once that is fixed, Enpass starts again. The new interface will still take some time to get used to.

## Installing Enpass on Ubuntu/Debian with X11

The [official Enpass Linux installation instructions](https://help.enpass.io/personal/latest/all/enpass-apps-installation#To-install-Enpass-on-Linux:) first add the Enpass APT repository:

```bash
echo "deb https://apt.enpass.io/ stable main" | sudo tee /etc/apt/sources.list.d/enpass.list
```

However, **if you are running X11 rather than Wayland, you need to use the X11 repository**. If you don't know your session type you can check it with `echo "$XDG_SESSION_TYPE"` on the shell.

For an X11 installation, run this before continuing with the signing key and package installation:

```bash
echo "deb https://apt.enpass.io/ x11 main" | sudo tee /etc/apt/sources.list.d/enpass.list
```

This replaces the normal `stable` repository entry with the `x11` repository entry because both commands write to the same `/etc/apt/sources.list.d/enpass.list` file. Enpass's current documentation explicitly provides this X11 repository for systems running X11.

### Important: the Enpass documentation is wrong here

At the time of writing, Enpass displays the X11 command like this:

```bash
echo "deb https://apt.enpass.io/ x11 main" | sudo tee
/etc/apt/sources.list.d/enpass.list
```

That line break is wrong. `/etc/apt/sources.list.d/enpass.list` is an argument to `tee` and therefore belongs on the **same command line**:

```bash
echo "deb https://apt.enpass.io/ x11 main" | sudo tee /etc/apt/sources.list.d/enpass.list
```

Then import the repository signing key:

```bash
wget -O - https://apt.enpass.io/keys/enpass-linux.key | sudo tee /etc/apt/trusted.gpg.d/enpass.asc
```

Update APT:

```bash
sudo apt-get update
```

Install, or reinstall/update, Enpass:

```bash
sudo apt-get install enpass
```

After applying this workaround, Enpass works again on my X11 setup.

## The full sequence

```bash
echo "deb https://apt.enpass.io/ x11 main" | sudo tee /etc/apt/sources.list.d/enpass.list
wget -O - https://apt.enpass.io/keys/enpass-linux.key | sudo tee /etc/apt/trusted.gpg.d/enpass.asc
sudo apt-get update
sudo apt-get install enpass
```

## Maybe it is time to look elsewhere

I have used Enpass for more than ten years. For most of that time, it has been a very good tool.

More importantly, it has helped me maintain good password hygiene for a very long time. I don't have to reuse memorable passwords or choose credentials that are realistically vulnerable simply because I need to remember them. A password manager has become a fundamental part of how I use computers, and Enpass has filled that role reliably for years.

So this isn't a case of dismissing Enpass as a bad product. It isn't. But changes like the 6.12 redesign do make me wonder whether it is time to reconsider the tool. This is not a minor update.

There are longstanding limitations alongside the new interface problems. One particularly annoying example is export: Enpass can export a vault, but it does not provide a useful way to export an arbitrary tag, group, or selected collection of items. The official export workflow is still centred around exporting an entire vault rather than a selected logical subset of its contents.

For something as fundamental and long-lived as a password database, portability matters.

After more than a decade with Enpass, perhaps this is a good point to investigate the open-source alternatives. Not because Enpass has suddenly become useless, but because a password manager is important enough that I would increasingly prefer the software, data formats, migration paths, and long-term availability not to depend entirely on one proprietary application.

Enpass has served me well for a very long time. That also means any replacement has quite a high bar to clear. I remember using Keepass before.
