---
title: Removing all local and remote tags in Git
description: How to clean up all local and remote tags in Git repositories in one go.
date: '2023-07-09T18:44:36+07:00'
resources:
  - title: >-
      Photo by [Henry & Co.](https://unsplash.com/@hngstrm) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - git
  - devops
  - 100daystooffload
fmContentType: blog
cover:
  src: ./header.jpg
  type: image
publisher: rework
---

Every now and then I find myself in the situation of needing to tidy up my projects and remove large amounts of local and remote tags in my Git repositories. The procedure is not too hard, but I have to look it up again each time, so why not just writing it up.

The following 4 commands clean up all tags

```bash
git tag -d $(git tag -l)
git fetch
git push origin --delete $(git tag -l)
git tag -d $(git tag -l)
```

1. `git tag -d $(git tag -l)`: Delete all local Git tags in one go. By using `git tag -l`, we list all the tags in the local repository, and the `-d` flag deletes each one of them. If you are sure, that you do NOT have any local tag that does not exist on the remote, then you could leave this step out.
2. `git fetch`: Synchronize and update the local clone with the remote origin. This step ensures that you have an accurate representation of the remote repository's state. It also recreates the tags that exist on the remote repository.
3. `git push origin --delete $(git tag -l)`: Delete the corresponding remote tags. The `--delete` flag signals that you want to delete the tags specified, and `$(git tag -l)` again provides the list of tags to delete.
4. `git tag -d $(git tag -l)`: Lastly, you repeat the first command, `git tag -d $(git tag -l)`, to delete any remaining local tags that may have been re-created since the first deletion.

Run these 4 commands and everything is clean again :)
