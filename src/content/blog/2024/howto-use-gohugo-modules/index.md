---
title: How to use GoHugo modules
description: >-
  In the world of GoHugo, **modules** serve as the building blocks that allow
  you to structure and manage your website's components efficiently. A **GoHugo
  Module** is a self-contained package of resources, such as themes, content,
  layouts, or even custom features like shortcodes. These modules can be shared
  across projects, versioned, and updated seamlessly.
summary: >-
  In the world of GoHugo, **modules** serve as the building blocks that allow
  you to structure and manage your website's components efficiently. A **GoHugo
  Module** is a self-contained package of resources, such as themes, content,
  layouts, or even custom features like shortcodes. These modules can be shared
  across projects, versioned, and updated seamlessly.
date: 2024-10-13T18:10:46+07:00
resources:
  - title: Puzzle pieces
    src: nigel-hoare-pswcXNE8690-unsplash.jpg
tags:
  - gohugo
  - modules
  - how-to
  - 100daystooffload
unsplash:
  imageid: pswcXNE8690
fmContentType: blog
cover:
  src: ./nigel-hoare-pswcXNE8690-unsplash.jpg
  type: image
publisher: rework
---

## What are GoHugo modules

In the world of GoHugo, **modules** serve as the building blocks that allow you to structure and manage your website's components efficiently. A **GoHugo Module** is a self-contained package of resources, such as themes, content, layouts, or even custom features like shortcodes. These modules can be shared across projects, versioned, and updated seamlessly.

GoHugo Modules leverage **Go Modules** under the hood, which is a package management system built into the Go programming language. By using Go Modules, GoHugo allows you to manage dependencies and external packages in a streamlined way, pulling resources from remote repositories (for example GitHub) or from local directories. If you want to learn about all the details, I suggest you visit [the official Go Module Reference](https://go.dev/ref/mod).

In essence, GoHugo Modules enable a modular, reusable, and scalable approach to website development. You can think of them as Lego blocks, where each module adds specific features or content, and you can mix and match them to build a complex and feature-rich site without duplicating code.

## Requirements

Before we get started, you need to have Go and Git installed. Here's how you can set them up:

### Install Go

Since GoHugo Modules are powered by **Go Modules**, you'll need Go installed on your system. If you don't have it yet, head over to the [official Go installation guide](https://go.dev/doc/install) for detailed instructions on how to set up Go for various operating systems.

For **Ubuntu** users, installing Go via Snap is a straightforward option. The Snap package ensures that you get the latest stable version with minimal setup. Simply run the following command:

```bash
sudo snap install go --classic
```

This command installs Go in classic mode, which provides a confined Snap environment but with full access to your system, like traditional installation methods. After installation, you can verify that it's set up and working by running:

```bash
go version
```

### Install Git

You'll also need Git to manage version control and fetch modules from repositories like GitHub. If Git isn't already installed, you can get it from the [official Git website](https://git-scm.com/downloads).

For **Ubuntu** users, I recommend installing Git via the package manager from the official Git repositories for the most up-to-date version. Here's how you can do that:

```bash
sudo add-apt-repository ppa:git-core/ppa
sudo apt update
sudo apt install git
```

This method ensures you get the latest stable version directly from the Git team's Personal Package Archive (PPA), which is updated more timely. After installation, you can verify the version with:

```bash
git --version
```

## Set up your project repository as a GoHugo Module

Once Go and Git are installed, the next step is to set up your project as a GoHugo module. This process allows you to manage your site's components—such as themes, layouts, and assets—in a modular and maintainable way.

To initialize your project as a Hugo module, follow these steps:

1. **Navigate to your project directory** in a terminal.

2. Run the following command:

   ```bash
   hugo mod init github.com/<your_user>/<your_project>
   ```

This command creates a Go module for your Hugo site, enabling it to fetch and manage external resources like themes or other dependencies efficiently.

Although it's commonly recommended to use a **GitHub repository** URL as your module path (for example `github.com/​<your_user>/​<your_project>`), you can use any unique path that fits your project. The module path is essentially a unique identifier for your project and its dependencies. Using a descriptive path helps others (and yourself) track where the module originates, especially when sharing or collaborating with others.

After this step, you'll find a `go.mod` file in your project directory. Add it to your Git repository to keep track of your project's dependencies and versions.

## Add modules

Now, you're ready to add some modules! In GoHugo, modules can be themes, plugins, or any other resource your project might need.

To add a module, you just need to include it in your `config.toml`, `config.yaml`, or `config.json` file. Here's an example of how to import a module in **TOML** format:

```toml
[module]
[[module.imports]]
path = "github.com/davidsneighbour/hugo-darkskies"
```

This pulls in a module from the specified source.

To ensure all modules are up to date, run:

```bash
hugo mod get -u ./…
```

## Replacing modules with a local directory

If you are developing a theme or extension for GoHugo, you can use a replace directive to point the theme's path to a local directory. This way, you can test your changes without having to push them to a remote repository or release a new version.

```toml
[module]
replacements = 'github.com/davidsneighbour/hugo-darkskies => ../../hugo-darkskies'
```

Multiple replacements can be added to the `replacements` list, separated by a comma. The local path on the right side is either an absolute path from your system's root or a relative path from the `themes` directory.

Using this method, you can run GoHugo with a local environment name where you've replaced the module with your local directory, while keeping the `production` environment untouched.

## Updating modules

To update all modules to the latest version, run:

```bash
hugo mod get -u ./…
```

This command fetches the latest versions of all modules in your project.

## Cleanup and maintenance

GoHugo downloads the linked modules to a local temporary directory and checks for updates periodically. If you want to clean up the cache, you can run:

```bash
hugo mod clean
```

This command removes all cached modules and downloads them again when needed.

GoHugo also keeps a list of all modules in the `go.sum` file. As new versions of modules are released, a new line with a hash will be added to the file. Over time, the file may accumulate redundant entries. To clean out unused entries, run:

```bash
hugo mod tidy
```

This command removes all entries from the `go.sum` file that are not needed anymore.

## Summary

GoHugo Modules are a powerful way to manage and scale your website's components with ease. From themes and content to custom shortcodes, the modular approach allows you to pull resources from various sources while keeping everything organized and up to date. Whether you're a beginner or a seasoned developer, using modules simplifies how you manage dependencies and keeps your site maintainable as it grows.

Do you have any questions or ran into challenges? Leave your comments and questions below. I would love to hear from you, and your feedback will help build a comprehensive FAQ section for this page. Let's keep the conversation going!
