---
title: How to delete all files ignored by Git
description: >-
  A simple command to clean up your Git repository by removing all files ignored
  by Git.
summary: ''
date: 2024-04-11T19:31:26+07:00
resources:
  - title: >-
      Photo by [Roman Synkevych](https://unsplash.com/@synkevych) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - git
  - gitignore
  - 100daystooffload
fmContentType: blog
cover:
  src: ./header.jpg
  type: image
publisher: rework
---

The `.gitignore` file in a Git repository serves as a configuration file that specifies files and directories that Git should --- as the name implies --- ignore. When Git encounters a file or directory listed in .gitignore, it automatically excludes them from being tracked, preventing them from showing up in commands like git status and git add.

This is useful to exclude files generated during the build process, temporary files, log files, and other artifacts that do not belong in version control. I for instance have all my scratch files (back in the analogue times these were the post-it notes with todo's and other useful info that had to be saved from being forgotten) hidden from Git with the following line in my global `.gitignore`:

```ini
scratch*
```

`.gitignore` supports various patterns and wildcard characters, allowing for flexible and precise exclusion rules to be defined based on file names, extensions, directories, and more.

To sum it up: `.gitignore` helps keeping the repository clean and focused by filtering out irrelevant or disposable files, enhancing collaboration and project organization.

Now, I wondered, how to delete all those files ignored by Git? Every now and then I want my repository in pristine condition, without all the generated files that are ignored by Git.

There is an easy way to do this with a single Git command.

Git offers the `git clean` command, and with the appropriate options all ignored files and directories are removed.

```bash
git clean -Xfd path/to/folder
```

Let's dive into what each part of this command does:

- `git clean`: This command is designed to files that are not tracked from the working tree.
- `-X`: instructing `git clean` to delete only files that are ignored by Git, based on the rules defined in the `.gitignore` file.
- `-f`: forcing `git clean` to delete files. Without it, `git clean` would only display the list of files to be deleted without actually removing them.
- `-d`: forcing `git clean` to also remove untracked directories.

Running this will lead to a clean repository, with all the ignored files and directories removed. Like a newly cloned repository.
