---
title: Git stashes for ADHDers
description: >-
  How to use Git stashes to keep your work in progress organized and out of the
  way.
date: 2024-03-01T19:19:32+07:00
resources:
  - title: >-
      Photo by [Roman Synkevych](https://unsplash.com/@synkevych) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - bash
  - git
  - 100daystooffload
fmContentType: blog
cover:
  src: ./header.jpg
  type: image
publisher: rework
---

If you are like me you probably typed more than once `git stash` and meant `git stash list` while working on many different things at the same time. If not, then feel free to go [somewhere else and don't waste your time here](https://en.wikipedia.org/wiki/The_Big_Lebowski) :]

I, however, thought, wouldn't it be nice if `git stash` would show me a list of existing stashes instead of telling me that, once again, I have "No local changes to save".

A while back I wrote about my [`git status` hook system](/blog/2023/git-status-hook). This can be used as a starter  for an extension of the `git stash` command.

The idea is simple: I want to see a list of stashes when I type `git stash`.

```bash
git() {
  if [[ $# -eq 0 ]]; then
    command git
    return
  fi
  FILE=.git/hooks/status
  case "$1" in
  status)
    [[ -x $FILE ]] && bash $FILE
    command git "$@"
    ;;
  stash)
    if [[ $# -eq 1 || ( "$2" == "-m" && $# -ge 3 ) ]]; then
      local stash_args=()
      if [[ "$2" == "-m" ]]; then
        stash_args=("--include-untracked" "$2" "$3")
        for ((i=4; i<=$#; i++)); do
          stash_args+=("${!i}")
        done
      else
        stash_args=("--include-untracked")
      fi
      output=$(command git stash "${stash_args[@]}" 2>&1)
      echo "$output"
      if echo "$output" | grep -q "No local changes to save"; then
        echo -e "\nCurrent stashes"
        command git stash list
      fi
    else
      command git "$@"
    fi
    ;;
  *)
    command git "$@"
    ;;
  esac
}
```

The magic happens in lines 12 to 31. Everything else is explained in my [previous post](/blog/2023/git-status-hook). This extension checks if the stash command comes with any additional parameters and executes them if so. If not, it checks if there are any local changes to save and if not, it shows the list of available stashes.

Works nice for me.

One thing to note: I prefer to `--include-untracked` when stashing. If you don't, you might want to remove it from the script. This will add all untracked files to the stash.

It's a hack, but for now it works.
