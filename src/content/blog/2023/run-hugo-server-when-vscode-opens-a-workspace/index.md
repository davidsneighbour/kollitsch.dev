---
title: Run Hugo server when VSCode opens a workspace
description: >-
  Learn how to automate Hugo server startup in VSCode using tasks.json, saving
  time and effort every time you open your project.
date: '2023-12-01T20:35:07+07:00'
resources:
  - title: >-
      Photo by [Possessed
      Photography](https://unsplash.com/@possessedphotography) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - vscode
  - automation
  - 100daystooffload
unsplash:
  imageid: robot-playing-piano-U3sOwViXhkY
fmContentType: blog
cover:
  src: ./header.jpg
  type: image
publisher: rework
---

I recently realised that every time I opened a certain project, I was running the same sequence of actions and commands to start the Hugo server. This involved opening a terminal, navigating to the project folder, and executing `npm run server`.

To streamline this process, I decided to leverage the `tasks.json` file in VSCode for automation. I created a task that runs the command `npm run server` and added it to my project. Now, every time I open my project, the Hugo server starts automatically.

Here is the content of my `tasks.json` file:

```jsonc
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Hugo Server",
      "type": "shell",
      "command": "npm run server",
      "windows": {
        "command": "npm run server",
      },
      "group": "none",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "runOptions": {
        "runOn": "folderOpen",
      }
    }
  ]
}
```

**Explanation of Properties:**

* **label**: A unique name for the task, here it's `"Hugo Server"`.
* **type**: The type of task, `"shell"` in this case, indicating a shell command.
* **command**: The command to be executed, `"npm run server"` for starting the Hugo server
* **windows**: Platform-specific settings. Here, it repeats the same command for Windows.
* **group**: The group classification of the task, `"none"` means it's not part of any predefined group.
* **presentation**: How the task's output is displayed.
  * **reveal**: When to show the terminal, `"always"` in this case.
  * **panel**: Where to display the output, `"new"` opens a new panel.
* **runOptions**: Additional execution settings.
  * **runOn**: When the task should run, `"folderOpen"` means it executes when the project folder (or workspace) is opened.

This configuration ensures that every time the specified workspace is opened, the Hugo server is automatically started, which saves a lot of my precious time ;)… it's also convenient.
