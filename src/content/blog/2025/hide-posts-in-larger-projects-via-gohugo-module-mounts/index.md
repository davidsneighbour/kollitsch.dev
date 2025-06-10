---
title: "Hugo Quick Tip: Hide posts in larger projects via GoHugo Module Mounts"
description: "Optimize Hugo development by excluding old posts with module mounts. This guide shows how to speed up testing on large websites by focusing on recent content."
summary: "Speed up development on large Hugo websites by using module mounts to exclude older posts. Learn how a simple configuration hides content from specific years, reducing rebuild times for testing layouts, pagination, and other features. Ideal for blogs with decade-spanning archives."
date: "2025-01-10T17:40:43+07:00"
resources:
  - title: "Hiding in plain sight"
    src: "valeria-nikitina-li709Gx8v_w-unsplash.jpg"
tags:
  - "gohugo"
  - "modules"
  - "website management"
  - "100DaysToOffload"
fmContentType: "blog"
cover: "./valeria-nikitina-li709Gx8v_w-unsplash.jpg"
---

I have a webblog running under GoHugo that has a lot of posts. By a lot I mean it has [musings about my life in Thailand since 2005](https://samui-samui.de/) (yep, 20 years ago) in it. Which is great for me to look back and see what I did, but it's not so great for development. Every time I run `hugo server` it takes ages (6 to 12 minutes) to build the site. Rebuilds are a little bit faster (4 to 10 Minutes). I don't want to wait for that though, so I found a way to exclude posts from certain years from the build process. Here's how you can do it too.

Working on a large Hugo project can become frustrating when the sheer size of your content slows down development. Imagine a blog with thousands of posts spanning decades --- every little change requires a full rebuild, making the `hugo server` command sluggish. I found a handy trick to solve this issue with modules: **content mounts with exclusions**.

Here's a quick example:

```toml
[[mounts]]
excludeFiles = ['posts/200*', 'posts/201*']
source = "content"
target = "content"
```

This configuration in your `config/development/modules.toml` does something magical: it hides all blog posts from the years 2000 through 2019 when running the Hugo development server. Your website only displays posts from 2020 onward, keeping the build process faster and more efficient.

Onviously, this works only, if your posts are in `content/posts/YEARNUMBER` directories.

## How It Works

1. **Exclude Specific Files**:
   The `excludeFiles` key uses patterns to ignore certain files or directories. Here, we're excluding everything in the `content/posts/200*` and `content/posts/201*` directories --- effectively all posts from 2000 to 2019 in my case.

2. **Mount Content Dynamically**:
   Hugo's mount system dynamically maps content from the source to the target. In this case, `content` is both the source and target, but with exclusions applied, only the desired posts are available during development.

3. **Focus on Current Content**:
   This configuration allows you to test pagination, layouts, and functionality without rebuilding years of old content. Your local `hugo server` becomes lightweight and quick, even for very large projects.

## Adapting for other uses

If your posts are not in a year-based directory structure, don't worry! You can modify the `excludeFiles` pattern to suit your needs. For example:

* Exclude drafts: `excludeFiles = ['drafts/*']`
* Exclude specific categories: `excludeFiles = ['posts/category-name/*']`

## Why Use This?

* **Speed**: Dramatically reduce build times during development.
* **Efficiency**: Focus on current or recent content without distraction.
* **Scalability**: Makes Hugo a viable solution for even the largest websites.

## Keep Development Separate

To avoid accidentally deploying with excluded content, keep this configuration in a dedicated development-specific file (e.g., `config/development/modules.toml`) and use Hugo's environment feature (`--environment development`) to load it only when needed if you deploy to a CI services like Netlify. Running `hugo server` will automatically set the development environment.

With this setup, managing large Hugo websites becomes not just feasible, but enjoyable. No more waiting to rebuild the whole site. Give it a try and see how much faster your workflow gets!
