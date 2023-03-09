---
title: Configuring file nesting in VSCode
description: ""

draft: true

date: 2023-02-23T21:18:33+07:00
publishDate: 2023-02-23T21:18:33+07:00
lastmod: 2023-02-23T21:18:33+07:00

resources:
  - title: Photo by [Gabriel Heinzer](https://unsplash.com/@6heinz3r) via [Unsplash](https://unsplash.com/)
    src: header.jpg

tags:
  - tag1
  - tag2
  - tag3
  - 100DaysToOffload

type: blog
---

https://code.visualstudio.com/updates/v1_67#_explorer-file-nesting

One of the biggest challenges when working with IDEs is managing clutter, especially as projects get larger and more complex. With a large number of files and folders, it can be difficult to find what you need quickly, which can lead to wasted time and frustration. By enabling and configuring file nesting in the explorer view of VSCode, you can organize your files in a more structured and logical way, grouping related files together and reducing the amount of clutter in your project. This can help you find what you need faster, streamline your workflow, and ultimately be more productive. By nesting files, you can create a more intuitive and easy-to-navigate file structure that makes it easy to work with large projects without getting lost in the sea of files.

In this blog post, I will summarizing how I set up file nesting in my workspaces, and how to enable and configure it.

File nesting is a feature in VSCode that groups related files together in a folder hierarchy. This makes it easier to navigate and manage your files, especially when working on large projects with multiple files. By default, file nesting is not enabled in VSCode, but it can be easily configured.

Enabling File Nesting in VSCode

To enable file nesting in VSCode, you need to add the following line to your settings.json file:
```json{noconfig=true}
"explorer.fileNesting.enabled": true
```

You can open the settings.json file by clicking on the gear icon on the bottom left corner of the VSCode window and selecting "Settings". You can also open the settings.json file by using the keyboard shortcut Ctrl + , on Windows or Cmd + , on Mac.

Configuring File Nesting in VSCode

Once you have enabled file nesting in VSCode, you can configure it further by adding patterns and expanding or collapsing nested files.

You can also expand or collapse nested files by adding the following line to your settings.json file:

```json{noconfig=true}
"explorer.fileNesting.expand": "always"
```

In the above example, we are setting the expand option to "always", which means that all nested files will be expanded by default.

Using antfu/vscode-file-nesting-config

If you want to save time configuring file nesting in VSCode, you can use the antfu/vscode-file-nesting-config extension. This extension provides a pre-configured file nesting pattern for popular programming languages like JavaScript, TypeScript, and Vue.

To use this extension, you need to install it from the VSCode marketplace and then add the following line to your settings.json file:

```json{noconfig=true}
"fileNesting.configs": ["@antfu/vscode-file-nesting-config"]
```

This will enable the pre-configured file nesting pattern provided by the extension.

Conclusion

Enabling and configuring file nesting in VSCode can make your coding experience more efficient and organized. By following the steps outlined in this blog post, you can easily enable and configure file nesting in VSCode. You can also use the antfu/vscode-file-nesting-config extension to save time and use pre-configured file nesting patterns.

The antfu/vscode-file-nesting-config extension provides a set of pre-configured file nesting patterns for various programming languages. These patterns can help you organize your files in a more structured and logical way, without having to write custom patterns yourself.

Here are some of the options available in the extension:

@antfu/vscode-file-nesting-config/javascript: This pattern is designed for JavaScript files and groups related files together based on their functionality. For example, all utility functions are grouped together in a utils folder, all components are grouped together in a components folder, and so on.

@antfu/vscode-file-nesting-config/typescript: This pattern is similar to the JavaScript pattern but is designed specifically for TypeScript files.

@antfu/vscode-file-nesting-config/vue: This pattern is designed for Vue.js files and groups related files together based on their file type. For example, all components are grouped together in a components folder, all views are grouped together in a views folder, and so on.

@antfu/vscode-file-nesting-config/react: This pattern is designed for React.js files and groups related files together based on their file type. For example, all components are grouped together in a components folder, all pages are grouped together in a pages folder, and so on.

You can use these patterns by adding the following line to your settings.json file:

```json{noconfig=true}
"fileNesting.configs": ["@antfu/vscode-file-nesting-config/javascript"]
```

This will enable the JavaScript file nesting pattern provided by the extension. You can replace javascript with any of the other options listed above to use a different pattern.

In addition to these pre-configured patterns, the extension also provides options for customizing the file nesting behavior. For example, you can specify a custom delimiter for separating nested files, or you can specify a custom order for the file nesting patterns.

Here are some examples of these options:

fileNesting.delimiter: This option allows you to specify a custom delimiter for separating nested files. The default delimiter is /, but you can change it to any other character, such as \_ or -.

fileNesting.order: This option allows you to specify a custom order for the file nesting patterns. By default, the patterns are applied in the order they appear in the configuration file, but you can change this order to prioritize certain patterns over others.

Overall, the antfu/vscode-file-nesting-config extension is a great tool for quickly configuring file nesting in VSCode. It provides a set of pre-configured patterns for popular programming languages, as well as options for customizing the file nesting behavior.
