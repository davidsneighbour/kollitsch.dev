---
$schema: /static/_schemata/blog.schema.yaml
title: How to install a specific version of a program via Snap
description: ""
summary: ""
date: 2024-08-19T21:12:37+07:00
publishDate: 2024-08-19T21:12:37+07:00
lastmod: 2024-08-26T11:03:44.971Z
resources:
  - title: Photo by [Kumas Taverne](https://unsplash.com/@kumas_taverne) via [Unsplash](https://unsplash.com/)
    src: kumas_taverne-B0aJBySo8dc-unsplash.jpg
tags:
  - ubuntu
  - snap
  - howto
  - golang
  - 100DaysToOffload
type: blog
unsplash:
  imageid: B0aJBySo8dc
---

I recently had to debug an issue with Go(lang), that I thought was connected to an update of Go. As far as I remembered there was no way to install a specific version of any Snap package, but I thought, it might have changed over time. And having changed it did. It's actually very easy now to fix any Snap package to a minor version. It then receives updates in the patch versions of that minor version, but not upgrade to the latest version.

This is done by using channels of course.

**Step 1: List available Go versions**

To see a list of available Go versions, run the following command:

```bash
sudo snap info go
```

This command displays all available channels for Go, which include various versions you can install. A shortened sample for Golang:

```plaintext
name:      go
summary:   The Go programming language
publisher: Canonical✓
store-url: https://snapcraft.io/go
contact:   https://bugs.launchpad.net/go-snap/+filebug
license:   unset
description: |
  Go is an open source programming language that enables the production of
  simple, efficient and reliable software at scale.
commands:
  - go
  - go.gofmt
snap-id:      Md1HBASHzP4i0bniScAjXGnOII9cEK6e
tracking:     latest/stable
refresh-date: today at 20:54 +07
channels:
  latest/stable:       1.23.0       2024-08-14 (10698)  68MB classic
  latest/candidate:    ↑
  latest/beta:         ↑
  latest/edge:         1.24-e705a2d 2024-08-07 (10683) 111MB classic
  1.23/stable:         1.23.0       2024-08-14 (10698)  68MB classic
  1.23/candidate:      1.23.0       2024-08-14 (10698)  68MB classic
  1.23/beta:           ↑
  1.23/edge:           ↑
  1.22/stable:         1.22.6       2024-08-08 (10679)  64MB classic
  1.22/candidate:      1.22.6       2024-08-07 (10679)  64MB classic
  1.22/beta:           ↑
  1.22/edge:           ↑
...
```

This shows some info about the package and all versions that are available to install.

**Step 2: Installing a specific Go version**

Once you've identified the version you want, you can install it using the `--channel` option. For example, to install Go version 1.22, use the following command:

```bash
sudo snap install go --channel=1.22/stable --classic
```

The `--classic` flag allows the Snap package to access your system's files, which is required for Go. You can leave that flag out for most programs though.

**Bonus step: Upgrading or downgrading Go versions**

Snap also makes it simple to upgrade or downgrade to a specific version of Go. If you need to downgrade or upgrade Go while having it already installed, you can do so with the following command:

```bash
sudo snap refresh go --channel=1.21/stable --classic
```

This command refreshes your current Go installation to the specified version.

**Upgrading to the latest stable Go version**

One last step: When I am done testing my issues, I always go back to the latest version, just to be sure to receive all future updates. This is done by refreshing to `--channel=latest`.

```bash
sudo snap refresh go --channel=latest --classic
```
