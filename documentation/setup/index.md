---
title: "Setup"
date: 2023-12-08T15:58:19+07:00
draft: true
---

## Installing *Darkskies*

To install *Darkskies* as a theme component, navigate to your site's root directory in your terminal and run:

```bash
hugo mod get github.com/davidsneighbour/hugo-darkskies.git
```

Then install the companion package to make sure all packages required for asset processing are available:

```bash
npm install @davidsneighbour/hugo-darkskies
```

## Upgrading *Darkskies*

To upgrade *Darkskies*, run:

```bash
hugo mod get -u ./...
```

