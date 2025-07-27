---
title: Stop Ubuntu from automounting external harddrives on boot
description: >-
  Disable Ubuntu's automatic mounting of external drives like Seagate to prevent
  issues. Use `gsettings` commands to manage automount settings via the
  terminal.
summary: >-
  On Ubuntu, external hard drives are automatically mounted when plugged in
  while booting the computer. Which leads to that hard drive being mounted all
  the time.
date: 2024-09-09T14:52:46+07:00
resources:
  - title: The improper way to keep Ubuntu from mounting drives automatically
    src: curated-lifestyle-l2nY0rP07DI-unsplash.jpg
tags:
  - ubuntu-2404
  - hardware
  - how-to
  - 100daystooffload
unsplash:
  imageid: l2nY0rP07DI
cover:
  src: ./curated-lifestyle-l2nY0rP07DI-unsplash.jpg
  type: image
publisher: rework
---

Aaaargh Ubuntu! Sometimes it's so easy to hate you!

For a while now I've had a 20TB external hard drive from Seagate for my everyday backup needs. On Ubuntu, external hard drives are automatically mounted when plugged in while booting the computer. Which leads to that hard drive being mounted all the time. Which is not bad, but over time it appeared that maybe due to the size of the drive (2GB FAT limit anyone?) or due to it being a drive from a company that thinks Windows is the only operating system existing I ran into multiple issues. Without going too much into details when the drive was running too long it stopped liking being mounted. I had to unmount it, wait for a while, then remount it. Linux world problems, I know… So, basically, this whole automounting is quite undesirable for me.

On Ubuntu 24.04, the GNOME desktop environment handles the automounting of external drives. To stop it from doing that, we can use the `gsettings` tool. This is a simple process and does not require the installation of any additional tools like `dconf-editor`.

Open a terminal and run the following commands:

```bash
gsettings set org.gnome.desktop.media-handling automount false
gsettings set org.gnome.desktop.media-handling automount-open false
```

The first command disables the automount of any media when it's' inserted (for example, external hard drives, USB drives, or even CDRoms). The second command ensures that even if you manually mount a drive, it won't automatically open in a file manager.

You can verify the changes by running the following command to check if the settings are now `false`:

```bash
gsettings get org.gnome.desktop.media-handling automount
gsettings get org.gnome.desktop.media-handling automount-open
```

If you ever want to re-enable automounting, you can reverse the process by running the same commands, but setting the values to `true`:

```bash
gsettings set org.gnome.desktop.media-handling automount true
gsettings set org.gnome.desktop.media-handling automount-open true
```

Your Seagate hard drive will thank you.
