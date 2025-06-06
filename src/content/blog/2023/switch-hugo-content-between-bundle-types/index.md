---
title: 'Switching content types in Hugo: A step-by-step guide'
description: >-
  Optimize your content organization in Hugo with page bundles and learn how to
  switch between leaf and branch bundles for optimal SEO and site structure.
summary: ''
date: '2023-06-19T19:45:19+07:00'
resources:
  - title: >-
      Photo by [Hitoshi Suzuki](https://unsplash.com/@hitoshi_suzuki) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - gohugo
  - bash
  - quicky
  - 100DaysToOffload
unsplash:
  imageid: 1COcTd3pRCg
fmContentType: blog
cover: header.jpg
---

Hugo, the [little static site generator](https://gohugo.io) that powers this website, offers two main content organization options known as [*page bundles*](https://gohugo.io/content-management/page-bundles/). Page bundles provide a way to group page resources in leaf and branch bundles, allowing for more structured content management. In this quick guide, I will show you how to easily switch between the two types without much manual work. All you need is a Bash shell and a text editor. Let's get started!

**Sidenote:** The real reason I am writing this post is *not* to explain page bundles in Hugo, but the difficulties you will have when converting for instance a WordPress website into a Hugo website. The tools available to get the content out of WordPress will leave you with a branch bundle structure for your content while leaf bundles are the better option, as I will explain a little bit later. The bash script in this post solves this issue and requires just some seconds of copy paste instead of "hours of hard manual labour" creating the folder structure by yourself and copying things around.

Page bundles in Hugo can be classified into two types: **leaf bundles** and **branch bundles**. Each type serves a specific purpose and has its own set of characteristics. Let's understand the differences between them.

**Leaf bundles** are used for organizing content and attachments related to a single page inside of its own directory. Some key points to know about leaf bundles are:

- they can be created at any directory level within the `content` directory
- they allow the inclusion of unrestricted resource types, such as images, downloadable archives, and PDFs.
- the `index.md` file within a leaf bundle represents the main content page.
- other bundle types inside of a leaf bundle folder are not supported.

Example structure of a leaf bundle:

```text
content
└── posts
    └── my-post
        ├── index.md
        ├── image1.jpg
        └── image2.png
        └── sample-download.zip
        └── document.pdf
        └── movie.mp4
```

**Branch bundles** serve as containers for posts. Some key points to know about branch bundles are:

- posts in a branch bundle only at the directory level of the branch bundle directory (`_index.md` will be the content for the overview or list page of the bundle, `my-post.md` will be the content of a single page)
- they allow the inclusion of non-content resource types, such as images, downloadable archives, and PDFs, that have to reside at the same level as the content files
- nesting of leaf or other branch bundles is possible within the folder structure of branch bundles

Example structure of a branch bundle:

```text
content
└── posts
    └── my-post.md
    └── my-post2.md
    └── my-post3.md
    └── document.pdf
```

In my opinion, leaf bundles are the superior option when it comes to page bundle types in Hugo. Leaf bundles allow for the seamless grouping of all content elements, including text, images, downloads, and other files, into a single folder or place. This consolidated structure simplifies content organization and ensures that all related resources are readily accessible within the bundle. By keeping everything neatly organized within a leaf bundle, it becomes easier to manage and maintain the content, resulting in a more streamlined and efficient workflow. I highly recommend leveraging leaf bundles for optimal content organization in Hugo.

To convert content from branch bundles to leaf bundles, use the following lines:

```bash
for file in *.md; do
  folder="${file%.*}"
  mkdir -p "$folder"
  mv "$file" "$folder/index.md"
done
```

Copy and paste these lines all at once into a Bash terminal while you are inside the directory containing the branch bundle. This will create a new directory for each file, move the file into the new directory, and rename the file to `index.md`. The result will be a list of leaf bundles for your content.

The lines above are what I am doing right after importing (or exporting? depends of what you think is the greater evil ;]) a WordPress website to a Hugo site.

To convert content from leaf bundles back to branch bundles, use the following lines:

**Caveat:** One thing to note is that this script will not copy former resources of the leaf bundle into the static directory or any other folder structure where you want to keep your resources. You will have to do this manually or add a `cp ${folder%/}.* /path/to/static/resources` line to the script (before the leaf folder is deleted).

```bash
for folder in */; do
  folder="${folder%/}"
  file="$folder/index.md"
  if [ -f "$file" ]; then
    new_file="${folder%/*}.md"
    mv "$file" "$new_file"
    rm -r "$folder"
  fi
done
```

Copy and paste these lines all at once while you are inside the directory containing the directories of the leaf bundles. This will copy the markdown file and use the slug of the former leaf bundle as the new file name. The result will be a branch bundle with all the content files inside it. The links to the posts/pages will stay the same.

While I personally recommend using leaf bundles for organizing your content, if you ever need to switch to branch bundles, this script will help you do it.

Long story short: Leaf bundles offer a superior solution for content management, allowing the grouping of all related content elements, including text, images, downloads, and other files, within a single folder or place. This consolidated structure simplifies content organization and enhances workflow efficiency. With the help of a simple Bash script, switching between leaf bundles and branch bundles becomes a quick and straightforward process, enabling effortless content restructuring

Remember to consult the [Hugo documentation](https://gohugo.io/documentation/) for the latest updates and features. Stay up-to-date to make the most of Hugo's content organization capabilities. Happy content organizing!
