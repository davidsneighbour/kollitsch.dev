---
title: Automatically load workspace when starting VSCode
description: ''
summary: ''
date: '2024-04-11T21:15:08+07:00'
resources:
  - title: >-
      Photo by [Mohammad Rahmani](https://unsplash.com/@afgprogrammer) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - vscode
  - howto
  - workspace
  - 100DaysToOffload
type: blog
fmContentType: blog
---

Workspaces are a great feature in VSCode. But they have their issues. For instance starting VSCode in a folder will not automatically load the workspace file. This can be annoying if you have a workspace file in the folder and you want to open it directly. This is a feature that is [often requested (and denied)](https://github.com/microsoft/vscode/issues/64565) in the official VSCode repository.

I was surprised about this, because with a quick `bashrc` function you can easily change this. "Just" create a function in your `.bashrc` file that overrides the `code` command.

Add the following function to your `.bashrc` file (or where ever you store your shell functions to be loaded in your terminal):

```bash
code() {
  local binary="/usr/bin/code"
  if [ $# -eq 0 ]; then
    folder="$(pwd)"
  else
    target="$1"
    if [ -f "$target" ]; then
      if [[ "$target" == *.code-workspace ]]; then
        $binary "$target"
        return
      else
        folder=$(dirname "$target")
      fi
    elif [ -d "$target" ]; then
      folder="$target"
    else
      echo "Invalid file or directory: $target"
      return 1
    fi
  fi
  workspace_file=$(find "$folder" -maxdepth 1 -type f -name "*.code-workspace" | head -n 1)
  if [ -n "$workspace_file" ]; then
    $binary "$workspace_file"
    if [ -f "$target" ]; then
      $binary "$target"
    fi
  else
    $binary "$folder"
  fi
}
```

This function checks if any argument is passed to `code`. If no argument is passed, it sets the folder to the current directory. Otherwise, it checks the type of the provided argument. It can be one of three things:

- a folder: in this case the command checks, if the folder contains a `.code-workspace` file and opens that workspace
- a `.code-workspace` file: in that case the command opens the workspace
- a file in a folder that is not a `.code-workspace` file: in this case the command checks the containing folder for a workspace file and then opens the workspace or folder, and then the file itself.

Note: Make sure to replace `/usr/bin/code` with the correct path to the `code` executable if it's located elsewhere on your system. You can find the path by running `which code`.
