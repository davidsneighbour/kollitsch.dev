---
type: blog
title: VSCode Remote SSH plugin vs. Dreamhost shared hosting
description: ""
summary: ""

date: 2022-05-20T22:10:32+07:00
publishDate: 2022-05-20T22:10:32+07:00
lastmod: 2022-05-20T22:10:43+07:00

resources:
  - title: Photo by [NASA](https://unsplash.com/@nasa) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg

tags:
  - dreamhost
  - vscode
  - how to
---

I finally had a reason to edit a website with VSCode directly on the server. VSCode comes with an extension, the [Remote SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) extension. I thought this will connect with the SSH server and make the filesystem available like a mounted path. Running it didn't work and it turned out, that on the server side there is a little extra server running that VSCode connects to and does the magic diplomacy on the servers file system with.

In my case I needed to connect to a Dreamhost shared hosting server. While the whole SSH authentication worked (the log files said so) the connection did not come together in the end. The "VSCode server" on the Dreamhost side timed out after the SSH connection was established. I assume the security settings there are pretty strict and break some of the default settings.

Very interesting. After some troubleshooting (aka googling how other people attempted to fix the issue) I found a little procedure that changed some settings for the server and my VSCode finally could connect to the server.

Running the following on the server (via SSH) solved the issue for me:

```bash
cd .vscode-server/bin/
setfattr -n user.pax.flags -v "mr" $(find $NVM_DIR -type f -iname "node" -o -iname "npm" -o -iname "npx")
```

PaX is a hardening patch to the Linux kernel that enforces rules to not let memory be executable (amongst other things). The command lessens those rules for node/npm scripts and thus the VSCode SSH server component.

Some links that might bear more information for specific cases:

- [The VS Code Server failed to start](https://github.com/microsoft/vscode-remote-release/issues/4780) - issue in the extensions repository
- [The VS Code Server failed to start](https://github.com/microsoft/vscode-remote-release/issues/4850) - another issue in the extensions repository
- [Has anyone been able to connect via SSH to shared hosting? Or what's your remote setup?](https://www.reddit.com/r/vscode/comments/i1sme4/has_anyone_been_able_to_connect_via_ssh_to_shared/) - A thread on Reddit about the issue on Dreamhost
- [Hardened/PaX Quickstart](https://wiki.gentoo.org/wiki/Hardened/PaX_Quickstart) - more details about the PaX hardening on Gentoo Linux
