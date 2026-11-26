---
fmContentType: blog
title: "Setting up Myna dictation on Ubuntu with i3"
description: "Myna's setup fails under i3 because no polkit authentication agent is running. Here is why, and how to fix it, including a keyboard shortcut for dictation."
summary: "Myna's setup tool calls pkexec, which fails under i3 because no polkit authentication agent runs. This post explains the error, starts mate-polkit from the i3 config, and binds the Myna dictation toggle to a key with a D-Bus call."
tags: ["ubuntu", "i3", "dictation", "polkit", "snap", "how-to"]
date: 2026-11-26T11:01:53.000Z
cover:
  src: postimages/postimage-for-setting-up-myna-dictation-on-ubuntu-with-i3.jpg
  type: image
  title: Ready to listen, as soon as someone asks for the password.
---

Myna, a dictation tool for Ubuntu, was recently [published as a technology preview](https://ubuntu.com/blog/myna-speech-to-text-technology-preview-available). You use a keyboard shortcut, you talk, and the text shows up wherever your cursor is. Just like Dragon NaturallySpeaking in the good old days of early computing. It ships as a snap (`myna`) with a separate speech recognition backend (`myna-parakeet`), and a small setup program called `myna-config` that installs and connects the pieces for you.

On a stock Ubuntu desktop that probably just works. On my machine, which runs i3 instead of GNOME, it did (of course) not. The setup window opened fine, but the moment I pushed the "Set up" button, I got this:

```plaintext
Executable: pkexec
Arguments: /usr/bin/myna-config --set-up [{"executable":"snap","arguments":["set","system","experimental.user-daemons=true"]},{"executable":"snap","arguments":["install","--edge","myna"]},{"executable":"snap","arguments":["install","--edge","myna-parakeet"]},{"executable":"snap","arguments":["connect","myna:backend","myna-parakeet:provider"]}]
Exit status: 127
Message: Error creating textual authentication agent: Error opening current controlling terminal for the process (`/dev/tty'): No such device or address
```

The setup never ran. Here is what went wrong, and how I fixed it.

## What the error means

`myna-config` needs root rights to install snaps and change a snapd setting. It gets those rights with `pkexec`, which asks [polkit](https://github.com/polkit-org/polkit) for permission. Polkit then asks you for your password.

Polkit does not show that password dialogue itself. A separate program does that: the *authentication agent*. Full desktop environments like GNOME, KDE, XFCE, or MATE start one for you when you log in. i3 is a window manager, not a desktop environment, so it starts nothing like that.

Without a graphical agent, `pkexec` falls back to a text prompt in the terminal. But `myna-config` was started from a launcher, not from a terminal, so there is no terminal (`/dev/tty`) to ask in. `pkexec` gives up with exit status 127, and the setup never starts.

In short: the polkit daemon (`polkitd`) was running, but nothing was there to ask me for my password.

## Check if you have an agent

First, see what runs:

```bash
pgrep -af polkit
```

If you only see `/usr/lib/polkit-1/polkitd`, there is no agent. On my system, the agent from MATE (`mate-polkit`) was already installed, it just never started:

```bash
ls /usr/libexec/polkit-mate-authentication-agent-1
```

If you do not have it, install it:

```bash
sudo apt install mate-polkit
```

Other agents work too, for example `polkit-gnome` or `lxpolkit`. Their binaries live in different places, so check the path after you install one.

## Start the agent with i3

Add the agent to your i3 config, so it starts once per session:

```plaintext
# Polkit authentication agent (mate-polkit). Without one, pkexec (and apps
# that call it, e.g. myna-config) fails with "Error creating textual
# authentication agent".
exec --no-startup-id /usr/libexec/polkit-mate-authentication-agent-1
```

Use `exec` and not `exec_always`. Only one agent can register per session, so starting it again on every i3 restart does nothing useful.

You do not have to log out to test it. Start it once by hand from a terminal inside your i3 session:

```bash
/usr/libexec/polkit-mate-authentication-agent-1 &
```

Run `myna-config` again and push "Set up". This time a password dialogue opens, and the installation runs.

If you do not want an agent at all, you can also run the four steps from the error message yourself with `sudo`:

```bash
sudo snap set system experimental.user-daemons=true
sudo snap install --edge myna
sudo snap install --edge myna-parakeet
sudo snap connect myna:backend myna-parakeet:provider
```

The agent is the better fix, though. Other programs use `pkexec` too, and they fail in the same way under i3.

## Bind a key for dictation

After the installation, Myna shows one more message:

> This desktop cannot set up the shortcut. Bind this command to a key in its settings: `gdbus call --session --dest com.canonical.Myna.Dictation --object-path /com/canonical/Myna/Dictation --method com.canonical.Myna.Dictation.Toggle`

Myna knows how to add its shortcut on GNOME, but not on i3. The good news is that the shortcut only calls a D-Bus method, so i3 can do that too. I use Ctrl+Shift+Alt+Q:

```plaintext
# Myna dictation: start/stop dictation.
bindsym Control+Shift+Mod1+q exec --no-startup-id gdbus call --session --dest com.canonical.Myna.Dictation --object-path /com/canonical/Myna/Dictation --method com.canonical.Myna.Dictation.Toggle
```

Reload i3 (`i3-msg reload`), use the shortcut once to start dictation, and again to stop. If the call works, `gdbus` prints an empty `()` when you run it in a terminal.

## One catch: VS Code

When I tested the D-Bus call from the integrated terminal in VS Code, it failed:

```plaintext
Error: GDBus.Error:org.freedesktop.DBus.Error.AccessDenied: An AppArmor policy prevents this sender from sending this message to this recipient
```

The Myna snap runs with a strict AppArmor profile, and on my system VS Code runs with its own AppArmor label. Calls from processes with that label are blocked. The same command from a normal terminal or from the i3 key binding works fine. VS Code has its own dictation feature anyway, so I can live with that.

## Summary

* Myna's setup uses `pkexec`, which needs a polkit authentication agent.
* i3 does not start one, so the setup fails with "Error creating textual authentication agent".
* Start an agent like `mate-polkit` from your i3 config.
* Bind the Myna D-Bus `Toggle` call to a key in i3, because Myna cannot do that for you there.
