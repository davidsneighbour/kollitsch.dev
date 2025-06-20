---
title: "Fixing post previews in VSCode with Front Matter"
description: "VSCode Front Matter may not recognize Hugo blog posts if fmContentType is missing. This post explains how to automate front matter updates using a Node.js script."
summary: "VSCode Front Matter sometimes fails to recognize Hugo blog posts due to missing fmContentType. This post explores the issue, explains why it happens, and provides a Node.js script to automate front matter updates. The script ensures proper previews by setting fmContentType across all Markdown files."
date: "2025-02-08T14:09:39+07:00"
resources:
  - title: "Front Matter"
    src: "frontmatter.png"
tags:
  - "nodejs"
  - "frontmatter"
  - "gohugo"
  - "100daystooffload"
fmContentType: "blog"
cover: "./frontmatter.png"
---

If you are using the VSCode plugin [Front Matter](https://frontmatter.codes/) to manage your content in GoHugo, you might have run into this issue: The preview sometimes fails to recognize your posts article image correctly.

This is exactly what I reported in [GitHub Issue #908](https://github.com/estruyf/vscode-front-matter/issues/908) of the project.

The culprit? My recent changes to the front matter structure in Hugo blog posts. I had a `type: blog` property on all posts, but was more and more removing it, because under Hugo the section (content root folder) that a post is in defines the type. Adding the `type` as frontmatter will override this default type and (in my case) was unnecessary. This change though caused the Front Matter plugin to not recognize my posts as `blog` post type anymore so it stopped showing previews.

The Fix is easy: add `fmContentType` in the front matter of each post.

To ensure that VSCode Front Matter correctly identifies your Hugo blog posts, you need to **explicitly define `fmContentType`** in your front matter. If you have many Markdown files, updating them manually is a pain.

The following **Node.js script** automates this process by:

* Scanning all Markdown (`.md`) files in a given folder and
* Adding or updating `fmContentType` with a given value

**How to Use the Script**

1. Install dependencies:

   ```sh
   npm install gray-matter
   ```

2. Save this script, for instance as `manage-frontmatter.mjs`:

   ```javascript
   #!/usr/bin/env node

   import fs from 'fs';
   import path from 'path';
   import { execSync } from 'child_process';

   const showHelp = () => {
       console.log(`
   Usage:
     node manage-frontmatter.mjs --folder=content/blog --key=fmContentType --value=blog

   Options:
     --folder=<path>   Directory to scan for Markdown files (default: 'content')
     --key=<param>     Frontmatter key to add/update
     --value=<value>   New value for the frontmatter key
     --help            Show this help message
       `);
       process.exit(0);
   };

   const args = process.argv.slice(2).reduce((acc, arg) => {
       const [key, value] = arg.split('=');
       acc[key.replace('--', '')] = value;
       return acc;
   }, {});

   if (args.help || !args.key || !args.value) {
       showHelp();
   }

   const baseFolder = args.folder || 'content';
   const keyToUpdate = args.key;
   const newValue = args.value;

   const isPackageInstalled = async (packageName) => {
       try {
           await import(packageName);
           return true;
       } catch (e) {
           return false;
       }
   };

   const packageName = 'gray-matter';

   isPackageInstalled(packageName).then(async (installed) => {
       if (!installed) {
           console.error(`\n⚠️  The package '${packageName}' is not installed.\n`);
           process.stdout.write("Would you like to install it now? (y/n) ");
           process.stdin.setEncoding('utf8');
           process.stdin.once('data', (answer) => {
               answer = answer.trim().toLowerCase();
               if (answer === 'y') {
                   console.log(`\nInstalling ${packageName}…\n`);
                   try {
                       execSync(`npm install ${packageName}`, { stdio: 'inherit' });
                       console.log(`\n✅ ${packageName} installed. Please run the script again.\n`);
                   } catch (err) {
                       console.error(`\n❌ Failed to install ${packageName}. Exiting.\n`);
                   }
               } else {
                   console.log(`\n❌ ${packageName} is required to run this script. Exiting.\n`);
               }
               process.exit();
           });
           process.stdin.resume();
       } else {
           const { default: matter } = await import(packageName);
           const processDirectory = (dir) => {
               fs.readdirSync(dir).forEach(file => {
                   const fullPath = path.join(dir, file);
                   if (fs.statSync(fullPath).isDirectory()) {
                       processDirectory(fullPath);
                   } else if (file.endsWith('.md')) {
                       updateFrontmatter(fullPath);
                   }
               });
           };

           const updateFrontmatter = (filePath) => {
               const content = fs.readFileSync(filePath, 'utf8');
               const parsed = matter(content);
               parsed.data[keyToUpdate] = newValue;
               const updatedContent = matter.stringify(parsed.content, parsed.data);
               fs.writeFileSync(filePath, updatedContent, 'utf8');
               console.log(`Updated ${filePath}: Set '${keyToUpdate}' to '${newValue}'`);
           };

           console.log(`Scanning folder: ${baseFolder}`);
           processDirectory(baseFolder);
           console.log('Update complete.');
       }
   });
   ```

3. Run the script to update all blog posts:

   ```sh
   node manage-frontmatter.mjs --folder=content/blog --key=fmContentType --value=blog
   ```

With this, your Hugo blog posts display previews in VSCode, resolving the issue.

Managing front matter across a static site shouldn't be a struggle. This script ensures your Hugo blog works seamlessly with VSCode Front Matter, saving you time and headaches when sweeping changes to the front matter are required.
