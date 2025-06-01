---
title: Sandworm security audit
description: >-
  Secure your project with Sandworm Audit, a free tool that scans for
  vulnerabilities and license compliance issues. Easy-to-read reports and
  customizable policies.
date: '2023-03-13T20:37:22+07:00'
resources:
  - title: Screenshot of sandworm.dev
    src: header.png
tags:
  - security
  - linting
  - opsec
  - 100DaysToOffload
type: blog
fmContentType: blog
cover: header.png
---

[Sandworm Audit](https://sandworm.dev/) is a free and open source command-line tool designed to scan your project and dependencies for security vulnerabilities, license compliance issues, and other metadata problems.

It works with any modern JavaScript package manager and supports custom license policies. With Sandworm Audit, you can generate easy-to-read reports that include JSON issue and license usage reports, CSV files of all dependencies and license information, and SVG dependency tree and treemap visualizations.

It is powered by D3 and puts security vulnerabilities and package license information into nice looking charts. Additionally, it supports configurable conditions to fail CI/GIT hook workflows, making it a powerful tool for maintaining the security and license compliance of your application on commits or pushes.

To get started, install Sandworm Audit globally via your favorite package manager and run it in the root directory of your application.

```bash
npm install -g @sandworm/audit
```

After that you can run it in any directory with a package.json file.

```bash
sandworm-audit
```

The output will be something like this (if you are lucky and no issues are identified):

```
Sandworm 🪱
Security and License Compliance Audit
✔ Built dependency graph
✔ Got vulnerabilities
✔ Scanned licenses
✔ Scanned issues
✔ Tree chart done
✔ Treemap chart done
✔ CSV done
✔ Report written to disk

✅ Zero issues identified

✨ Done
```

After this step you will find a `sandworm` directory in your project root. This directory contains not only CSV and JSON-reports, but also a nice looking dependency tree and treemap chart in the SVG format.

[Read the documentation](https://docs.sandworm.dev/) for more information on how to use and configure Sandworm Audit.

Note: Currently, the audit might fail with an "out of memory" error on large projects, depending on your hardware setup. There is [an issue report](https://github.com/sandworm-hq/sandworm-audit/issues/53) open about this.
