---
title: VSCode v1.76 (aka "The February Release")
linkTitle: Vscode 1.76
description: ''
summary: ''
draft: true
date: 2023-03-02T20:18:24+07:00
publishDate: '2023-03-02T20:18:24+07:00'
lastmod: '2023-03-02T20:54:31+07:00'
resources:
  - title: Photo by [Ryan Putra](https://unsplash.com/@ryanadhi) via [Unsplash](https://unsplash.com/)
    src: header.jpg
categories: []
tags:
  - tag1
  - tag2
  - tag3
  - 100DaysToOffload
keywords:
  - keyword1
  - keyword2
  - keyword3
type: blog
---

A new month brings a new release of VSCode. Let's take a look at what is new:-

- Profile Badges: https://code.visualstudio.com/docs/editor/profiles VSCode configuration profiles allow you to save and switch between different sets of preferences and settings. This can be useful if you have different work environments or if you want to switch between different configurations depending on what you're working on.

  You can create multiple profiles by using the "Preferences: Open User Settings" command and clicking on the "Open Settings (JSON)" button. In the settings.json file, you can create new profiles by using the "workbench.colorTheme", "editor.fontSize", and other settings.

  To switch between profiles, you can use the "Preferences: Open User Settings" command and click on the gear icon in the top-right corner to access the "Settings editor". From there, you can select the "Open Settings (JSON)" option and then select the profile you want to use from the drop-down menu.

	You can now quickly switch between profiles with the Profiles: Switch Profile command in the Command Palette (Ctrl+Shift+P), which presents a dropdown listing your available profiles.

	Profiles now also work in remote or containered VSCode systems (e.g. WSL, SSH, Containers, etc.).


  Learn more about [Profiles](https://code.visualstudio.com/docs/editor/profiles) on the VSCode website.

- JSONC document sorting
  It is now possible to sort JSONC (JSON documents with comments) files by key. To use this feature, select JSON: Sort Document from the Command Palette.

- Git commit syntax highlighting
  VS Code has adopted a new Git grammar, which provides syntax highlighting for Git commit message files. The new grammar has better support for languages other than English.

- Markdown workspace header link completions
  Need to link to a header in another Markdown document but don't remember or want to type out the full file path? Try using workspace header completions! To start, just type ## in a Markdown link to see a list of all Markdown headers from the current workspace:

  Suggestions for all Markdown headers in the current workspace

  Accept one of these completions to insert the full link to that header, even if it's in another file:

  Adding a link to the selected header in another file

  You can configure if/when workspace header completions show with the Markdown > Suggest > Paths: Include Workspace Header Completions setting (markdown.suggest.paths.includeWorkspaceHeaderCompletions).

  Valid setting values are:

  onDoubleHash (the default) - Show workspace header completions only after you type ##.
  onSingleOrDoubleHash - Show workspace header completions after you type # or ##.
  never - Never show workspace header completions.
  Keep in mind that finding all headers in the current workspace can be expensive, so there may be a slight delay the first time they are requested, especially for workspaces with lots of Markdown files.

- Improved extension search relevance
  We have improved the relevance of extension search results in the Extensions view and on the Marketplace gallery. Results should now be more appropriate, especially for multi-word queries.



There are plenty more new features, fixes, and improvements. You can read the [full release notes on the VSCode website](https://code.visualstudio.com/updates/v1_76).
