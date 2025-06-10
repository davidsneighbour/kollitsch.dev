---
title: "How to Install Flatpak on Ubuntu 24.04"
description: "In this guide, I'll walk you through the steps I took to set up Flatpak on Ubuntu, allowing to access a wide range of applications from Flathub, the leading Flatpak repository."
summary: "In this guide, I'll walk you through the steps I took to set up Flatpak on Ubuntu, allowing to access a wide range of applications from Flathub, the leading Flatpak repository."
date: "2024-09-28T21:59:41+07:00"
resources:
  - title: "All the packages…"
    src: "getty-images-Hh_4mKRYAPM-unsplash.jpg"
tags:
  - "how to"
  - "ubuntu-24.04"
  - "flatpak"
  - "quicky"
  - "100DaysToOffload"
fmContentType: "blog"
cover: "./getty-images-Hh_4mKRYAPM-unsplash.jpg"
---

Flatpak offers a modern way for me to install and manage applications across different Linux distributions, providing greater compatibility and security. In this guide, I'll walk you through the steps I took to set up Flatpak on Ubuntu, allowing to access a wide range of applications from Flathub, the leading Flatpak repository. Whether you're using Ubuntu 18.10 or a newer version like 24.04, this straightforward process will help you get up and running with Flatpak quickly. Let's dive into the setup, from installing Flatpak itself to adding the Flathub repository.

**Step 1: Install Flatpak**

Since Ubuntu 18.10 Flatpak is included in the software sources, simply run:

```bash
sudo apt install flatpak
```

**Step 2: Install the Software Flatpak Plugin**

To enable Flatpak installations via Gnome's Software app, run:

```bash
sudo apt install gnome-software-plugin-flatpak
```

**Note**: This will install a second Software app, because the default is a Snap.

**Step 3: Restart Your System**

After setup, restart your system to finalize everything.

**Step 4: Add Flathub Repository**

Flathub is the go-to repository for Flatpak apps. Enable it with:

```bash
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

Now, you're ready to install Flatpak apps from Flathub! Other repositories are available, but Flathub is the most popular and well-maintained. If a specific app isn't available on Flathub, you can add other repositories as needed and their installation instructions will tell you to add their remotes in a similar way. Careful, you might end up with a lot of remotes!
