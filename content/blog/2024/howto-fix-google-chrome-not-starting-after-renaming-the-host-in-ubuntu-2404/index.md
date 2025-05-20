---
$schema: /static/_schemata/blog.schema.yaml
title: HowTo fix Google Chrome not starting after renaming the host in Ubuntu 24.04
description: >-
  My recent days were marked by the biennial (as in every two years) prematurely
  (I'll explain that in a later post) installation of a new Ubuntu LTS (**long**
  **term** **support**) version.
summary: >-
  My recent days were marked by the biennial (as in every two years) prematurely
  (I'll explain that in a later post) installation of a new Ubuntu LTS (**long**
  **term** **support**) version.
date: 2024-04-26T12:09:08.000Z
publishDate: 2024-04-26T12:09:08.000Z
lastmod: 2024-04-26T12:09:08.000Z
resources:
  - title: Ubuntu 24.04 - official wallpaper
    src: ubuntu-wallpaper-d.png
tags:
  - ubuntu 24.04
  - howto
  - google chrome
  - 100DaysToOffload
type: blog
fmContentType: blog
---

My recent days were marked by the biennial (as in every two years) prematurely (I'll explain that in a later post) installation of a new Ubuntu LTS (**long** **term** **support**) version. In 2022 I stopped "playing" around and jumping distributions and upgrading every 6 months to the latest release and saved plenty of time researching why things that worked fine before now stopped working. Yesterday though, April 25th, Ubuntu's latest LTS release 24.04 was released and I upgraded. With this came some issues whose solution I will work through in the next few posts.

The first issue was, that my Google Chrome profile suddenly was locked with a weird error message amongst a garble of other notes:

```plaintext
Chrome has locked the profile so that it doesn't get corrupted.
If you are sure no other processes are using this profile, you
can unlock the profile and relaunch Chrome.
```

Chrome did not launch anymore. I initially planned to just delete all of Google Chrome's user profiles in my backup and start fresh. Bookmarks and site data was synchronized to my Google profile so other than logins, settings, cookie settings, and currently open tabs nothing much would have been lost. I guess.

On the other side, the error message sounded like an easy thing to do: *unlock* the profile and *relaunch* Chrome.

After some searching I came across this Bug Report in the Google Chrome bugtracker, that, quite incidentally, celebrated it's 10th birthday yesterday. 10 years open.

The core of the problem lies in how Chrome associates its profile information with the system's hostname. When the hostname is altered, Chrome fails to recognize the existing profile because it continues to reference the old hostname. This mismatch prevents the browser from starting properly. This seems to be a safety feature more than a bug.

With a bug report being open for more than a decade now I don't think the developers have any interest in fixing this, so we will have to look to hacks to fix it by ourself and it's astonishingly easy:

```bash
rm -rf ~/.config/google-chrome/Singleton*
```

Just delete all `Singleton*` files from the profile. Done. On the other side, how often are we renaming our hostnames ;)

For more details on this issue, you might want to [visit the discussions on Chromium's issue tracker](https://issues.chromium.org/issues/41103620).
