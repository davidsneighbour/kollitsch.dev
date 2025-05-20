---
$schema: /static/_schemata/blog.schema.yaml
title: Shutdown Raspberry Pi via SSH
description: >-
  A quick guide to shutting down your Raspberry Pi via SSH without a password.
  Simplify the process with aliases and an exported variable for easy
  management.
summary: >-
  Learn how to enable passwordless shutdown and reboot for your Raspberry Pi via
  SSH. Configure sudoers for secure commands and streamline access with aliases.
date: 2024-11-25T21:59:18.000Z
publishDate: 2024-11-25T21:59:18.000Z
lastmod: 2024-11-25T22:35:16.000Z
resources:
  - title: >-
      Photo by [Louis Reed](https://unsplash.com/@_louisreed) via
      [Unsplash](https://unsplash.com/)
    src: louis-reed-MaDXpqp1vM0-unsplash.jpg
tags:
  - raspberrypi
  - bash
  - howto
  - 100DaysToOffload
unsplash:
  imageid: MaDXpqp1vM0
fmContentType: blog
---

I recently tried to shutdown my raspberry pi (a little headless machine for the boring tasks) via SSH with a single command, but experienced some issues. Here's a quick guide to help you shutdown your Raspberry Pi via SSH without having to use a `sudo` password. The initial situation is a Raspberry Pi server running headless, with an SSH key for authentication.

When trying to run `ssh raspberrypi.local -t "/usr/sbin/shutdown now -h"` the following error is encountered:

```bash
Call to PowerOff failed: Interactive authentication required.
```

This happens because the `shutdown` command on Raspberry Pi OS bookwork requires root privileges. To enable a password-less shutdown via SSH command we need to put the `shutdown` command into the `sudoers` file, this way allowing it to run without authentication. Because we authenticate with a key, this is secure enough for our use case.

The following three steps guide you through the process:

1. **Edit the sudoers file**:
   Open the `sudoers` file on your Raspberry Pi:

   ```bash
   sudo visudo
   ```

   Add this line at the end, replacing `your-username` with your actual username:

   ```bash
   your-username ALL=(ALL) NOPASSWD: /usr/sbin/shutdown
   ```

2. **Test the configuration**:
   Run the following SSH command from your local machine to test:

   ```bash
   ssh raspberrypi.local -t 'sudo /usr/sbin/shutdown now -h'
   ```

   The command should execute now without prompting for a password.

3. **Set up an alias for convenience (optional)**:
   Add an alias to your local shell configuration file (`~/.bashrc`) to streamline future shutdowns:

   ```bash
   alias shutdown_pi='ssh raspberrypi.local -t "sudo /usr/sbin/shutdown now -h"'
   ```

While this setup allows for a password-less shutdown of your Raspberry Pi, note that it introduces a potential security risk. Ensure your SSH key is secure, and prevent unauthorized access to your little Pi computer.
