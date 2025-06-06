---
title: Switching from Ubuntu to Windows with WSL
description: >-
  Learn how to set up WSL on Windows 11 and run Linux like Ubuntu alongside
  Windows, with tips on installation, file system challenges, and long filename
  errors.
summary: >-
  Setting up WSL on Windows 11 allows you to run Linux distributions like
  Ubuntu, giving you a familiar Linux environment within Windows. This guide
  covers installation steps, file system limitations, and potential issues like
  "Filename too long" errors. While WSL offers a functional Linux-like
  experience, there are challenges, especially with mounting Linux file systems
  and certain development tools. However, it provides a decent solution for
  developers needing Linux on a Windows system.
date: '2024-10-18T19:10:37+07:00'
resources:
  - title: >-
      Photo by [Clint Patterson](https://unsplash.com/@cbpsc1) via
      [Unsplash](https://unsplash.com/)
    src: clint-patterson-yGPxCYPS8H4-unsplash.jpg
tags:
  - ubuntu
  - windows 11
  - WSL 2
  - 100DaysToOffload
unsplash:
  imageid: yGPxCYPS8H4
fmContentType: blog
cover: clint-patterson-yGPxCYPS8H4-unsplash.jpg
---

Recently, I had to install a development environment on Windows 11. As a long-time Linux user, the idea of working in a Windows environment raised some concerns, particularly around maintaining my usual workflow. But knowing that there is something called *Windows Subsystem for Linux* (WSL), I was able to setup my environment as if I was on Ubuntu… Well, mostly. Here's how I jumped ship.

**Setting up WSL on Windows 11** is easy, after you sat through hours of "just some more moments" of setting up Windows 11. Do your Windows Update chores, install a proper Antivirus program and remove all bloat ware. Then you are good to go.

We assume that you want to install the latest Ubuntu LTS release, which at this time is 24.04. If you wish to install a specific Linux environment read on after this quick start.

Open a PowerShell window with admin rights. You can do that by clicking the WIN-key, then type powershell and look for the "Run as Administrator" link on the right side. Once open type:

```powershell
wsl --install
```

This is all. You will be asked a bunch of set up questions, it will install all required packages and --- if missing --- the whole WSL, and then Windows wants to restart… again. After the restart a popup window asks you to create your user (with root rights) and you are good to go.

After that you will find an item named "Ubuntu" in your start menu, that will basically start a terminal within your new Ubuntu installation. You can start installing packages and set up your dotfiles. Have fun.

If you wish to know on what operating system you are running just run

```bash
lsb_release -a
```

in your Ubuntu. In my case it returned *Ubuntu 24.04.1 LTS*.

While I was happy with the default Ubuntu installation, WSL also supports other distributions like Debian, OpenSUSE, and Kali Linux. To view the available distributions, open your PowerShell again (NOT your Ubunutu shell) and run:

```bash
wsl --list --online
```

This command provides a list of Linux distributions that can be installed using WSL, giving you the option to switch or add more distributions if needed. At this moment the following distributions seem to be available:

```plaintext
NAME                            FRIENDLY NAME
Ubuntu                          Ubuntu
Debian                          Debian GNU/Linux
kali-linux                      Kali Linux Rolling
Ubuntu-18.04                    Ubuntu 18.04 LTS
Ubuntu-20.04                    Ubuntu 20.04 LTS
Ubuntu-22.04                    Ubuntu 22.04 LTS
Ubuntu-24.04                    Ubuntu 24.04 LTS
OracleLinux_7_9                 Oracle Linux 7.9
OracleLinux_8_7                 Oracle Linux 8.7
OracleLinux_9_1                 Oracle Linux 9.1
openSUSE-Leap-15.6              openSUSE Leap 15.6
SUSE-Linux-Enterprise-15-SP5    SUSE Linux Enterprise 15 SP5
SUSE-Linux-Enterprise-15-SP6    SUSE Linux Enterprise 15 SP6
openSUSE-Tumbleweed             openSUSE Tumbleweed
```

To install one of these other releases (`Ubuntu` will install the latest Ubuntu LTS) you run, for instance for `Debian`:

```powershell
wsl --install Debian
```

Installing specific distributions will add them next to already existing distributions. Run `wsl --help` to see how to update, remove, and manage all these beautify Linuxes.

If I [understand the concept right](https://learn.microsoft.com/en-us/windows/wsl/use-custom-distro), then it is possible to install any other distribution that is available "somewhere online". Either add `--web-download` as parameter for online distributions or create your own distribution from a Docker container. I will invest some time to dig deeper into this.

**What about a graphical interface on WSL?** This is a tempting but not-so-great idea. There is the possibility of running a graphical interface on top of WSL, allowing users to work with a full Linux desktop environment or window manager. For example, you can set up a window manager like i3 or XFCE on top of WSL2. If you're curious, you can follow a guide like [this one](https://aymen-furter.medium.com/running-a-window-manager-on-top-of-wsl2-a82bdc8f3c88) for doing that.

It's a performance overhead though, slow, some programs don't behave like expected… not worth the time.

## Issues

If it sounded like the whole world is full of flowers and butterflies with Ubuntu on WSL… I am sorry to bring up some issues I experienced.

### Mounting Linux file systems on Windows 11

While WSL is great for running Linux distributions, mounting Linux file systems like ext4 under Windows 11 presents its own set of problems. Windows does not natively support Linux file systems like ext3, ext4, Btrfs, or XFS. To access these partitions, users typically rely on third-party tools such as [Ext2Fsd](https://sourceforge.net/projects/ext2fsd/) or [Linux File Systems for Windows by Paragon Software](https://www.paragon-software.com/home/linuxfs-windows/), but these solutions come with limitations and paid-only features.

Even with WSL, there is an additional restriction: WSL can only mount and access Linux partitions if they are located on a *separate physical drive* from the one where Windows and WSL are installed. This creates a challenges for dual-boot setups or Linux partitions on the same drive. As a result, you need to either move these partitions to an external drive or use third-party software to interact with them from the Windows environment. There is a lot of data movement involved, if you didn't know that before.

My advise would be to move backups of all drives on an external drive to have at least access to the file contents --- before the switch to WSL.

### "Filename too long" errors (on not so very long file names)

Another issue I encountered after switching to Windows 11 is the "Filename too long" error. Windows traditionally limits file paths to 260 characters, including the full directory structure and filename. When working with deep directory structures or long file names, this limit can be exceeded, preventing access to or manipulation of the files. This can be resolved by enabling the **LongPathsEnabled** setting in Windows 10 and later versions, which removes the path length restriction for applications that support it. Until this setting is configured, it's advisable to use shorter directory and file names to avoid the error.

Just run in PowerShell (as Administrator) the following command:

```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
-Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

[Read more](https://learn.microsoft.com/en-us/windows/win32/fileio/maximum-file-path-limitation?tabs=powershell)

I am keeping my opinion on why this has to be done explicitly instead of being available out of the box strictly with myself.

### It's kind of a Docker container on Windows

The problem with this statement is, that it's wrong. I don't know what exactly WSL is, because any research ended in paragraph long explanations how it's Linux on Windows but not a virtual machine, but maybe it is, but not all and it's running directly under Windows and bla bla bla. I don't really care what it is, in the end it seems to be a closed down environment in a box. Using VSCode it's relatively easy to "connect" to a WSL instance and work in it as if we are on Linux. That is one of the use cases that I wanted to accomplish. It suggests though that the whole installation is within a confined system.

Take into account that, when trying to connect a PhpStorm instance with my Ubuntu, I basically killed GPG and all SSH functionality on that distribution. PhpStorm is changing the configuration and hanging itself between the shell and GPG, basically disabling all features required to push and pull, or even commit to Git. That is probably a story for another day.

## Long story short

Pretending to be on Ubuntu on a bash terminal while still running on Windows 11 is possible, with plenty of caveats using WSL. It's ok, if you are forced to work on your websites under a Windows. Installing it does not take too much time and just one single restart. It's not a proper Ubuntu and it has its drawbacks. But for now I can work with it ;]
