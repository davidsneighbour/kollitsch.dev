---
title: Handling Ubuntu EFI boot issues on Acer laptops
description: Fix Ubuntu EFI boot problems on Acer laptops with manual workarounds, boot-repair diagnostics, and commands for resolving GRUB issues.
date: 2026-01-14T21:36:17.779Z
tags:
  - howto
  - ubuntu
  - acer
  - uefi
  - efi
  - 100daystooffload
cover:
  src: ./artiom-vallat-mx9axbKqKW8-unsplash.jpg
  type: image
---

**Installing Ubuntu (or any other Linux system) on some Acer notebooks will result in "No bootable devices found" errors after the installation and reboot.**

Back in 2022, [I documented an EFI boot issue on Acer hardware](/blog/2022/ubuntu-efi-and-acer/) that forced Ubuntu users into manual fixes. Recently, I had to reinstall my small Acer notebook once again, and unsurprisingly, the exact same problem reappeared.

This post is an updated, practical version of that experience, due to its repeating nature (it was that time of the year again) with full commands, and some context that still feels weird to say out loud in 2026.

## A note on `boot-repair`

Before applying any manual EFI workaround, it is worth mentioning `boot-repair`.

On many systems, especially those that are *not* affected by Acer's firmware behaviour, `boot-repair` can completely resolve EFI and GRUB issues automatically. Even on Acer hardware where it cannot fix the underlying firmware limitation, it is still a very useful diagnostic and recovery tool.

What boot-repair can help with:

* Reinstalling GRUB cleanly
* Restoring a missing or broken boot menu
* Making the installed system bootable enough to continue troubleshooting
* Collecting detailed system and boot information

Most importantly, it can generate a comprehensive report that can be uploaded to a pastebin-like service. This is often helpful when asking for advise on forums, as it provides a structured overview of disks, partitions, EFI entries, and GRUB configuration.

From a live-CD Ubuntu system, boot-repair can be installed and started like this:

```bash
sudo add-apt-repository ppa:yannubuntu/boot-repair
sudo apt-get update
sudo apt-get install -y boot-repair && boot-repair
```

If you are lucky and not dealing with an Acer-specific firmware quirk, this may already fix the issue entirely.

If not, it still leaves you with:

* A freshly installed GRUB
* A visible boot menu
* A solid diagnostic report to share when asking for help online

In other words, boot-repair is often a good first step, even if the final fix still requires manually interfering with your boot sector.

## The core issue, still unchanged

Some Acer systems refuse to boot Linux unless the EFI bootloader is located in a very specific place and named in a very specific way. Safe boot completely blocks that. Normal boot will complain about "no bootable devices found". Ubuntu for instance installs its EFI files correctly according to the spec, but the firmware simply ignores them --- for "security" reasons.

Instead of honouring `EFI/ubuntu/` (created by the Ubuntu install), the firmware looks for a hardcoded path under `EFI/Linux` (case matters here).

The workaround remains simple and effective:

* Rename or copy the `ubuntu` EFI folder to `Linux`
* Ensure `bootX64.EFI` exists directly inside that folder (no symlink)

## Finding the correct EFI partition

Before touching anything, identify the EFI System Partition.

From the Ubuntu live system, run:

```bash
lsblk -f
```

You are looking for a small (usually 100 to 500 MB) FAT32 partition with the label or type `EFI`.

Typical indicators:

* Filesystem: vfat
* Mount point may be empty
* Often named something like `nvme0n1p1` or `sda1`
* The partition does not require much space, so it might be smaller than 1GB

Do not guess. If you pick the wrong partition, you will break things.

## Mounting the EFI partition

Once identified, mount the EFI partition. In this example, we use `/mnt/fix` as the mount point:

```bash
sudo mkdir -p /mnt/fix
sudo mount /dev/nvme0n1p1 /mnt/fix
```

Adjust `/dev/nvme0n1p1` to match the identified EFI partition.

You should now see an `EFI` directory:

```bash
ls /mnt/fix/EFI
```

Typical contents include `ubuntu`, `BOOT`, or other vendor-specific folders.

## Copying and renaming the EFI loader

First, create a copy of the Ubuntu EFI directory under `EFI/Linux`:

```bash
sudo cp -r /mnt/fix/EFI/ubuntu /mnt/fix/EFI/Linux
```

Then ensure the fallback bootloader exists inside that folder:

```bash
sudo cp /mnt/fix/EFI/BOOT/bootX64.EFI /mnt/fix/EFI/Linux/
```

Your final structure should look like this:

```text
EFI/
├─ BOOT/
│  └─ bootX64.EFI
├─ ubuntu/
│  └─ grubx64.efi
└─ Linux/
   ├─ grubx64.efi
   └─ bootX64.EFI
```

This new directory will be used by Acer to boot the proper system.

## Important note about reboots

All of these steps are done on a live system from an USB installation stick. Once we reboot:

* The live environment is gone
* The EFI partition is no longer mounted
* Starting again from the live USB is always an option

If something goes wrong, do not try to "fix" it from the installed system. Boot the live stick again and repeat the process from the beginning.

## A frustrating but telling pattern

What makes this issue especially irritating is not that Linux cannot handle the hardware. Ubuntu runs perfectly fine on these machines once booted.

The problem is the vendors firmware behaviour.

Whether this is corporate greed, service avoidance, or simple indifference is hard to say. What is clear is that:

* The hardware is fully capable
* Linux support is artificially constrained
* Users are pushed towards vendor-approved operating systems

In 2026, this still feels unnecessary and hostile, especially when the fix is this trivial.

It should not be necessary. But until vendors stop shipping firmware that ignores standards, knowing how to repair EFI manually remains a useful survival skill. Ubuntu itself could add a boot entry under `EFI/Linux` when it detects Acer, but that would be quite hackish.
