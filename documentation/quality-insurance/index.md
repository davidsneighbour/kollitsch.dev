---
title: "Quality Insurance"
date: 2023-12-08T15:58:19+07:00
draft: true
---

## Code and Content Quality

### Linting

#### On Save

##### Vale (wording and grammar checks)

kollitsch.dev uses [Vale](https://vale.sh/docs/vale-cli/installation/) to lint markdown content files. Styles and vocab are saved in `tests/vale`.

**Installation:**

```bash
snap install --edge vale
```

**Run tests:**

```bash
vale content
vale README.md
npm run lint:vale
```

**Visual Studio Code Plugin:**

Install the [Vale](https://marketplace.visualstudio.com/items?itemName=errata-ai.vale-server) plugin. No configuration is required.

###### Updating Vale

```bash
vale sync
```

##### Markdownlint (markdown format checks)

#### On Commit
