---
title: Saving Github Access Token in Local Encrypted Storage via Gh Cli
description: >-
  GitHub CLI has in it's latest version introduced a new feature that allows
  users to store their access token in an encrypted local storage system.
date: '2023-03-09T20:54:38+07:00'
resources:
  - title: GitHub CLI Release v2.24.0
    src: header.jpg
tags:
  - github
  - cli
  - authentication
  - 100DaysToOffload
type: blog
fmContentType: blog
---

[GitHub CLI has in it's latest version introduced](https://github.com/cli/cli/releases/tag/v2.24.0) a new feature that allows users to store their access token in an encrypted local storage system. This new option is available through the `--secure-storage` flag when using the `gh auth login` and `gh auth refresh` commands.

The new feature is designed to improve the security of users' access tokens by storing them in the system keyring, which is an encrypted storage system provided by the operating system. This replaces the previous method of storing access tokens in plain text configuration files, which was less secure.

```bash
gh auth refresh --secure-storage -h github.com
```

It is important to note that this new feature is currently opt-in, but it will become the default in the near future. Additionally, if none of the supported system storage providers are found or if the storage operation fails, the token will be written to the config file as before.

Users should also be aware that using this new feature could potentially break Go extensions that have not been updated to the latest go-gh version. If extensions no longer work after migrating to secure token storage, users should report the issue to the extension's repository.

Finally, it's worth noting that storing tokens in the system keyring might not work in "headless" environments, such as servers or containers. Overall, this new feature is a welcome addition to GitHub CLI and should improve the security of users' access tokens.
