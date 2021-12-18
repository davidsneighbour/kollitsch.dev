---
title: "How to Request Help in Hugo's Discourse"
linktitle: "How to Request Help"
date: 2021-05-12T20:10:29+07:00
description: "This is meta description"
draft: true
---

{{< notebox >}}
This is an attempted rewrite of the "[How to request help](https://discourse.gohugo.io/t/requesting-help/9132)" post for [the Hugo Discourse community forum](https://discourse.gohugo.io/). The current version is written in a very developer-centric way and ignores, that in the past two years Hugo has become the go-to static website generator, which naturally leads to support requests of people that are unversed in the ways of how developers think and describe issues.

This post tries to remedy this by writing an engaging and comprehensive guide to write readable and conclusive issue reports with lots of entry points that people can be sent to when they "infringe" on one of the "rules". It also tries to create a to the point short wording without too many fancy phrases that might make it hard to understand for non-native language speakers. Looking at you, _corollary_ ;]

Boxes like this one will explain the thoughts behind the changes and suggestions and are not part of the how-to.
{{< /notebox >}}

_**Please read the following guidelines to learn how to ask for help in the forum.**_

Welcome to the Hugo forums and thanks for using **Hugo**! The below are a few friendly tips on getting help from the other Hugo volunteers in this forum.

**Jump to your topic of interest**

- [Code of Conduct for the Hugo Discourse Forum]({{< ref "#code-of-conduct-for-the-hugo-discourse-forum" >}})
- [Common misconceptions]({{< ref "#common-misconceptions" >}})
- [Some knowledge required]({{< ref "#some-knowledge-required" >}})
- [Ok, got it, how do I get help?]({{< ref "#ok-got-it-how-do-i-get-help" >}})
- [Add relevant information]({{< ref "#add-relevant-information" >}})
- [More help, information and useful links]({{< ref "#more-help-information-and-useful-links" >}})
- [The emergency hotline theorem]({{< ref "#the-emergency-hotline-theorem" >}})

## Code of Conduct for the Hugo Discourse Forum

[This](https://discourse.gohugo.io/) is a positive and friendly community, and &mdash; as with other open source projects &mdash; we run on unpaid volunteer work. The following rules of conduct will make things easier in the forum:

* **Pitch in** and offer what help you can, as there is never enough time to do everything. If you noticed that something is lacking in the docs, feel free to contribute!
* Assume good intentions. English is the language of the forum (except for a couple subforums), but it is not every user's *native* language. Try to avoid too much slang, abbreviations, or idiomatic expressions.
* Keep it civil, courteous and polite. Personal attacks have no place here, as well as attacks on belief systems of any kind, may they be technical or societal.
* The discussion should be on topic, related to Hugo usage. Topics like general JavaScript or CSS questions or world events and politics have their place on other websites and forums. Please consider taking your issue there please. If you start a thread on the discourse it might be closed as off-topic.
* This forum &mdash; https://discourse.gohugo.io/ &mdash; is the *official support forum* for Hugo. The developers and an army of voluntary members are here to help you with all your questions.

We reserve the right to ban or suspend anyone from being a part of this community who cannot play by these rules. Thank you for your understanding.

## Common misconceptions

### You did not pay for this product and support is nothing you are entitled to, but we are here to help you. Act (phrase) accordingly.

A lot of first time users of Hugo get grumpy (to phrase it friendly) that their question, issue or problem is not answered in a timely and fulfilling manner and answers might sound rough or unfriendly. This is, because they ... TBD

### Hugo is a static website generator, JavaScript is dynamic

This basically means, that Javascript is run, after the browser of the visitor of your website loaded the website. This is long after you create the site with Hugo. When you create the site a file is built and saved as that page. Then you load it on your hosting space, then a visitor comes. Long story short: If your question relates to dynamically changing things on a page, then it's probably not something Hugo can do, but _you_ can do it with JavaScript later on.

## Some Knowledge Required

Dare we say that while **Hugo** is indeed pretty magical, it is not meant to be a "magic wand" to suddenly give you a published website a la Square Space or Wordpress. You are expected to already know how to assemble a static web page, for which you do need some basic knowledge of html, css, command line and text editors. Or how to prepare a space to host your website. The bottom line is, if you are unwilling to invest the time required to learn these things, then Hugo is not for you.

If you _do_ put the time in, Hugo will help you rapidly merge your html templates, css, javascript, media, and even data, into a flexible working site. In addition, you get the added benefit of understanding how things fit together, which in turn makes understanding a variety of website builders and content management systems much easier. It is really a worthwhile investment to put the time in, to learn the basic building blocks well.

There are too many such sites to mention but if you're just starting out, here are a couple of sites to take a look at: [w3schools](https://www.w3schools.com), [HTML5 Boilerplate](https://html5boilerplate.com) or [hackr.io](https://hackr.io/tutorials/learn-html-5).

## How do I get help?

Thanks for bearing with me on the above, which needed to be said given the sheer volume of people asking similar questions. Here are several points that if you follow, will help get you a positive outcome in the forums:

### Search older posts

It is likely, that your question has been asked and answered before. If you search the forum you can find previous threads and related issues. Of course, the main problem is always to know what exactly to search for. If you can't find any solution for your problem and it already exists then members of the forum will probably add a link to the original solution.

**NOTE:** Please do not add your current issue to an older post. People that were part of these discussions might not be a part of the forum anymore and old topics tend to refer to older features. Hugo changes fast and old solutions might not be the preferred solutions in newer versions. Feel free to link to an old topic to include their solutions and "hacks" into the current discussion.

### Read the Docs

_Read [the docs](https://gohugo.io/documentation/)_, because they are pretty good and a lot of work goes into them. Then read them again. But note that they sometimes lag behind releases a bit. If you can help with that, please do.

A corollary to this is, read the [release notes](https://github.com/gohugoio/hugo/releases). If you are having a problem after upgrading Hugo, you may find a hint here.

### Frequently Asked Questions

Notes to address repeat inquiries about common problems:

* If your posts are not showing up, check if draft is set to true in your content frontmatter.
* Run `hugo server` for the development server for inspecting your site during development, and just `hugo` to generate the `/public` folder in your project, which you upload to your site container.
* In your config, make sure `baseURL` is correct.
* If you are using a theme, you can override the theme's files to make a change. For instance, assuming you are using Hyde, installed at `/themes/hyde` in your project, you can copy `/themes/hyde/layouts/index.html` to `/layouts/index.html` and edit that. Your copy will override that of the theme.
* Hugo's [lookup order](https://gohugo.io/templates/lookup-order/) is a source of confusion at first, but it is well defined and will help you understand what template is being applied to a given page.
* Hugo commands are case-sensitive, so pay attention to that when you build your templates.

### General thread mechanics

Create a new thread in #support, for each new issue. Generally speaking, let us know:

1. _what you were doing or what you tried_,
1. _what you expected_, and
1. _what actually happened_.

Format your forum posts using the _de facto_ standard [markdown](http://commonmark.org/help/), BBCode or HTML. See https://discourse.gohugo.io/t/sharing-code-in-the-forums/8968/5 for some good tips on code formatting.

When you _do_ get an answer, mark the best answer in the thread using the checkbox icon from the comment action menu (with like, edit, bookmark etc). This marks the thread as solved.

Finally, please close the loop, by posting a summary in your thread about how you were able to solve the problem. In fact, keeping communications public, clear and complete helps the project.

### Let us see your code

Include a **link to the source code repository** of your project, because we really need the _context_ of seeing your templates and partials to be able to help you. It is trivial to do a quick `git clone` on your repo, then run `hugo server` in your project, to help you out. On the other hand, recreating your code from screenshots, or sort of guessing at it, is not.

If you can't share your repository for whatever reason, consider creating a dummy repo that you _can_ share, which reproduces the problem you're experiencing.

Git repository hosting services include [Github](https://github.com), [Bitbucket](https://bitbucket.org/), [Codebase](https://www.codebasehq.com), [Gitlab](http://gitlab.com/), [Sourcehut](https://sourcehut.org), and others. If you select Github, even if you do not know `git` or have a repository, you can use Github “gists” for pasting logs and files. You can include multiple files in a single gist, like [this one](https://gist.github.com/RickCogley/2f0d21144e5f3091e62a6ced211c71f3).

### Are you using a theme?

Consider contacting the theme's author, if it is a theme-specific question because often the author will know better than the random passer-by in the forum. Check the theme's README. But at least include a link to the theme, to help a person trying to help you.

### Include Output and Environment Details

First, use the `--verbose` switch on `hugo server` to produce more details on the command line including about errors.

Include the output of `hugo env` from the command line, and any other relevant versions.

```
~> hugo env
Hugo Static Site Generator v0.55.2-9D0203488/extended darwin/amd64 BuildDate: 2019-04-17T12:29:48Z
GOOS="darwin"
GOARCH="amd64"
GOVERSION="go1.12.2"
~> git version
git version 2.20.1
```

## How does a (nearly) perfect support request look like?

A perfect support request hands the volunteers or developers enough information to understand your problem. There are multiple parts of that "information system":

### What does your environment look like

###

## Add relevant information

### Is your issue related to content showing up or not showing up unwanted?

- Add relevant layouts (or your repository or a minimal sample of your repository)
- Add content (including frontmatter) that re-creates your issue

### Is your issue related to design issues between your local development and the live site?

- Add the content of your config.toml
- Add the global default template from `_default/baseof.html`
- Add the layouts that are responsible for adding/loading/creating your stylesheets

{{< notebox >}}
And now a list of useful links to anything Hugo related. Let's add descriptive links and point people towards probable solutions.
{{< /notebox >}}

## More help, information and useful links

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Github Repository](https://github.com/gohugoio/hugo)
- [Frequently Asked Questions](https://gohugo.io/troubleshooting/faq/)
- [Releases](https://github.com/gohugoio/hugo/releases)
- [Recommended Reading](https://discourse.gohugo.io/t/recommended-reading/14815)

## The emergency hotline theorem

The following comparison tries to hit a point home about how to report your issue with Hugo. Try to think abstract ;)

Let's assume you smoked in your bedroom, you fell asleep with the "cig" between your lips, the bedroom started burning. You are in a corner of your room, across the room is a window, between you and the window is a huge firestorm.

You call the emergency hotline.

The nice lady on the other side of the emergency hotline says "Hello, how can I help you?" - what do you say?

- A) Hello, I can't jump out of my window, please help
- B) Hello, please save me!
- C) Hello, there is a fire right in the middle of my room, what should I do?
- D) Hello, I am trapped in the corner of my room, the only exit is across the room, but there is a fire between me and the window. Please help!
- E) Hello, my room is on fire, there is fire right in the middle of the room. The only exit is across the room and I can't get there because between me and the exit is the fire. My house is made of stone so the fire might not spread. Please advise what to do to stay alive and come to put out the fire.

Whatever you answered, please look at your last problem report on the Hugo Discourse. ... See it? Thanks.

To make it short, your issue should contain the following points:

- What are you trying to achieve? (save your life)
- How do you try to achieve that? (jumping out of the window, that is across the room with a fire between you and the window)
- What is the exact error you are experiencing? (there is a fire between you and the window)
