---
title: New features in VSCode v1.89
description: >-
  Three VSCode updates this month, that I find useful. VSCode keeps adding
  useful features every month.
date: '2024-05-03T18:10:07+07:00'
resources:
  - title: >-
      Photo by [Mohammad Rahmani](https://unsplash.com/@afgprogrammer) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - vscode
  - code editor
  - 100DaysToOffload
type: blog
fmContentType: blog
---

Some of the latest features that have landed in Visual Studio Code (VSCode) today . As an avid user myself, I'm always excited to see how the VSCode team continues to enhance our coding experience. Let's dive right in and explore these new additions:

## Reopen editors on switching branches

It seems this was a "highly requested" feature. I myself never thought about this much, but it looks very useful to me. You can now [save the open editor tabs with each branch](https://code.visualstudio.com/updates/v1_89#_saverestore-open-editors-when-switching-branches). Checking out any branch will open the editors that were open when the branch was used the last time. To enable this feature, simply adjust the `scm.workingSets.enabled` setting. Additionally, customize your open editors behavior when switching branches for the first time using the `scm.workingSets.default` setting. Choose between starting with no open editors (`empty`) or retaining the currently opened editors (`current`) based on your preference.

## Paste via middle mouse click in terminals

It was frustrating that the middle click in VSCode's terminal did not work like in any other terminal on Linux. Middle click is pasting the current content of the clipboard at the cursor position. Everything else is annoying, hehe. By configuring `terminal.integrated.middleClickBehavior` to `paste`, you can enjoy the convenience of [middle-click pasting](https://code.visualstudio.com/updates/v1_89#_configure-middle-click-to-paste) on any platform. A small but significant tweak.

## Local workspace extensions

[Local Workspace Extensions](https://code.visualstudio.com/updates/v1_89#_local-workspace-extensions) lets me add extensions to a that are specific to this specific project. By placing the extension in the `.vscode/extensions` folder (unpacked, not as package with .vsix extension) within your workspace, VSCode recognizes and presents it in the Workspace Recommendations section of the Extensions view. From there, users can easily install the extension, ensuring it's available only within that workspace.

Three updates this month, that I find useful. VSCode keeps adding useful features every month. Read [the full changelog](https://code.visualstudio.com/updates/v1_89) for more details.
