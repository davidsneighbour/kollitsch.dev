---
$schema: /static/_schemata/blog.schema.yaml
title: hugov - a tool for managing Hugo versions
description: >-
  hugov is a Bash tool for managing Hugo versions. Download and link versions
  easily, and update to the latest version with simple commands.
summary: >-
  `hugov` streamlines Hugo version management with options to download only
  missing versions, list available downloads, and symlink specific versions. Set
  custom directories, update to the latest version, and pick standard or
  extended versions—all from the command line.
date: '2024-11-07'
resources:
  - title: hugov - a tool for managing Hugo versions
    src: getty-images-M0Ozda1sRYs-unsplash.jpg
tags:
  - gohugo
  - bash
  - script
  - 100DaysToOffload
unsplash:
  imageid: M0Ozda1sRYs
fmContentType: blog
---

This blog post introduces [`hugov`](https://github.com/davidsneighbour/hugov), a Bash utility script I wrote to streamline my workflow with Hugo. Whether I need to download, list, or link specific Hugo versions, `hugov` simplifies these tasks with minimal effort and command-line familiarity.

## Features

Here's a breakdown of what `hugov` offers:

1. **Download Only Missing Versions**
   Download any missing Hugo versions that you may need without re-downloading existing ones. Useful if you work on projects requiring specific or older Hugo versions.
2. **List Available Versions**
   See which versions of Hugo are already downloaded, including both standard and extended versions.
3. **Symlink to a Specific Version**
   Create symbolic links pointing to a specific Hugo version, allowing you to switch between versions in your environment. The symlink can be set up in a specified directory (default: `/usr/local/bin`) and requires `sudo` privileges.
4. **Update to the Latest Version**
   Download the latest versions of Hugo and create a symlink to it. You can choose between the standard or extended version with a simple prompt.
5. **Set a Custom Bind Directory**
   If you want to set up the symlink in a custom directory, use the `--bindir` option to specify a different path.

## How to use `hugov`

To get started, [clone the repository](https://github.com/davidsneighbour/hugov) and make the script executable:

```bash
git clone git@github.com:davidsneighbour/hugov.git
cd hugov
chmod +x hugov
```

Then, run it with the following options:

* `--download`: Downloads all missing versions of Hugo up to a defined stop version (default: `v0.84.0`). *Careful: this is 18+ GB of data. Setting STOP_VERSION to a higher version might be a good idea.*
* `--list`: Lists all downloaded versions in the local `executables` directory.
* `--link`: Creates a symlink pointing to a specified Hugo version (asks for standard or extended).
* `--update`: Downloads the latest Hugo version and links it.
* `--help`: Displays help information for each command.

Each option is mutually exclusive.

## How it works

`hugov` uses the GitHub REST API to fetch the latest Hugo releases and then downloads the latest Linux versions (standard and extended). The script then keeps a local copy of all downloaded versions and links to the required (or latest) version. You can customize the symlink directory and set a stop version for downloads. Currently it downloads ALL versions from the latest down to v0.84.0. This is several GB of data, so be prepared for that or set `STOP_VERSION` to a higher version.

## Example commands

* **Download missing versions of Hugo:**

  ```bash
  hugov --download
  ```

* **List all downloaded Hugo versions:**

  ```bash
  hugov --list
  ```

* **Link a specific version (with a custom `bindir` path):**

  ```bash
  hugov --link --bindir /path/to/custom/dir
  ```

* **Update to the latest version and link it (choose between standard or extended):**

  ```bash
  hugov --update
  ```

## Notes

1. **Dependencies:**
   `hugov` relies on `jq`, `curl`, `tar`, `rm`, and `ln`. Before running, make sure these dependencies are installed on your system. Most of them are readily available, but you may need to install `jq`.
2. **Configuration Options:**
   The script has a few customizable variables:
   * **`BINDIR`**: Directory for the symlink (default is `/usr/local/bin`).
   * **`STOP_VERSION`**: Specifies a cutoff version, after which downloads stop (default is `v0.84.0`).
   * **`DOWNLOAD_DIR`**: Directory where Hugo executables are stored (default is `./executables`).
3. **GitHub API Rate Limits:**
   If the GitHub API rate limit is exceeded, the script pauses downloads and suggest waiting for the limit to reset.

## Todo

* add a function to automatically update `hugov` itself
* make things like `BINDIR` and `STOP_VERSION` configurable via command line arguments
* add a way to download other versions than the Linux versions
* add configuration to use personal API keys for the GitHub REST API requests
* non-interactive linking of GoHugo versions (for CI/CD pipelines)

## Final thoughts

`hugov` is a handy tool for anyone working with various Hugo versions or needing easy access to different versions. By managing Hugo installations locally and letting you set up symlinks, it makes switching versions a breeze.
