---
layout: "@layouts/ContentPage.astro"
title: Testing Code Samples
description: >-
  Testing some code samples
date: 2025-10-28T11:48:07+07:00
tags:
  - test
---

## Show filename

### Filename in `title` property

```js title="filename.js"
try {
  allTags = await getTags({ order: "label-asc", threshold: 1 });
  allTagsWithCounts = await getTags({ order: "count-desc", threshold: 1 });
  tagsOver5 = await getTags({ order: "count-desc", threshold: 6 });
} catch (err) {
  console.error("[test/tags] failed to load tags", err);
}
```

### Filename in title property

```bash
#!/bin/bash
echo "This is a test script"
```

### Filename in first line comment

```sh
#!/bin/bash
# file name: ~/sample.sh
echo "This is a test script with filename in the first line as comment"
```

### Terminal format

```powershell title="PowerShell terminal example"
Write-Output "This one has a title!"
```

### Using `frame="code"` property

```python frame="code" title="filename.py"
def greet(name):
    return f"Hello, {name}!"
print(greet("World"))
```

### Using `frame="terminal"` property

```python frame="terminal" title="filename.py"
def greet(name):
    return f"Hello, {name}!"
print(greet("World"))
```

### Using `frame="none"` property

```python frame="none" title="filename.py"
def greet(name):
    return f"Hello, {name}!"
print(greet("World"))
```
