---
title: How to handle key issues with apt on Ubuntu
description: >-
  How to handle key issues with apt on Ubuntu, including deprecation of apt-key
  and moving keys to trusted.gpg.d.
date: '2023-06-21T18:41:26+07:00'
resources:
  - title: Choose a key
    src: header.jpg
tags:
  - bash
  - ubuntu
  - security
  - gpg
  - apt
  - 100daystooffload
unsplash:
  imageid: abcdefghijk
fmContentType: blog
cover:
  src: ./header.jpg
  type: image
publisher: rework
---

For some time now, I was receiving the following warnings after an otherwise successful run of `apt update`:

```plain
W: http://linux.dropbox.com/ubuntu/dists/disco/Release.gpg:
Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg),
see the DEPRECATION section in apt-key(8) for details.
W: http://prerelease.keybase.io/deb/dists/stable/InRelease:
Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg),
see the DEPRECATION section in apt-key(8) for details.
```

Because it was "just" a warning, I didn't pay much attention to it. This time, however, after installing Ubuntu and both tools on a new computer, I could not ignore it anymore. It's 2023, after all, the deprecation is years old, and my OCD forced me to a) find a solution and b) clean up the old key "situation".

As the warnings instructed, I loaded up the man-page numero 8 for the `apt-key` command (with `man apt-key 8`) and read through the DEPRECATION section. It looks like the command should not be used anymore, and the keys should be managed directly by `apt` itself. The old way was to keep all keys in a GPG keyring at `/etc/apt/trusted.gpg`, and the new method is to keep them as single key files in `/etc/apt/trusted.gpg.d/`.

The deprecation notice expands further that there are two types of keys that are accepted:

> Make sure to use the "asc" extension for ASCII armored keys and the "gpg" extension for the binary OpenPGP format (also known as "GPG key public ring"). The binary OpenPGP format works for all apt versions, while the ASCII armored format works for apt version >= 1.4.

Let's start with the end and cleanup the old keys first. The following command will list all keys in the old keyring:

```bash
sudo apt-key list
```

This will list all keys, even the new ones. Find the ID of the key you want to remove and use the following command to remove it:

```bash
sudo apt-key del <key-id>
```

Running the `sudo apt update` command now should result in warnings that the repositories of the removed keys could not be authenticated and, thus, are not being updated. This is expected, and we will fix this in the next step.

Sidenote: If you are adventurous, you can also remove all old keys at once with the following command:

```bash
sudo rm /etc/apt/trusted.gpg
```

This file is not required anymore.

Now let's import the keys to their proper location. The URL of the missing key is directly in the warning message:

```bash
W: http://prerelease.keybase.io/deb/dists/stable/InRelease: Key is stored in legacy trusted.gpg keyring (/etc/apt/trusted.gpg), see the DEPRECATION section in apt-key(8) for details.
```

We retrieve the key, then check what kind of key it is, and finally move it to the proper location:

```bash
wget -O temp.key http://prerelease.keybase.io/deb/dists/stable/InRelease
sudo mv temp.key /etc/apt/trusted.gpg.d/keybase.asc
```

Be careful to use the correct file extension for the key. In this case, it is `.asc` because it is an ASCII armored key. If you are unsure, you can check the file with the `file` command:

If you're not sure if the key is ASCII-armored or not, run the following:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | file -
```

The output for an ASCII-armored key  (save it with a .asc extension) should be something like this:

```plain
/dev/stdin: PGP public key block Public-Key (old)
```

For a non-armored key (save it with a .gpg extension), the output will be along the lines of:

```plain
/dev/stdin: OpenPGP Public Key Version 4, Created …, RSA (Encrypt or Sign, 4096 bits); User ID; Signature; OpenPGP Certificate
```

Running `sudo apt update` after all keys are imported should result in a clean run without any warnings.

Again, this whole procedure could be circumvented by running the following script:

```bash
#!/bin/sh -e
tmp="$(mktemp)"
sudo apt-get update 2>&1 | sed -En 's/.*NO_PUBKEY ([[:xdigit:]]+).*/\1/p' | sort -u >"${tmp}"
cat "${tmp}" | xargs sudo gpg --keyserver "hkps://keyserver.ubuntu.com:443" --recv-keys
cat "${tmp}" | xargs -L 1 sh -c 'sudo gpg --yes --output "/etc/apt/trusted.gpg.d/$1.gpg" --export "$1"' sh
rm "${tmp}"
```

It will run `apt update`, parse the output for missing keys, retrieve them from the Ubuntu keyserver, and finally export them to the proper location.

Done.

**Except maybe:** Why is it that programs that are supposed to be secure by design (yes, looking at you, Dropbox, and Keybase) are in the year 2023 still unable to update their setup on Ubuntu to a more secure way of authenticating their releases?
