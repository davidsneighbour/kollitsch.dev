---
type: blog
title: Autostart Development Server in Vscode
description: "An easy way to automatically start a development server each time you open a
  VSCode workspace or folder. "

date: 2022-04-12T23:26:46+07:00
publishDate: 2022-04-12T23:26:46+07:00
lastmod: 2022-04-17T1:27:49+07:00

resources:
  - title: Photo by [Douglas Lopes](https://unsplash.com/@douglasamarelo) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg

tags:
  - vscode
  - development
  - automation
---

Are you annoyed of the two clicks and one line command to start your development server (or development watching process) each time you open VSCode? Then I can help you ;]

I recently and finally got around to read through all the docs and found out that there is an easy way to do this in VSCode, via "Task configuration".

Create a `.vscode/tasks.json` (or add to an existing file) in your project:

```json {lineAnchors=code1}
{
  "version": "2.0.0",
  "presentation": {
    "echo": false,
    "reveal": "always",
    "focus": false,
    "panel": "dedicated",
    "showReuseMessage": true
  },
  "tasks": [
    {
      // The name that shows up in terminal tab
      "label": "Run server",
      // The task will launch a shell
      "type": "shell",
      // What do you want to run?
      "command": "npm run server",
      // Set the shell type
      "options": {
        "shell": {
          // Put your shell program in here and add whatever configuration
          // params are needed _before_ the `command` above is added to the full
          // run command
          "executable": "bash",
          "args": [
            "-c"
          ]
        }
      },
      // Some display options
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "shared",
        "showReuseMessage": false,
        "clear": true
      },
      // Mark as the default build task so cmd/ctrl+shift+b will create them
      "group": {
        "kind": "build",
        "isDefault": true,
        // this is the profile name you can use to color/iconise the terminal
        "profile": "npm-server"
      },
      // Mark as a background task to avoid the spinner animation on the
      // terminal tab
      "isBackground": true,
      // Not sure about that one. Might be omissible.
      "problemMatcher": [],
      // Try start the task on folder open
      "runOptions": {
        "runOn": "folderOpen",
        // run only one instance (meaning it will kill the previous run or ask
        // if the currently running process should be killed/restarted)
        "instanceLimit": 1
      }
    },
  ]
}
```

This will create a task, that will run `npm run server` (see line 17) when you open a folder or workspace in VSCode. Type {{< kbd >}}{{< kbd >}}CTRL{{< /kbd >}} + {{< kbd >}}SHIFT{{< /kbd >}} + {{< kbd >}}P{{< /kbd >}}{{< /kbd >}} and then search for "Tasks: Manage Automatic Tasks in Folder" and select to allow automatic tasks and you are good to go.

You can start or restart the task manually by typing {{< kbd >}}{{< kbd >}}CTRL{{< /kbd >}} + {{< kbd >}}SHIFT{{< /kbd >}} + {{< kbd >}}B{{< /kbd >}}{{< /kbd >}}, but after the change above whenever you open your workspace or folder it will start automatically for you.

As an added bonus, you can configure the look (icon and color) of the automatic terminal with some lines in your user configuration:

```json {lineAnchors=code2}
{
  "terminal.integrated.automationProfile.linux": {
    "color": "terminal.ansiCyan",
    "icon": "server-environment",
    "name": "npm-server",
    "path": ""
  },
}
```

Make sure that the `name` (in my example `npm-server`) matches the `tasks.group.profile` value of your task setup. If you edit these files in VSCode itself you will receive hints about possible values on {{< kbd >}}{{< kbd >}}CTRL{{< /kbd >}} + {{< kbd >}}SPACE{{< /kbd >}}{{< /kbd >}}.
