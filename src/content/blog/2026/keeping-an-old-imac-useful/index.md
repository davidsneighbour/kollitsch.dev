---
title: "Keeping an old iMac useful"
subtitle: "Xubuntu 22.04, NVIDIA Legacy Drivers, and H.264 Video"
description: "a"
summary: ""
tags: []
cover:
  src: "tigran-kharatyan-lL1NCmptNYw-unsplash.jpg"
  type: image
  title: "Photo by [Tigran Kharatyan](https://unsplash.com/@t1ko) on [Unsplash](https://unsplash.com/photos/a-close-up-of-an-apple-logo-on-a-silver-surface-lL1NCmptNYw)"
date: 2026-07-25T13:00:00Z
src: https://chatgpt.com/c/6a3dd96d-68d4-83ec-9e67-3fb4d7b72736
---

I acquired an old iMac last year that I want to keep useful for simple jobs: media playback, note taking, light browsing and whatever one understands when we say "general household use".

This is not meant to be a modern workstation. It couldn't be. It does not need the newest desktop environment, the newest kernel or the newest driver stack. It needs to be stable, quiet enough, fast enough, and it should not switch off because of overheating after an hour of work.

The problem was video playback. With a newer Ubuntu/Xubuntu setup, videos froze and browser playback needed very low quality or it would have been buffering or stocking every so often. The hardware was still usable, but the modern defaults were not a good match for this old Mac.

I also have to admit, that the internal fan is not working on this machine and watching videos would heat it up fast, so that it shut down every now and then. For a while I tried debugging the fan issues and somehow get the fan going, but after "doing everything I could" I just have to assume that the fan is dead. I am now working with little USB fans from the outside and a nice switch-off-and-cool-down-treatment every now and then.

My working solution for the above requirements was this:

* Xubuntu 22.04 LTS (Ubuntu 22.04 / Jammy based)
* XFCE desktop
* 5.15 GA kernel (GA = general availability?)
* NVIDIA legacy drivers for the graphic card
* H.264-first video playback
* No HWE kernel stack
* No release upgrades away from 22.04 (for now)
* No `jammy-proposed` update channel

This post documents the decisions, the journey, the mistakes, the fixes and the final state. It's going to be a long one and might not be of interest to you, dear reader, so read on --- on your own advise.

## Table of contents

* [Table of contents](#table-of-contents)
* [Final (current) state of this machine](#final-current-state-of-this-machine)
* [Warning: Do not blindly copy the NVIDIA driver number](#warning-do-not-blindly-copy-the-nvidia-driver-number)
* [Why Xubuntu 22.04 instead of the latest Ubuntu?](#why-xubuntu-2204-instead-of-the-latest-ubuntu)
* [Booting the installer from an USB key](#booting-the-installer-from-an-usb-key)
* [Installing Xubuntu 22.04](#installing-xubuntu-2204)
* [Installing the 5.15 GA kernel](#installing-the-515-ga-kernel)
* [Installing the NVIDIA legacy driver](#installing-the-nvidia-legacy-driver)
* [Why the newer kernel may cause package problems](#why-the-newer-kernel-may-cause-package-problems)
* [Preventing unwanted release upgrades](#preventing-unwanted-release-upgrades)
* [Disable jammy-proposed](#disable-jammy-proposed)
* [Preventing accidental HWE or 6.x kernel installs](#preventing-accidental-hwe-or-6x-kernel-installs)
* [Ubuntu Pro](#ubuntu-pro)
* [Now let's OCD a little bit about the heat](#now-lets-ocd-a-little-bit-about-the-heat)
  * [Reducing CPU heat](#reducing-cpu-heat)
  * [Video playback: Prefer H.264](#video-playback-prefer-h264)
  * [VLC settings](#vlc-settings)
  * [Browser video: Force H.264](#browser-video-force-h264)
  * [Checking arbitrary video files for the format they are using](#checking-arbitrary-video-files-for-the-format-they-are-using)
  * [Downloading H.264 video formats with yt-dlp](#downloading-h264-video-formats-with-yt-dlp)
  * [Watching temperatures during playback](#watching-temperatures-during-playback)
* [Final state](#final-state)

## Final (current) state of this machine

I originally thought of this as just "my old 2012 iMac". The important detail, however, is not only the year. The exact GPU matters because apparently there were multiple extremely differing models around back in those years.

Linux identifies this machine as having:

```text
NVIDIA Corporation GK104M [GeForce GTX 775M Mac Edition]
PCI ID: 10de:119d
```

The final working state is:

```text
OS:            Xubuntu 22.04.5 LTS / Jammy
Kernel:        5.15.0-185-generic
GPU:           NVIDIA GeForce GTX 775M Mac Edition
NVIDIA driver: 390.157
Active driver: nvidia
Removed:       6.8.0-130 HWE kernel packages
Desktop:       XFCE
Known issue:   internal fan reports 0 RPM
Cooling:       external fans until chassis inspection
```

To verify my system status I run the following commands:

```bash
uname --kernel-release
5.15.0-185-generic

nvidia-smi
NVIDIA-SMI 390.157
Driver Version: 390.157

lspci -nnk | grep --after-context=4 --extended-regexp 'VGA|3D|Display'
Kernel driver in use: nvidia

dpkg --audit
# no output

dpkg --list | grep '6.8.0-130' || true
# no output
```

That means:

* The system boots the intended 5.15 kernel (I'll explain below)
* The proprietary NVIDIA driver is active. (I'll explain below)
* The broken DKMS loop caused by the newer 6.8 HWE kernel is gone. (I'll explain below)
* The package state is clean. This is just to verify that we don't have any broken dependencies or unused and not preferred packages installed.

## Warning: Do not blindly copy the NVIDIA driver number

This article uses `nvidia-driver-390` because that is the recommended graphics driver for this exact GPU.

The command `ubuntu-drivers devices` will print `driver : nvidia-driver-390 - distro non-free recommended`. That does not mean every old iMac should use 390.

Different iMacs from roughly the same period can have different NVIDIA GPUs. Some may need the 390 legacy branch. Some may need the 470 legacy branch. Some may even work better with a Nouveau driver. Some may need a different kernel/driver combination.

Before installing any NVIDIA driver, check the actual hardware:

```bash
lspci -nnk | grep --after-context=4 --extended-regexp 'VGA|3D|Display'
ubuntu-drivers devices
```

Use this decision table:

```text
ubuntu-drivers recommends nvidia-driver-390
    -> use the 5.15 GA kernel and install nvidia-driver-390

ubuntu-drivers recommends nvidia-driver-470
    -> use the recommended 470 package instead of copying the 390 commands

ubuntu-drivers recommends only nouveau
    -> test Nouveau first, if that does not work force older proprietary drivers

DKMS tries to build the driver for a newer HWE kernel and fails
    -> boot the working GA kernel, remove the incompatible HWE kernel packages, then reconfigure packages
```

Identify the exact GPU, then use Ubuntu's driver recommendation. Avoid incompatible newer kernels. And keep verifying the active kernel and active graphics driver, because as long as we are not done settings this up properly Linux will try to improve a setup it deems not optimal.

For my old iMac we go with a 5.15 kernel and nvidia-driver-390.

## Why Xubuntu 22.04 instead of the latest Ubuntu?

The machine is old. It does not need GNOME animations, a heavy desktop session or the newest graphics stack. It needs a light desktop and a stable software base. It also requires an older Kernel version that might not be around in the latest versions. Standard Ubuntu with GNOME is heavier than necessary for this use case. Xubuntu uses XFCE, which is lighter, easier to tune and better suited to older CPUs and GPUs.

The release choice matters too. Xubuntu 22.04 is based on Ubuntu 22.04 LTS, codenamed Jammy Jellyfish.

There is an important support distinction:

* Xubuntu 22.04 flavour support ended earlier than the Ubuntu 22.04 base.
* Ubuntu 22.04 LTS itself continues to receive standard LTS security maintenance.
* Ubuntu Pro / ESM can extend security coverage further.

For this machine, that trade-off is acceptable. I am not trying to run the newest desktop. I am trying to keep a stable old media and browsing machine alive. And with this setup it will be supported until May 2032. Which might be longer than this computer has to live, if we are being honest.

The target setup is:

```text
Use case:        media playback, notes, browsing
Priority:        stability
Desktop:         XFCE
Base system:     Ubuntu 22.04 LTS / Jammy
Kernel target:   5.15 GA kernel
GPU driver:      Ubuntu-recommended NVIDIA legacy driver
Avoid:           latest HWE kernel stack
```

We do not optimise for newest, latest, coolest, we optimise for working and getting security updates as soon as they are released.

## Booting the installer from an USB key

The first hurdle ;]

On a Mac, the USB boot device is not selected through GRUB. That would be too easy. The USB installer must be selected before anything else runs, which is through the Mac firmware boot picker. Previous MacOS systems might have left-over settings that hide this menu or make it more inaccessible.

The final successful method for me was this order:

1. Insert the Xubuntu USB stick.
2. Shut the iMac down completely by pushing the button on the back for 10+ seconds.
3. Take out the power cable and leave it for a couple of minutes.
4. Connect a wired USB keyboard (bluetooth keeyboard might be too slow to connect and the Mac will ignore the pressed key).
5. Hold `Option` (on a Mac keyboard) or `Alt` (the left one, on a normal keyboard) key.
6. Press the power button.
7. Keep holding `Option` or `Alt` until the boot picker appears.
8. Select the USB entry, usually listed as "EFI Boot".

## Installing Xubuntu 22.04

I then installed a clean Xubuntu 22.04 system. The currently downloadable LTS version is 22.04.5. I completely formatted the hard drive and removed everything. **With that the old MacOS was gone too.** Talk about burned bridges… The installation went smooth. After the first boot into the new system I ran a quick update of only the current system (no upgrade):

```bash
sudo apt update
sudo apt full-upgrade
sudo reboot
```

After that a system check is recommended:

```bash
lsb_release --all
uname --kernel-release
lspci -nnk | grep --after-context=4 --extended-regexp 'VGA|3D|Display'
ubuntu-drivers devices
```

In my case the machine reported:

```text
Ubuntu: 22.04.5 LTS / Jammy
Kernel: 6.8.0-130-generic
GPU:    NVIDIA GK104M / GeForce GTX 775M Mac Edition
Driver: nouveau currently active
Ubuntu recommendation: nvidia-driver-390
```

That told us two things:

* The install was correct
* The kernel was not ideal

The Xubuntu 22.04.5 installer had installed a newer HWE kernel, `6.8`, but the old NVIDIA 390 driver needed a more compatible kernel. For this setup, the target is always the 5.15 GA kernel line.

## Installing the 5.15 GA kernel

Install the GA kernel meta packages:

```bash
sudo apt update
sudo apt install linux-generic linux-headers-generic build-essential dkms
sudo update-grub
sudo reboot
```

After reboot:

```bash
uname --kernel-release
```

The goal is to see something like `5.15.0-...` - but the system will still boot into the newer 6.8 kernel. Reboot again and use the GRUB menu. Select `Advanced options for Ubuntu` and then choose a `5.15.0-...-generic` kernel.

If you need to make GRUB visible at boot change it's settings:

```bash
sudoedit /etc/default/grub
```

Set:

```ini
GRUB_TIMEOUT_STYLE=menu
GRUB_TIMEOUT=5
```

`5` means show the menu for 5 seconds. If you are of the slower kind then increase this number. Then update GRUB:

```bash
sudo update-grub
```

After reboot and setting the kernel confirm that you are on the 5.15 kernel. Confirm it again.

## Installing the NVIDIA legacy driver

Once booted into the 5.15 kernel, install the driver recommended by Ubuntu. In my case that was the `390` driver package, on other issues it might be a `470` driver.

```bash
sudo apt install nvidia-driver-390
sudo reboot
```

Now we verify that we are using the right driver:

```bash
uname --kernel-release
nvidia-smi
lspci -nnk | grep --after-context=4 --extended-regexp 'VGA|3D|Display'
```

The successful state looked like this:

```text
Kernel: 5.15.0-185-generic
NVIDIA-SMI: 390.157
Kernel driver in use: nvidia
```

The important line is:

```text
Kernel driver in use: nvidia
```

If it says anything else then the proprietary NVIDIA driver is not active.

## Why the newer kernel may cause package problems

My first successful NVIDIA setup still had a hidden issue: the 6.8 HWE kernel was still installed. If you followed my earlier instructions then gladly ignore the following rant and continue with the prevention of unwanted version upgrades of Xubuntu.

Installing `nvidia-dkms-390` will result in the post-install-script trying to build the NVIDIA module for both kernels. This will fail for newer kernels like 6.8. The result will be a broken package state:

```bash
nvidia-dkms-390 is not configured
nvidia-driver-390 is not configured
```

The fix here was to remove the unwanted HWE kernel packages and let DKMS configure only against the working 5.15 kernel. First we confirm that the system is currently running the good 5.15 kernel *again* by running `uname --kernel-release`. It must start with `5.15`. If not, let's go back to the kernel setup chapter of this journey ;)

To generate a safe package list for the exact unwanted kernel run this command:

```bash
dpkg --list \
  | awk '$1 ~ /^(ii|iU|rc)$/ && ($2 ~ /^linux-.*6\.8\.0-130/ || $2 ~ /^linux-(generic|image-generic|headers-generic|tools-generic)-hwe-22\.04$/) { print $2 }' \
  | sort --unique \
  | tee /tmp/purge-6.8-kernel-packages.txt
```

This will create a list of packages in `/tmp/purge-6.8-kernel-packages.txt`. Inspect it and make sure it includes only packages that refer to the kernel you don't want. Make sure it does NOT name any 5.15 kernel packages. In my case it looked like this:

```plaintext
linux-headers-6.8.0-130-generic
linux-image-6.8.0-130-generic
linux-modules-6.8.0-130-generic
linux-modules-extra-6.8.0-130-generic
linux-tools-6.8.0-130-generic
```

Then purge them:

```bash
sudo xargs --arg-file=/tmp/purge-6.8-kernel-packages.txt --no-run-if-empty apt purge --yes
```

Clean up and reconfigure pending packages:

```bash
sudo rm --force /var/crash/nvidia-dkms-390.0.crash
sudo dpkg --configure --pending
sudo apt --fix-broken install
sudo apt autoremove --purge --yes
sudo update-grub
```

Let's reboot again and then once again we verify the final state:

```bash
dpkg --audit                           # no output
uname --kernel-release                 # something like 5.15.0-185-generic
dpkg --list | grep '6.8.0-130' || true # no output
nvidia-smi                             # works
```

At that point the package loop should be fixed.

## Preventing unwanted release upgrades

What we want now is to disable any distribution upgrades (to either 22.10 or 24.04). The system should still receive package and security updates, but it should not offer major release upgrades. We MUST keep the old kernel and the NVIDIA driver package.

Edit `/etc/update-manager/release-upgrades` and set

```ini
Prompt=never
```

This prevents Ubuntu's release upgrader from offering a move to a newer release.

## Disable jammy-proposed

For future configuration and "let's just enable this or that" sessions we need to keep in mind to NEVER enable to install `jammy-proposed` packages. The `proposed` channel is for pre-release update testing, which is not useful for a computer that needs to remain boring and predictable.

The easiest method is to disable it via the "Software" dialogue. Either run it via starter or run `software-properties-gtk` on a terminal. Then go to `Developer Options` and uncheck `Pre-released updates (jammy-proposed)`. Close the dialogue and update the package index.

Confirm it is gone:

```bash
apt-cache policy | grep --ignore-case proposed || true # no output
```

## Preventing accidental HWE or 6.x kernel installs

We do not want to block all kernel updates. That would be a mistake because the machine should still receive future 5.15 security kernels. What we want to block is the HWE/newer kernel family. If in doubt we always can run `sudo apt install linux-generic linux-headers-generic` which should show if any issues are occurring.

Do not "hold" these packages. They keep the system on the Ubuntu 22.04 GA kernel line, which is `5.15.*`.

The easiest fix is to create an apt preferences file that blocks HWE and newer kernel families:

```bash
sudo tee /etc/apt/preferences.d/block-hwe-kernels >/dev/null <<'EOF'
Package: linux-generic-hwe-22.04 linux-image-generic-hwe-22.04 linux-headers-generic-hwe-22.04 linux-tools-generic-hwe-22.04 linux-hwe-*
Pin: version *
Pin-Priority: -1

Package: linux-image-5.19.* linux-headers-5.19.* linux-modules-5.19.* linux-modules-extra-5.19.* linux-tools-5.19.*
Pin: version *
Pin-Priority: -1

Package: linux-image-6.* linux-headers-6.* linux-modules-6.* linux-modules-extra-6.* linux-tools-6.*
Pin: version *
Pin-Priority: -1
EOF
```

This policy can be checked against the packages via

```bash
apt-cache policy linux-generic linux-generic-hwe-22.04 linux-image-generic-hwe-22.04
```

It should show `Installed: (none)` and `Candidate: (none)` for all 6.8 kernels. The HWE packages are not installable due to the negative pin.

Before future upgrades, check kernel-related packages:

```bash
apt list --upgradable 2>/dev/null | grep --extended-regexp 'linux-(image|headers|modules|generic|hwe)' || true
```

Allowed examples:

```bash
linux-generic
linux-headers-generic
linux-image-generic
linux-image-5.15.0-...-generic
linux-headers-5.15.0-...-generic
linux-modules-5.15.0-...-generic
linux-modules-extra-5.15.0-...-generic
```

Suspicious examples:

```bash
linux-generic-hwe-22.04
linux-image-generic-hwe-22.04
linux-image-6.x...
linux-modules-6.x...
linux-headers-6.x...
```

## Ubuntu Pro

For long-term use, attach [Ubuntu Pro](https://ubuntu.com/pro/). This is free for personal use which is what my use-case is:

```bash
sudo pro attach --token YOUR_TOKEN_HERE
sudo pro enable esm-infra
sudo pro enable esm-apps
sudo pro status
```

This does not make old hardware young again. It only helps keep the software base security-maintained for longer. Standard maintenancee for Ubuntu 22.04 ends in May 2027. With Ubuntu Pro this is extended to May 2032.

## Now let's OCD a little bit about the heat

This specific computer also had another already mentioned issue: a dead fan. Fans are useless when they are dead. Good operating systems like Ubuntu just switch it off when a specific temperature is reached which made binge-watching a chore. So I went on a secondary mission to minimise the heat coming from its chassis and components as much as possible.

### Reducing CPU heat

First I installed and enabled thermal management. Don't ask me why this is not installed by default, I have no idea. I would make this default.

```bash
sudo apt install thermald cpufrequtils
sudo systemctl enable --now thermald
```

Set the CPU governor to always run in powersave mode:

```bash
sudo sh -c 'for governor in /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor; do echo powersave > "$governor"; done'
```

If it works without issues it can be made persistent by editing `/etc/default/cpufrequtils`:

```ini
GOVERNOR="powersave"
```

Restart the service with `sudo systemctl restart cpufrequtils` and check with `cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor`.

This may reduce responsiveness at some points, but it is a reasonable trade-off on a fan-compromised media machine.

### Video playback: Prefer H.264

A big improvement was choosing a video codec.

This iMac has an old NVIDIA GPU which is much happier with H.264 than with modern web codecs such as VP9 or AV1. This decision might come up if you every now and then, ehm, download videos from the internet to, ehm, check something. Many videos come in multiple formats. Choosing h.264 is a good idea for this old station.

Install media tools:

```bash
sudo apt install ubuntu-restricted-extras ffmpeg vlc mpv vdpauinfo vainfo
```

Check VDPAU with `vdpauinfo | less`. It will show a list of optimum formats and sizes for videos. For local playback, we use `mpv` or VLC.

Example:

```bash
mpv --hwdec=auto-safe /path/to/video.mp4
```

Try VDPAU explicitly if needed:

```bash
mpv --hwdec=vdpau /path/to/video.mp4
```

The best media format for playback on my station is now:

```text
Container: MP4
Video:     H.264 / AVC / avc1
Audio:     AAC
Quality:   720p or 1080p
FPS:       30 fps if possible
```

So I am converting every video my cameras produce into this format. Unimportant stuff stays at 720p, the important stuff like my baby dogs first bark will be converted to 1080p.

We should always avoid the following formats:

* AV1 / av01
* VP9 / vp09
* H.265 / HEVC / hvc1 / hev1
* 4K
* 60 fps
* 10-bit HDR

### VLC settings

In VLC go to `Tools` -> `Preferences` -> `Input / Codecs` and set `Hardware-accelerated decoding` to `VDPAU video decoder`. If that causes problems, use `Automatic`. Then restart VLC.

For video output go to `Tools` -> `Preferences` -> `Video` and start with `Output` set to `Automatic`. If the playback is glitchy try `X11 video output`.

VLC can play many codecs, but it cannot make AV1, VP9 or heavy HEVC magically cheap for this old GPU. Codec choice still matters.

### Browser video: Force H.264

Browser video is harder because services such as YouTube often prefer VP9 or AV1. This is bad for an old iMac, because decoding then falls back to CPU and causes heat, throttling and freezes. Before I changed these settings watching Youtube videos was very stressful.

In Google Chrome, or Chromium go to `chrome://settings/system` and enable `Use graphics acceleration when available`. Then go to `chrome://gpu` and look for hardware acceleration information. On old NVIDIA 390 systems, browser hardware video decode may still be limited, so the codec choice matters more than the checkbox.

Install [h264ify](https://chromewebstore.google.com/detail/h264ify/aleakchihdccplidncghkekgioiakgal?hl=en) or [enhanced-h264ify](https://chromewebstore.google.com/detail/enhanced-h264ify/omkfmpieigblcllmkgbflkikinpkodlk?hl=en) as a browser extension and configure it to block the following formats:

* AV1
* VP9
* VP8 if needed
* 60fps if needed

Make sure to allow `H.264` obviously.

To see if this works as expected go to youtube, start a video, right-click the video and click `Stats for nerds`. It should show that it uses `avc1` as codec, NOT `vp09` or `av01`.

### Checking arbitrary video files for the format they are using

To check any arbitrary file for its video format use `ffprobe`:

```bash
ffprobe -hide_banner -select_streams v:0 -show_entries stream=codec_name,codec_long_name,width,height,r_frame_rate -of default=noprint_wrappers=1 "video-file.mp4"
```

A good result would be:

```bash
codec_name=h264
codec_long_name=H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10
```

Less good obviously would be:

```bash
codec_name=vp9
codec_name=av1
codec_name=hevc
```

### Downloading H.264 video formats with yt-dlp

If you know you know. For 1080p or lower H.264 use this:

```bash
yt-dlp \
  --format "bv*[vcodec^=avc1][height<=1080][fps<=30]+ba[ext=m4a]/b[ext=mp4][vcodec^=avc1][height<=1080]/best[height<=720]" \
  --merge-output-format mp4 \
  "VIDEO_URL"
```

For the safest option on this old iMac, we limit to 720p:

```bash
yt-dlp \
  --format "bv*[vcodec^=avc1][height<=720][fps<=30]+ba[ext=m4a]/b[ext=mp4][vcodec^=avc1][height<=720]/best[height<=720]" \
  --merge-output-format mp4 \
  "VIDEO_URL"
```

### Watching temperatures during playback

Keep this running during early tests:

```bash
watch --interval 2 'sensors | grep --ignore-case --extended-regexp "Package|Core|Main|TG0|TC0"; echo; nvidia-smi'
```

For this machine, stable playback matters more than maximum quality. If temperatures climb into the high 80s or 90s, stop the test and reduce load. Happily enough our max temperatures are now 74 degrees on the good old Celsius scale.

## Final state

My final successful setup for this "old iMac box" was this:

```text
Machine:       Old iMac, Linux reports GTX 775M Mac Edition
OS:            Xubuntu 22.04.5 LTS / Jammy
Kernel:        5.15.0-185-generic
GPU:           NVIDIA GeForce GTX 775M Mac Edition
Driver:        NVIDIA 390.157
Desktop:       XFCE
Apt policy:    5.15 GA kernel line only
Blocked:       HWE and 6.x kernels
Disabled:      jammy-proposed
Upgrades:      release upgrades disabled
Video target:  H.264 / MP4 / 720p or 1080p
Avoid:         VP9, AV1, HEVC, 4K, 60 fps
Known issue:   internal fan reports 0 RPM
Cooling:       external fans until chassis inspection
```

The main lesson: old machines often do not need the newest Linux release, especially not iMacs. They need the right one that worked best when they were at their peak. For this iMac, the right path was:

* a stable 22.04 LTS base
* an older compatible GA kernel
* the Ubuntu-recommended NVIDIA legacy driver
* a lighter desktop
* blocked HWE kernel path
* disabled release upgrades
* disabled proposed updates
* the right video format - H.264 video
* and careful thermal monitoring

That combination turned the machine from a frustrating entitled overpriced shell of a $&*#@^% into a useful media and internet workstation again.

And that's all I have to say about this at this point in time ;]
