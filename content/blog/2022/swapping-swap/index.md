---
type: blog
title: Swapping swap
description: ""
summary: ""

date: 2022-06-06T19:33:56+07:00
publishDate: 2022-06-06T19:33:56+07:00
lastmod: 2022-06-06T20:09:47+07:00

resources:
  - title: Photo by [Glen Noble](https://unsplash.com/@glennoble) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg

tags:
  - ubuntu
  - howto
  - 100DaysToOffload
---

My main workstation recently tends to just close VSCode or Google Chrome on me and I had the slight feeling, that it's not personal but more related to available swap space. I was wondering how to find out if memory issues are the cause and how to add some more swap space so everyone (including me) could be happy.

**How to find out if memory issues are the cause for programs suddenly closing down:**

This one is relatively easy, as soon as one has found out how to ask the question on, ehem, [Stackexchange](https://askubuntu.com/q/1408784/57770) ;)

With `journalctl -u systemd-oomd` we receive quite clear explanations why a service called `systemd-oomd` killed processes.

```log
Jun 02 16:52:32 main systemd-oomd[722]: Killed /user.slice/user-1000.slice/user@1000.service/app.slice/snap.discord.discord.2784b334-5dc8-4d5f-9e38-9cf0b3a8a742.scope due to memory pressure for /user.slice/user-1000.slice/user@1000.service being 78.56% > 50.00% for > 20s with reclaim activity
Jun 02 20:34:16 main systemd-oomd[722]: Killed /user.slice/user-1000.slice/user@1000.service/app.slice/app-gnome-google\x2dchrome-121229.scope due to memory pressure for /user.slice/user-1000.slice/user@1000.service being 67.60% > 50.00% for > 20s with reclaim activity
Jun 03 19:41:23 main systemd-oomd[831]: Killed /user.slice/user-1000.slice/user@1000.service/app.slice/app-gnome-code-85943.scope due to memory pressure for /user.slice/user-1000.slice/user@1000.service being 79.93% > 50.00% for > 20s with reclaim activity
```

This OOM service is a new service, that simply kills all processes that are using more than 50% of the available memory. They "sell" it as a replacement for the `killall` command, which is nice, but once I have a larger project open in VSCode or PHPStorm they just get closed down, even if the IDE is just trying to index a larger codebase.

The solution would be to disable the service or add more swapspace to the system. Now, for a while I had this policy of adding twice the amount of RAM as swap to the system whenever I installed Ubuntu, but lately I just let it slide and let Ubuntu decide by itself on installation what the amount of swap shall be.

You can easily list the available swap space with the following command:

```bash
> grep Swap /proc/meminfo
SwapTotal:      8290300 kB
```

As you can see the amount of swap space is pretty low (8GB, the same amount as my RAM), so I had to add more swap space.

**How to extend the swap space:**

The process of adding more swapspace is quite easy and concise. We first switch off the current swap, then add a new swapfile, then restart the swap space. In a last step the swap is made permanent on reboots by adding the new swapfile to the `/etc/fstab` file.

Before you start this procedure you might want to close down all unnecessary programs that are running in the background (messenger, Dropbox, etc.), because everything in the current swap space will be loaded into your RAM.

The following commands will do the job:

```bash
sudo swapoff -a
sudo dd if=/dev/zero of=/swapfile bs=1G count=16
sudo chmod 0600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

The first command (`swapoff`) will stop the use of swap for now and can take several minutes to complete, because everything currently in the swap file will be moved into your RAM. `dd` creates a file named `swapfile` in your system root directory with the size of 16GB (base size of 1GB times count of 16), `chmod` will make sure that the file can be read and written to by the system, `mkswap` will activate the file as swap and `swapon` will restart the swapping.

After these steps edit `/etc/fstab` and add the following line to make the change persistent after reboots:

```bash
/swapfile   swap   swap    sw   0   0
```

If there is already a partition or file set as swap space we either delete the line or keep it as additional swap partition. I left the partition in as even more swap space. I'll keep an eye on it and we will see if two swap spaces will irritate the system.

Once done do a quick reboot to see if everything worked out as expected. You can then check your swap and will see the increased space:

```bash
> grep Swap /proc/meminfo
SwapCached:       135240 kB
SwapTotal:      25067512 kB
SwapFree:       24216476 kB
```

If we want to know the exact setup of the swap space on a workstation the command `swapon -s` will show a list of swaps and their configuration.

```bash
❯ swapon -s
Filename   Type       Size      sed    Priority
/swapfile  file       16777212  52580  -2
/dev/sda2  partition   8290300      0  -3
```

Let's see if that makes VSCode and PHPStorm happy. I know a certain project that keeps killing my IDEs (a Hugo website with a lot (~20) of modules that are all loaded in a VSCode workspace to be worked on) that will happily load everything into the swap space if it worked right.

If not, we can always disable the OOM service. But about this later on.
