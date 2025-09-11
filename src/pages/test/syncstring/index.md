---
title: test-syncstring
description: "some test"
date: 2025-09-05T05:11:47.059Z
tags: []
cover:
  src: ""
  title: ""
---


<dnb-syncstring
  theme="dracula"
  class="w-full max-w-2xl flex flex-col gap-4"
  fields='[
 {"label":"Username","type":"text","slug":"username","placeholder":"octocat"},
    {"label":"Repository","type":"text","slug":"repo","placeholder":"hello-world"},
    {"label":"API key","type":"password","slug":"apiKey","placeholder":"ghp_***","revealToggle":true}
  ]'
  result-template="https://{apiKey}@github.com/{username}/{repo}.git"
  threshold="2"
  debounce="150">
</dnb-syncstring>

<dnb-syncstring
  theme="dracula"
  tailwind="true"
  tw-theme="dracula"
  fields='[
    {"label":"Username","type":"text","slug":"username","placeholder":"octocat"},
    {"label":"Repository","type":"text","slug":"repo","placeholder":"hello-world"},
    {"label":"API key","type":"password","slug":"apiKey","placeholder":"ghp_***","revealToggle":true}
  ]'
  result-template="https://{apiKey}@github.com/{username}/{repo}.git"
  threshold="2"
  debounce="150">
</dnb-syncstring>

<dnb-syncstring
  tailwind="true"
  tw-theme="light"
  styles='{
    "root":"max-w-3xl",
    "result":"font-mono text-sm p-3 border rounded bg-transparent",
    "copyBtn":"px-3 py-1.5 border rounded"
  }'>
</dnb-syncstring>
