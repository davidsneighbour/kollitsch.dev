

## [custom action settings](https://frontmatter.codes/docs/custom-actions#the-custom-action-setting)

- title: The title of the custom action
- script: The path to the script to execute
- command: The command to execute. Example: node, path to your node executable, bash, python, ... (default: node - optional).
- type: The type for which the script will be used. Can be content or mediaFile or mediaFolder. (default: content - optional).
- bulk: Run the script for one file or multiple files. .
- output: Specifies the output type (default: notification - optional). Available values are:
  - notification: The output will be passed as a notification.
  - editor: The output will be passed to the editor.
- outputType: Specifies the output type (default: text - optional). Available values the editor values from VS Code like:
  - text: The output will be passed as a text file.
  - html: The output will be passed as an HTML file.
  - markdown: The output will be passed as an Markdown file.

# Frontmatter configuration

In `frontMatter.taxonomy.dateFormat` you can define how timestamps are formatted in Hugo. The formatting language is documented at https://date-fns.org/v2.0.1/docs/format. The default string of Hugo would look like this: `"yyyy-MM-dd'T'H:mm:ssxxx"`. The single quotes around the `T` will display the character as-is, all other characters are interpreted as documented above.

```json
  "frontMatter.taxonomy.dateFormat": "yyyy-MM-dd'T'H:mm:ssxxx",
```
