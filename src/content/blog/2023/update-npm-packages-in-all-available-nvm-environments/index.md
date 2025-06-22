---
title: Update Npm Packages in All Available Nvm Environments
description: >-
  Automate the update of global npm packages across multiple Node.js versions
  using nvm and a bash script. Schedule it with cron for hassle-free
  maintenance.
date: '2023-10-12T18:53:01+07:00'
resources:
  - title: >-
      Photo by [Paul Esch-Laurent](https://unsplash.com/@pinjasaur) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - node
  - npm
  - nvm
  - cronjob
  - 100daystooffload
unsplash:
  imageid: oZMUrWFHOB4
fmContentType: blog
cover: ./header.jpg
publisher: rework
---

If you are like me, then you are probably using [nvm](https://github.com/nvm-sh/nvm) to manage your node environments. I have a few projects that are using different node versions, and I have to switch between them from time to time. Sometimes then I forget having switched and type some globally installed npm command and end up, not having it installed in the current environment or not updated to the latest version.

This lead to plenty of confusion and time spent to debug issues that would have not existed else. So I decided to write a small bash script that will update all globally installed npm packages in all available nvm environments I have set up. I also added a cronjob to run this script every night, because I don't want to think about it anymore.

Sidenote: I am pretty sure there is a baked-in way in `nvm` to accomplish the same with a small node script. But I went the bash route, because I am more comfortable with it and don't want to use up any more time with this.

This script works for me and my setup (Ubuntu 22.04 with bash). It might not work for you, but it should be easy to adapt it to your setup.

First, here is the script in its whole glory (don't just copy and paste, read on for the explanation, because there are some built-in things in this script that depend on my own setup):

```bash
#!/bin/bash

echo "##########################################################################"
echo "starting update-npm.sh"
echo `date`
echo "##########################################################################"

# exit if any command fails
set -e

# Load nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

for DIRNAME in /home/patrick/.nvm/versions/node/*/; do

    DIR=$(basename "$DIRNAME")
    nvm use $DIR

    # update global npm packages
    npm --no-fund --no-audit --quiet -g install \
        svgo cypress typescript \
        @davidsneighbour/remark-config \
        @socketsecurity/cli \
        bun

done

echo "##########################################################################"
echo "done with update-npm.sh"
echo `date`
echo "##########################################################################"

nvm use
```

Now a quick breakdown of what this script does:

**Line 12:** This line loads the nvm environment by setting the `NVM_DIR` environment variable. This line is listed at the end of installing `nvm` to your system and depends on your own setup. Have a look in your `.bashrc` if you don't already know where to look for it.

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

**Line 15:** The script then iterates through all installed Node.js versions managed by nvm in the specified directory (`/home/patrick/.nvm/versions/node/*/`). This path will be different on your system, so make sure to change it to the correct path. Because I am using the script as a cronjob, I can't replace `/home/patrick/` with `{$HOME}` or `~`. You could, if you run the script manually only. This would make it more portable but non-working in cronjobs.

For each version, it switches the active Node.js version to that version using `nvm use $DIR`.

```bash
for DIRNAME in /home/patrick/.nvm/versions/node/*/; do
    DIR=$(basename "$DIRNAME")
    nvm use $DIR
```

**Line 21:** Within the loop, for each Node.js version, it updates a specific set of global npm packages. The `npm --no-fund --no-audit --quiet -g install` command is used to install/update the specified packages globally without showing funding information, auditing for vulnerabilities, or printing output to the console unless there is an error. I am doing this, because in cronjobs I filter the output into a log file and don't want to have any unnecessary information in there.

You could add anything you would want to be installed or configured on each version of `node` you have installed.

```bash
    npm --no-fund --no-audit --quiet -g install \
        svgo cypress typescript \
        @davidsneighbour/remark-config \
        @socketsecurity/cli \
        bun
```

**Line 31:** In the end the script resets the active Node.js version to the default using `nvm use`. For the cronscript this line is not required, but I added it, because I might call the script manually from time to time. In that case, it's always good to end up on the same version I started with. If there is no version set in the directory you are currently in, `nvm` will iterate up to your default version that you have set in your `.nvmrc` file.

```bash
nvm use
```

That's it. This script is useful for me. It might be useful for you.

**The cronjob:** I added this script to my crontab with the following line:

```crontab
0 0 * * * /path/to/update-npm.sh >> /home/patrick/cron.log 2>&1
```

In this cronjob:

- `0 0 * * *` specifies the schedule: at midnight, every day.
- `/path/to/update-npm.sh` is the path to the script.
- `>> /home/patrick/cron.log` appends the output to a log file in my home directory.
- `2>&1` directs both standard output and standard error to the log file[^1].

I can then check the log file for errors and see if the script ran successfully.

[^1]: If you wish to learn more about the "redirection" syntax then have a look at [my previous post about this topic](/blog/2022/piping-output-to-files-in-bash/).
