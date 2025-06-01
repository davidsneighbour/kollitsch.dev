---
$schema: /static/_schemata/blog.schema.yaml
title: 'How to fix `ReferenceError: __dirname is not defined in ES module scope`'
description: >-
  Replicate the missing `__dirname` and `__filename` variables from CommonJS in
  ES modules.
date: '2024-08-12T19:04:31+07:00'
resources:
  - title: >-
      Photo by [Andrew Wulf](https://unsplash.com/@andreuuuw) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - es modules
  - refactoring
  - how to
  - javascript
  - 100DaysToOffload
type: blog
unsplash:
  imageid: pile-of-rubber-duckies-59yg_LpcvzQ
fmContentType: blog
---

Every now and then, when transitioning from a CommonJS script to ES Modules in a project I am encountering an issue: the `__dirname`[^1] and `__filename` variables, which are commonly available in CommonJS (little punt there, sorry), are not available by default in ES modules. These variables are essential for resolving file paths, at least for me, so their absence can throw a wrench into my code.

Replacing this functionality is not too hard. Let's walk through my fixes in these cases.

To replicate `__dirname` and `__filename` in ES modules, you can use the `import.meta.url` in combination with Node's internal `path` module:

```javascript
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Directory name:', __dirname);
console.log('File name:', __filename);
```

* `fileURLToPath(import.meta.url)`:
  This function converts the module's `import.meta.url` to a file path. The result is the equivalent of `__filename` in CommonJS, giving you the full path of the current file.
* `dirname(__filename)`:
  The `dirname` function from the `path` module extracts the directory path from the file path. This is equivalent to `__dirname` in CommonJS, providing you with the directory name of the current module.

And so we have our `__dirname` and `__filename` back. This is particularly useful for tasks such as:

* resolving paths relative to the current module.
* accessing files within the same directory.
* writing cross-platform file system code.

And isn't that what we all want?

[^1]: ~~Those are two underscores in front of the variables `dirname` and `filename`. Sadly the style of my code-ing font on this website seems to think that a wide underscore is enough to envision that. I don't, so bear with me while I fix the font. Just know it's two underscores, as in `_ _ d i r n a m e`.~~
