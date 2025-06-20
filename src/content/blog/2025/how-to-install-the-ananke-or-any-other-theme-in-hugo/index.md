---
title: "How to install the Ananke (or any other) theme in GoHugo"
description: "Learn how to install the Ananke theme in GoHugo using Hugo Modules or Git Submodules."
draft: true
date: "2025-03-15T07:35:56+07:00"
resources:
  - title: "Photo by [Name](Link) via [Unsplash](https://unsplash.com/)"
    name: "image name if other than src"
    src: "ave-calvar-HcUDHJfd5GY-unsplash.jpg"
tags:
  - "ananke"
  - "gohugo"
  - "howto"
  - "100DaysToOffload"
fmContentType: "blog"
cover: "./ave-calvar-HcUDHJfd5GY-unsplash.jpg"
---

> **Note:** While this guide focuses on installing the Ananke theme, the same methods can be applied to any other Hugo theme by replacing the URLs and module paths accordingly. The process for installing themes via **Hugo Modules** or **Git Submodules** remains the same for any theme you choose.

## Themes in GoHugo

If you're following the [GoHugo Quickstart guide](https://gohugo.io/getting-started/quick-start/), you'll notice that it currently recommends installing the Ananke theme as a **Git submodule**. While this is a valid approach, GoHugo also offers a more powerful alternative: **GoHugo Modules**, which leverage Go's module system for better dependency and version management.

There are two primary ways to install Ananke:

1. **Hugo Module** --- Uses Hugo's built-in Go module system to fetch and manage the theme as a package.
2. **Git Submodule** *(Legacy Method)* --- Links the theme repository as a submodule inside your Hugo project.

### Comparison: GoHugo module vs. Git submodule

| Method           | Pros | Cons |
|-----------------|------|------|
| **Hugo Module** *(Preferred)* | Easier version management, automatic updates, better integration | Requires Go installed and initial setup |
| **Git Submodule** *(Legacy Method)* | Simple if you're already using Git | Requires manual updates, can be tricky with Git workflows |

**Recommendation:** The **Hugo Module approach is preferred**, as it provides a more flexible and future-proof way to manage themes.

For step-by-step installation instructions, refer to these **work-in-progress** sample repositories:

* **Hugo Module installation:** [gohugo-theme-ananke-template-mod](https://github.com/davidsneighbour/gohugo-theme-ananke-template-mod)
* **Git Submodule installation (Legacy Method):** [gohugo-theme-ananke-template-submod](https://github.com/davidsneighbour/gohugo-theme-ananke-template-submod)

## Installing Ananke as a Hugo Module

The Hugo Module method allows seamless dependency management and is the preferred way to install the Ananke theme.

### Requirements

1. [Install Hugo](https://gohugo.io/installation/linux/) (extended or extended/deploy edition, 0.128.0 or later)
2. [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
3. [Install Golang](https://golang.org/doc/install)

### Installation Steps

**Verify Hugo Version:**

```bash
hugo version
```

**Create a New Hugo Project:**

```bash
hugo new site quickstart
cd quickstart
```

**Initialize Git:**

```bash
git init
```

**Initialize Hugo Module:**

```bash
hugo mod init github.com/username/reponame
```

> **Note:** Replace `username` and `reponame` with the path to your repository. This is a convention that is not enforced, but it is recommended to use the same path as your repository.

**Add the Ananke Theme:**

Modify the `hugo.toml` (or `config.toml` if using a different format) to include:

```toml
[module]
[[module.imports]]
disable = false
ignoreConfig = false
ignoreImports = false
path = 'github.com/theNewDynamic/gohugo-theme-ananke/v2'
```

> **Note:** `v2` is required to use the latest published version of Ananke.

**Update the Module Configuration:**

```bash
hugo mod get -u ./…
hugo mod tidy
```

This loads the module into the cache and creates/updates the `go.mod` and `go.sum` files. These two files should be added to your repository.

**Start the Development Server:**

```bash
hugo server
```

Running this command will start the development server, and you can see your website at <http://localhost:1313/>. To stop the development server, press `Ctrl + C`.

For further configuration, such as setting up a comment system, follow the steps in the [Ananke theme's getting started guide](https://github.com/theNewDynamic/gohugo-theme-ananke#getting-started).

## Installing Ananke as a Git Submodule *(Legacy Method)*

The Git Submodule method is the traditional way to install themes in Hugo, but it has drawbacks like manual updates and dependency management issues.

### Requirements

1. [Install Hugo](https://gohugo.io/installation/linux/) (extended or extended/deploy edition, 0.128.0 or later)
2. [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Installation Steps

**Verify Hugo Version:**

```bash
hugo version
```

**Create a New Hugo Project:**

```bash
hugo new site quickstart
cd quickstart
```

**Initialize Git:**

```bash
git init
```

**Add the Ananke Theme as a Submodule:**

```bash
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke
```

**Set the Theme in Hugo Configuration:**

```bash
echo "theme = 'ananke'" >> hugo.toml
```

**Start the Development Server:**

```bash
hugo server
```

Running this command will start the development server, and you can see your website at <http://localhost:1313/>. To stop the development server, press `Ctrl + C`.

For further configuration, such as setting up a comment system, follow the steps in the [Ananke theme's getting started guide](https://github.com/theNewDynamic/gohugo-theme-ananke#getting-started).
