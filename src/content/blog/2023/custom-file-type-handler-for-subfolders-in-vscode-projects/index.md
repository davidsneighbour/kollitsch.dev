---
title: >-
  How to create custom file type handlers for individual folders in VSCode
  projects
description: >-
  Unlock VSCode's full potential: Customize file handlers for subfolders. A
  quick guide to boost productivity in Visual Studio Code.
date: '2023-10-27T21:14:21+07:00'
resources:
  - title: >-
      Photo by [Mohammad Rahmani](https://unsplash.com/@afgprogrammer) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - vscode
  - configuration
  - project-management
  - 100DaysToOffload
type: blog
unsplash:
  imageid: oXlXu2qukGE
fmContentType: blog
cover: header.jpg
---

[Visual Studio Code (VSCode)](https://code.visualstudio.com/) is a powerful code editor, but occasionally, it may provide different functionality than you need out of the box. Just have a look at the [open feature requests on Github](https://github.com/microsoft/vscode/issues?q=is%3Aopen+is%3Aissue+label%3Afeature-request), and you'll see that many users have encountered situations where VSCode doesn't deliver as expected.

One such scenario is the lack of support for custom file type handlers for subfolders within VSCode projects. Imagine you have a [GoHugo](https://gohugo.io)-project with a subfolder named `layouts`, and you want all the files in that folder to open with a specific editor, not the default one. A sample would be the `gojson` editor for JSON `layout` files and `package.json` files for NPM packages.

## The Challenge

In a nutshell, here's what I tried to achieve:

* Open all JSON files in a specific folder, let's call it `layouts`, with a custom editor for `gojson` files.
* Keep the default JSON editor for all other JSON files within the project, like npm, eslint, other configurations, etc.

This requirement is because the `gojson` JSON editor serves a specialized purpose - it's essentially a template engine, not a conventional JSON editor. It doesn't display JSON errors, making it ideal for GoHugo, but errors in other JSON files will evade your attention until things fail.

Let's assume you have a folder structure like this:

```plaintext
├── .vscode
│   └── settings.json
├── …
├── theme
│   ├── .vscode
│   │   ├── settings.json
│   ├── layouts
│   │   ├── …
│   └── …
└── project.workspace
```

The `theme/.vscode` folder was created after the first attempt.

## Attempt 1: Configuration with globs

Initially, one might think that the `file.associations` configuration in VSCode can handle globs. So, I tried configuring it like this in `project.workspace` or `.vscode/settings.json`:

```jsonc
{
  "files.associations": {
    "**/layouts/**.html": "gohtml",
    "**/layouts/**.xml": "goxml",
    "**/layouts/**.json": "gojson",
    "**/layouts/**.txt": "gotemplate",
  }
}
```

However, I quickly discovered that VSCode ignores these settings. It turns out that the `file.associations` configuration object supports global file extensions (like \`\*.ext) but not globs. Sadly.

## Attempt 2: Configuration in per folder

Another attempt was to add the `file.associations` configuration object to the `.vscode/settings.json` file within the `layouts` folder. Unfortunately, this approach is also ineffective, as VSCode does not parse these folder-specific settings. It only recognizes the workspace settings and specific settings in the `.vscode`-folder in the root folder. The workspace file overrides the `.vscode`-folder settings in many cases. So, this approach is also a dead-end.

## The solution: Adding the subfolder to the workspace file

After some trial and error, a peculiar but functional hack emerged as the solution: Adding the folder as a second root folder to the workspace. This finally worked to set the editor for separate folders in this project. All files within it will automatically open with the designated editor.

The final workspace file with the above configuration looks like this:

```jsonc
{
  "folders": [
    {
      "path": "."
    },
    {
      "path": "layouts/"
    }
  ]
}
```

It took a while, but finally, I can open my GoHugo project in VSCode and have the proper editor open any file in my project. This is not limited to GoHugo projects and JSON files but can be used for any project with a similar requirement.
