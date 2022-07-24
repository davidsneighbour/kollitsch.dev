---
title: .gitignore for GoHugo
date: 2022-07-22T0:02:35+07:00
resources:
  - src: header.jpg
    title: Photo by [Mikhail Vasilyev](https://unsplash.com/@miklevasilyev) via
      [Unsplash](https://unsplash.com/)
tags:
  - gitignore
  - developers
lastmod: 2022-07-24T15:29:15+07:00
slug: gitignore-gohugo
aliases:
  - /blog/2021/gitignore-for-gohugo/
---

This is a slight update on my previous post about the perfect `.gitignore` file for GoHugo. TLDR: The current optimum `.gitignore` content for a [GoHugo project](https://gohugo.io) is the following (in addition to your own ignored files and folders):

```ini
/public/
/resources/_gen/
/assets/jsconfig.json
hugo.log
hugo_stats.json
.hugo_build.lock
hugo.exe
hugo.darwin
hugo.linux
```

Let me tell you why:

**/public/** is the folder containing your built website. You don't want that in your git repository, because the content of it is based on what your websites layouts and contents are at the point of building the site. Running `hugo` will re-"create" this directory.

**/resources/_gen/** is a folder with generated cache files that are related to your pipelines. They might change depending on your local setup or based on filenames and contents. They will be recreated once you change anything on their counterparts in `assets`, so ignore them.

**/assets/jsconfig.json** is a file that is automatically created by Hugo when running it's pipes. It contains local path information that depends on your local workstation. Your home directory might not be in the same directory seen from root on every computer. So leave this file out of the loop. Recreating it will not take much time.

**hugo.log** is my preferred logfile name. If you use `--log` and `--logFile` parameters for your Hugo server and build commands, then you will have a file that keeps a log of everthing your Hugo process has to tell you. Don't add these logs to your repository. The name might change of course based on your preferences.

**hugo_stats.json** is created if you run Hugo with the `build > writeStats` configuration enabled. It will list used classes, id's and tags and is a tool to help for instance PurgeCSS to work. Don't put that into your repository, because it will change every time you change something in the layouts folder.

**.hugo_build.lock** is a so-called lockfile. Long story short: if you add new content this will keep Hugo from going insane because your new content might contain more than just one file and cause a rebuild-loop or just choke the Hugo process to death. Keep it out of your repository, it's a "work in progress" file that has no meaning to the full project.

**hugo.exe/hugo.darwin/hugo.linux** are names for hugo binaries. Some people like to download the Hugo binary (program) to their project without installing it on their system. This is more or less a hack, so either don't do it or don't commit it to your repository ;)

I really like the [gitignore-generator of Toptal.com](https://www.toptal.com/developers/gitignore) where you can create your own customised `.gitignore` file by selecting all tools, frameworks, programming languages etc. that you use in a project, which is based on [Githubs own gitignore repository](https://github.com/github/gitignore). I even [contributed](https://github.com/toptal/gitignore/pull/389) (which is not too hard, hint hint, [PR](https://github.com/github/gitignore/pull/3873)).
