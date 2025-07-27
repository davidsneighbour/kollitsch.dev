---
title: Refactoring GoHugo Aliases
description: >-
  Refactoring GoHugo aliases to use full function names for better clarity and
  searchability.
date: 2024-02-26T18:29:02+07:00
resources:
  - src: header.jpg
tags:
  - refactoring
  - bash
  - cli
  - gohugo
  - 100daystooffload
cover:
  src: ./header.jpg
  type: image
publisher: rework
---

GoHugo's documentation recently started to show functions and methods with their "real" name, instead of the alias used in the GoHugo codebase. Did you for instance knew that `apply` is actually `collections.Apply` and `append` is `collections.Append`? Knowing these exact names seems to be important to me, because I think it's easier to understand what functions are connected and what features are available. It also makes the search in the documentation work better. Shorter aliases like `in` were hard to find before, now, knowing it's `collections.In` makes it easier to find..

So I decided to refactor my aliases in my GoHugo codebase. I have a lot of them, because I am using GoHugo for quite some time now and I have a lot of modules and partials I am using all over the place with the old syntax. I decided to write a script that does the refactoring for me. It's a simple bash script that uses some RegExp magic to replace the aliases with the full names. It's not perfect, but it works for me.

The file `aliases.toml` is a list of aliases and their full names. The script reads this file and then replaces the aliases in my GoHugo layouts. You might be asking yourself why I choose the TOML format for this file. The answer is, that I can use it shortcodes and layout files too later on.

```toml
dictionary = "collections.Dictionary"
in = "collections.In"
index = "collections.Index"
isset = "collections.IsSet"
merge = "collections.Merge"
slice = "collections.Slice"
sort = "collections.Sort"
where = "collections.Where"
partial = "partials.Include"
partialCached = "partials.IncludeCached"
```

The file is much longer of course, but you get the idea. The script reads the file and then replaces the aliases in the GoHugo layouts. It has a simple check that the alias is not part of a string and is surrounded either by spaces or brackets.

Here is where the magic happens:

```bash
while IFS='=' read -r search_string replace_string; do
  search_string=$(echo "$search_string" | tr -d '[:space:]' | tr -d '-')
  replace_string=$(echo "$replace_string" | tr -d '[:space:]' | tr -d '"' | tr -d '-')

  find "$directory" -type f -exec sed -i -E "s/(\s|\(|\{)($search_string)(\s|\)|\})/\1$replace_string\3/g" {} +

  echo "Replaced '$search_string' with '$replace_string'"
done <"$conversion_file"
```

The full script can be found [in this Gist](https://gist.github.com/davidsneighbour/fb8c0d0188cb9340feab83f77a443093).

Now, let me add the caveats ;) The script is not perfect. The most obvious current bug I found is, that it replaces aliases that might be part of a simple string. If you for instance have a button "Search in this Blog" then the `in` will match and be replaced.

I am however sure, that we all are perfectionist GoHugo layout sculptors that moved all string occurences already into the i18n files, right? Right? ;)

Now goeth forth and refactor your GoHugo aliases for a better more understandable layout future!
