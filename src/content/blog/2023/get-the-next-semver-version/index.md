---
title: Howto get the next semver version number in a bash script
description: >-
  Discover how to automate Semver version updates with a Bash script for a
  smoother release management process in your projects.
date: '2023-10-23T22:09:53+07:00'
resources:
  - title: Versions of versions
    src: header.jpg
tags:
  - bash
  - semver
  - build
  - 100DaysToOffload
type: blog
unsplash:
  imageid: a-group-of-multicolored-teddy-bears-sitting-next-to-each-other-z7EthZ7gYL4
fmContentType: blog
---

In my projects, I often encounter situations where I need to update the version number of the project before making a release. I follow the [Semantic Versioning (Semver)](https://semver.org/) standard for versioning. In this blog post, I'll demonstrate how to retrieve the next Semver version number using a Bash script. This script allows me to update the version number before finalizing the release, ensuring that the release commit and tags are correctly synchronized.

**The Problem:**

Previously, I would release a new version, note down the version number, update various files and documentation, and then update the release commit. This approach often resulted in tags that weren't aligned with the actual release commit, causing confusion.

**The Solution:**

To address this issue, I created a Bash script that takes the current version number (as it is defined in the package.json) and increments it based on the release type (patch/minor/major). This way, I can update the version number before the release is complete and use the updated version number in the release commit without any complications.

Here's a Bash function that can be used within a library or Bash script:

```bash
#!/bin/bash

get_next_version() {
  local increment_type="$1"
  local RE='[^0-9]*\([0-9]*\)[.]\([0-9]*\)[.]\([0-9]*\)\([0-9A-Za-z-]*\)'

  if [ -z "$increment_type" ]; then
    increment_type="patch"
  fi

  local base=$(node -pe 'require("./package.json")["version"]')

  local MAJOR=$(echo $base | sed -e "s#$RE#\1#")
  local MINOR=$(echo $base | sed -e "s#$RE#\2#")
  local PATCH=$(echo $base | sed -e "s#$RE#\3#")

  case "$increment_type" in
  major)
    ((MAJOR += 1))
    ((MINOR = 0))
    ((PATCH = 0))
    ;;
  minor)
    ((MINOR += 1))
    ((PATCH = 0))
    ;;
  patch)
    ((PATCH += 1))
    ;;
  esac

  local NEXT_VERSION="$MAJOR.$MINOR.$PATCH"
  echo "$NEXT_VERSION"
}
```

The big trick is to use the `node` command to read the version number from the `package.json` file and then parse out the particles with some `sed` magic. This way, we don't have to worry about parsing the file ourselves. The `node` command is available on most systems, so this approach should work for most projects.

```bash
node -pe 'require("./package.json")["version"]'
```

This command is useful enough to get anything out of the package.json file.

You can use this function as follows:

```bash
next_version=$(get_next_version "minor")
echo "Next version: $next_version"
```

This call will return the next minor release version. For example, if the current version is 1.1.2, it will become 1.2.0. Similarly, 1.0.123 will become 1.1.0, and 1.0.0 will become 1.1.0.

You can also use "major" or "patch" as options to specify the type of release increment.

Now, it's time to update my release hooks everywhere and streamline my versioning process! 😄
