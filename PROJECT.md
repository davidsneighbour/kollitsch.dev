# Project Instructions

These are instructions for agents working on this repository.

* You are working in [https://github.com/davidsneighbour/kollitsch.dev](https://github.com/davidsneighbour/kollitsch.dev).
* Read and understand AGENTS.md before you do anything else.
* If available read and understand all instructions under `.github/instructions` and apply them to files as per `applyTo` field in the instruction files.
* Update your references and content files of this repository before you begin with work
* If a filename/path is used without full path, assume it is relative to the root of this repository.
* Packages referred to by @davidsneighbour/PACKAGENAME can be found at [https://github.com/davidsneighbour/PACKAGENAME](https://github.com/davidsneighbour/PACKAGENAME). If you need to use a package that is not found there ask for a clear location for the latest version of the package.
* If a folder contains a README.md file, read it and follow the instructions in it before you do anything else in that folder.
* if a folder contains an INDEX.md file, read it and follow the structure laid out in that file.
* Update README.md and INDEX.md files as you work on their counterparts.
* Add documentation for any change you do in the codebase.

## Git instructions

* In this repo only commit to a feature branch for all changes. Do not commit directly to main.
* Commit to main only if explicitly asked to do so by @davidsneighbour.
* use conventional changelog commit messages.
* use .release-it.ts to find a list of available scopes for commit messages.

## Package manager instructions

* use static versions in package.json.
* use npm as packages manager and make sure `npm install` works without any issues.

## Quick instructions

* "Update your references" - load the currently used repository and update to the latest HEAD of the main branch. Update your code to relect any changes in the repository. If there are any merge conflicts, resolve them and update your code accordingly.
* "Document" - either add documentation to the README.md file in the folder you worked on or create a new documentation file and link it in the README.md file. The documentation should explain what the code does, how to use it, and any other relevant information that would be helpful for someone who is new to the codebase.
