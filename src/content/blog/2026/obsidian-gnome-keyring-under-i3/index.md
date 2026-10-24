---
fmContentType: blog
title: Obsidian cannot find GNOME Keyring under i3
description: Fix Obsidian's Encrypt secrets option under i3/X11 by explicitly selecting GNOME libsecret, even when the keyring daemon is already running.
summary: GNOME Keyring was already running, but Obsidian could not use it. An explicit Electron password-store option fixed detection in both my i3 startup command and launcher.
date: 2026-10-25
draft: true
tags:
  - today-i-learned
  - linux
  - i3
  - obsidian
  - electron
---

GNOME Keyring was already running in my i3/X11 session. Obsidian's "Encrypt secrets" option still complained that it could not find a keystore. The fix was to tell Electron which password store to use:

```bash
obsidian --password-store=gnome-libsecret
```

After launching Obsidian with that option, it recognised the keystore.

## A running daemon is only the first check

My initial question was how to start GNOME Keyring under i3. That turned out to be the wrong starting point: `gnome-keyring-daemon` was already running.

There are separate things to check: whether the process exists, whether the Secret Service is available in the application's login session, and whether Electron selects the appropriate backend. A process list only answers the first question.

[GNOME's libsecret documentation][libsecret] explains that libsecret communicates with `gnome-keyring-daemon` through the Secret Service D-Bus API. To investigate service availability, run these commands from a terminal in the same graphical session as Obsidian:

```bash
busctl --user status org.freedesktop.secrets
```

For an interface-level check:

```bash
gdbus introspect \
  --session \
  --dest org.freedesktop.secrets \
  --object-path /org/freedesktop/secrets
```

These are suggested diagnostics, not captured output from my fix. A successful response shows that the service is reachable on that session bus. It does not prove that the keyring is unlocked or that Obsidian is using it. If the service is unavailable, investigate the keyring and session bus before treating this as a backend selection problem.

## Why i3 can make a difference

[Electron's `safeStorage` documentation][electron-storage] describes Linux backend selection in terms of the desktop environment. Its list of environments that select `gnome_libsecret` includes GNOME and XFCE, but does not include i3. An unrecognised environment can select `basic_text`, which does not provide keyring-backed protection.

These variables can help explain what desktop context an application inherits:

```bash
printf 'XDG_CURRENT_DESKTOP=%s\n' "$XDG_CURRENT_DESKTOP"
printf 'XDG_SESSION_DESKTOP=%s\n' "$XDG_SESSION_DESKTOP"
printf 'DESKTOP_SESSION=%s\n' "$DESKTOP_SESSION"
```

Their values depend on how the session starts; do not assume that all three say `i3`.

**Inference:** backend selection was the likely cause in my case, because explicitly selecting GNOME libsecret resolved the symptom. I did not capture Electron's original backend, so I cannot claim that it was definitely `basic_text`. The documented override is `--password-store=gnome-libsecret`; `gnome_libsecret` is the backend name returned by the API.

## Test with a fresh Obsidian process

Fully quit Obsidian before testing the command. Check that no Obsidian process remains, then launch it from a terminal:

```bash
obsidian --password-store=gnome-libsecret
```

Open the "Encrypt secrets" option again. In my session, Obsidian now recognised the keystore. This tested the complete application path, rather than only checking whether a daemon existed.

## Keep the option in both launch paths

I added the option to my i3 startup invocation and to a copied launcher script. That kept it in place whether Obsidian started with the session or through my launcher.

For a direct startup command in `~/.config/i3/config`, the relevant line can look like this:

```text
exec --no-startup-id obsidian --password-store=gnome-libsecret
```

Replace the existing Obsidian startup line instead of adding a second one. [i3 documents `exec`][i3-startup] for commands run at initial startup; `exec_always` also runs on an i3 restart. Use the option that matches the existing setup.

If startup goes through a script, add the flag to its existing Obsidian invocation. A minimal wrapper would be:

```sh
#!/bin/sh
exec /usr/bin/obsidian --password-store=gnome-libsecret "$@"
```

That path is an example: use the actual executable or AppImage path from the existing launcher, and preserve any other arguments. Make a new wrapper executable, and ensure the launcher actually calls it.

For a `.desktop` launcher, copy the installed entry into `~/.local/share/applications/`, retaining its filename, then edit the copy's `Exec=` line. For example:

```ini
Exec=/usr/bin/obsidian --password-store=gnome-libsecret %U
```

Keep the original executable path, field codes, and other options. The [desktop entry specification][desktop-entry] defines how entries with the same desktop file ID take precedence. A user copy avoids changing the package-owned launcher, but should be reviewed after application updates. If the entry calls a wrapper, the flag can live in that wrapper instead.

## What I learnt

"GNOME Keyring is running" and "Obsidian is using GNOME Keyring" are different claims. In this i3/X11 session, explicitly selecting GNOME libsecret made the keystore available to Obsidian. Keeping that option in both launch paths made the fix persistent without changing the desktop identity for the whole session.

[electron-storage]: https://www.electronjs.org/docs/latest/api/safe-storage#safestoragegetselectedstoragebackend-linux
[libsecret]: https://github.com/GNOME/libsecret/blob/main/docs/reference/libsecret/migrating-libgnome-keyring.md
[i3-startup]: https://i3wm.org/docs/userguide.html#_automatically_starting_applications_on_i3_startup
[desktop-entry]: https://specifications.freedesktop.org/desktop-entry/latest-single/
