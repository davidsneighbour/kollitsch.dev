---
title: Safe npm commands
description: >-
  Socket's safe npm is a CLI tool that wraps the npm command transparently and
  protects developers from malware, typo squats, install scripts, protestware,
  telemetry, and more.
date: '2023-03-28T21:57:51+07:00'
resources:
  - title: Introducing safe npm
    src: header.jpg
tags:
  - node
  - devops
  - security
  - 100daystooffload
fmContentType: blog
cover: ./header.jpg
publisher: rework
---

Socket's "safe npm" is a command-line tool that wraps the npm command transparently and protects developers from malware, typo squats, install scripts, protestware, telemetry, and more. It works with all npm commands that can install new third-party code, including npm install, npm update, npm uninstall, npm rm, npm exec, and npx.

If safe npm detects a risk, it pauses the installation and informs the developer about it. The developer can either stop the installation and protect their machine or continue the process if they know it's safe to install.

Installing the wrapper script is easy:

```bash
npm install -g @socketsecurity/cli
```

After this you can use `socket npm install` instead of `npm install` to use the wrapper.

Of course, who likes to learn a new command? Which is why we add the following lines to our `.bashrc` configuration (or the place where our aliases live):

```bash
alias npm="socket npm"
alias npx="socket npx"
```

Done. `npm install` and it's siblings will use the safe npm script to execute.
