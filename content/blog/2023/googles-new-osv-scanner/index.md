---
title: Google's new OSV scanner
description: Google recently published a security scanner, that checks your files for
  vulnerabilities in your code. It connects and checks for all issues collected
  on the OSV database

date: 2023-01-18T0:16:01+07:00
publishDate: 2023-01-18T0:16:27+07:00
lastmod: 2023-01-18T0:18:09+07:00

resources:
  - src: header.jpg
    title: A hacker hacking away doing mischievous stuff.

tags:
  - security
  - linting
  - opsec
  - 100DaysToOffload

type: blog
draft: false
---

Google recently published a security scanner named [OSV Scanner](https://github.com/google/osv-scanner), that checks your files for vulnerabilities that hide in your code. It connects and checks for all issues collected on the [OSV database](https://osv.dev/). It is a great tool for developers to quickly check their code for vulnerabilities before they are released to the public.

If you have Go installed, it's a simple one-liner to install the scanner:

```bash
go install github.com/google/osv-scanner/cmd/osv-scanner@v1
```

Other methods are described on the [GitHub page](https://github.com/google/osv-scanner#installing). The scanner is also available as a [Docker image](https://hub.docker.com/r/google/osv-scanner).

The check after that is easy:

```bash
osv-scanner -r /path/to/repo
```

This will scan the repository recursively for vulnerabilities and print plenty of information on the CLI. Example:

```bash
...
│ https://osv.dev/GHSA-p9pc-299p-vxgp │ npm │ yargs-parser │ 4.2.1 │ node_modules/netlify-cli/node_modules/wipe-webpack-cache/yarn.lock │
│ https://osv.dev/GHSA-p9pc-299p-vxgp │ npm │ yargs-parser │ 7.0.0 │ node_modules/netlify-cli/node_modules/wipe-webpack-cache/yarn.lock |  
...
```

This recursive check will be very slow, as it will check all files in the repository and all packages, even those that are dependencies of your dependencies, etc. You might want to lower the amount of checks and only scan your own lockfiles, for example:

```bash
osv-scanner --lockfile=/path/to/your/package-lock.json
```
You can ignore errors with a TOML-based configuration file, that contains a list of errors to ignore:

```toml
[[IgnoredVulns]]
id = "GO-2022-0968"
# ignoreUntil = 2022-11-09 # Optional exception expiry date
reason = "No ssh servers are connected to or hosted in Go lang"

[[IgnoredVulns]]
id = "GO-2022-1059"
# ignoreUntil = 2022-11-09 # Optional exception expiry date
reason = "No external http servers are written in Go lang."
```

Why, however, you would wish to ignore a security issue is beyond my understanding :)

Lastly, reports!!! You can generate a report in JSON format, that can be used for further processing:

```bash
osv-scanner --json  --lockfile=/path/to/your/package-lock.json > /path/to/file.json
```

which will generate a JSON file with all the information about the vulnerabilities found in your code.

Read on about the tool on the [Google Security blog](https://security.googleblog.com/2022/12/announcing-osv-scanner-vulnerability.html) or in the Github [README](https://github.com/google/osv-scanner/blob/main/README.md).
