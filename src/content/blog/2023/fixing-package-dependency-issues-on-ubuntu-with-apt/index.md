---
title: Fixing package dependency issues on Ubuntu with APT
description: >-
  Have you ever tried installing a program on your Ubuntu and ran into error
  messages about unconfigured dependencies? Don't worry; it happens to the best
  of us.
date: 2023-03-06T19:07:56+07:00
resources:
  - title: >-
      Photo by [Gabriel Heinzer](https://unsplash.com/@6heinz3r) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - troubleshooting
  - shell
  - ubuntu
  - 100daystooffload
fmContentType: blog
cover:
  src: ./header.jpg
  type: image
publisher: rework
---

Have you ever tried installing a program on your Ubuntu and ran into error messages about unconfigured dependencies? Don't worry; it happens to the best of us. For example, when you install a program, it might rely on other software packages to run correctly; if those dependencies are not met, the program won't work.

The following happened today when I tried to install [Local](https://localwp.com/) (a program that allows you to run a local WordPress on your computer):

```plaintext
$[patrick@main]~❯ sudo dpkg -i Downloads/local-6.6.1-linux.deb
Selecting previously unselected package local.
(Reading database … 245182 files and directories currently installed.)
Preparing to unpack …/local-6.6.1-linux.deb …
Unpacking local (6.6.1-20230202.4) …
dpkg: dependency problems prevent configuration of local:
local depends on libncurses5; however:
Package libncurses5 is not installed.
local depends on libnss3-tools; however:
Package libnss3-tools is not installed.

dpkg: error processing package local (--install):
dependency problems - leaving unconfigured
Processing triggers for mailcap (3.70+nmu1ubuntu1) …
Processing triggers for gnome-menus (3.36.0-1ubuntu3) …
Processing triggers for desktop-file-utils (0.26-1ubuntu3) …
Processing triggers for hicolor-icon-theme (0.17-2) …
Errors were encountered while processing:
local
$[patrick@main]~❯
```

The interesting thing to note is that the program (in this case, `local`) was NOT fully installed. It was installed, but some dependencies were left uninstalled, and the program was not configured correctly.

What to do now?

The good news is that fixing this issue is easy with the `sudo apt install -f` command. This command checks for any broken dependencies in the package management system and automatically fixes them. Let's break down what each part of the command does:

*   `sudo`: The sudo command runs the command following with administrative or root privileges.
*   `apt`: The apt command is a package management utility in Ubuntu and other Debian-based Linux distributions used to manage software packages.
*   `install`: The install command is used to install packages.
*   `-f`: The -f option stands for "fix" and is used to fix broken dependencies in the package management system.

When you run `sudo apt install -f`, the command will check for any missing or broken dependencies and attempt to fix them automatically. Afterward, it sets up all unconfigured packages. This can help ensure that your system runs smoothly and that all the necessary software packages are installed correctly.

Here's an example of running `sudo apt install -f` on my system that had broken dependencies after the command above:

```plaintext
$[patrick@main]~❯ sudo apt install -f
Reading package lists… Done
Building dependency tree… Done
Reading state information… Done
Correcting dependencies… Done
The following additional packages will be installed:
libncurses5 libnss3-tools libtinfo5
The following NEW packages will be installed:
libncurses5 libnss3-tools libtinfo5
0 upgraded, 3 newly installed, 0 to remove and 15 not upgraded.
1 not fully installed or removed.
Need to get 771 kB of archives.
After this operation, 3,074 kB of additional disk space will be used.
Do you want to continue? [Y/n]
Get:1 http://th.archive.ubuntu.com/ubuntu jammy/universe amd64 libtinfo5 amd64 6.3-2 [99.2 kB]
Get:2 http://th.archive.ubuntu.com/ubuntu jammy/universe amd64 libncurses5 amd64 6.3-2 [107 kB]
Get:3 http://th.archive.ubuntu.com/ubuntu jammy-updates/universe amd64 libnss3-tools amd64 2:3.68.2-0ubuntu1.2 [565 kB]
Fetched 771 kB in 1s (756 kB/s)
Selecting previously unselected package libtinfo5:amd64.
(Reading database … 246447 files and directories currently installed.)
Preparing to unpack …/libtinfo5_6.3-2_amd64.deb …
Unpacking libtinfo5:amd64 (6.3-2) …
Selecting previously unselected package libncurses5:amd64.
Preparing to unpack …/libncurses5_6.3-2_amd64.deb …
Unpacking libncurses5:amd64 (6.3-2) …
Selecting previously unselected package libnss3-tools.
Preparing to unpack …/libnss3-tools_2%3a3.68.2-0ubuntu1.2_amd64.deb …
Unpacking libnss3-tools (2:3.68.2-0ubuntu1.2) …
Setting up libtinfo5:amd64 (6.3-2) …
Setting up libnss3-tools (2:3.68.2-0ubuntu1.2) …
Setting up libncurses5:amd64 (6.3-2) …
Setting up local (6.6.1-20230202.4) …
Processing triggers for man-db (2.10.2-1) …
Processing triggers for libc-bin (2.35-0ubuntu3.1) …
$[patrick@main]~❯
```

Long story short: if you ever encounter any unconfigured dependencies while installing a program on Ubuntu, just remember to run `sudo apt install -f`, and you'll be good to go.
