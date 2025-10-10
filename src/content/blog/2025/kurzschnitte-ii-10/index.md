---
title: Kurzschnitte II - Decimus
linktitle: Kurzschnitte II/10
description: Interesting links around the web, from web development to fun stuff.
date: 2025-10-10T12:17:16.215Z
tags:
  - kurzschnitte
  - bookmarks
cover:
  src: kurzschnitte.jpg
  title: Short Cuts
  type: image
options:
  head:
    components:
      - lite-youtube
---

Welcome to another edition of my collection of opened and orphaned browser tabs that never made it to the blog or other uses.

> "Decimus" is a Latin word for "tenth" and was used as a Roman praenomen (first name), often given to the tenth child or used as a family name.

## WebDev

* Let's start with [gradient.style](https://gradient.style/), a Wide Gamut Color 4-compliant CSS gradient builder designed for precision and color fidelity. This tool helps us craft smooth, vibrant gradients while ensuring accurate display across modern, wide-color devices.
* Try [MoodHue](https://moodhue.vercel.app/), an AI-powered tool that creates color palettes based on our mood, giving the design process an emotional twist.
* Stanko's playful GitHub project ["monorail"](https://github.com/Stanko/monorail) can transform any CSS keyframe animation into an interactive visual graph, no manual SVG drawing required. According to the creator, "probably useless for most people, but I had fun making it." It's written in TypeScript with no dependencies and released under the MIT license.
* Flip card effects are common in modern web design, but they can be a nightmare for screen readers if done carelessly. TPGi outlines how to build one properly in ["Creating a Truly Accessible Flip Card"](https://www.tpgi.com/creating-a-truly-accessible-flip-card/), showing the markup and ARIA roles needed to make sure style doesn't come at the expense of usability.

## Tools

* [Logoipsum](https://logoipsum.com/) is a handy resource offering 167 free SVG placeholder logos across styles like logogram, symbol, geometric, and more. We can copy or download assets (SVG and PNG), preview light and dark variants, and even use the Figma plugin for seamless design integration. Recent updates include an optional Editor+ tier with extra fonts and exclusive logograms, as well as enhanced editing tools for color application, random name generation, and transform controls.
* In their latest blog post, ["New Light theme coming to all platforms"](https://draculatheme.com/blog/new-light-theme-coming-to-all-platforms), Zeno Rocha and Lucas de França unveil a fresh open-source light variant of the beloved Dracula theme. The new design builds on the earlier "Alucard" concept with a richer, Bram Stoker-inspired palette and introduces a new color spec open for community contributions. It's a welcome move toward greater accessibility and brightness for everyone.
* The clever GitHub Action ["PR Quiz"](https://github.com/dkamm/pr-quiz) automatically generates a quiz from our pull requests using AI, helping ensure we actually understand the code before merging. Built with OpenAI and ngrok for temporary quiz hosting, it can even prevent merges until comprehension is demonstrated. ([dkamm/pr-quiz on GitHub](https://github.com/dkamm/pr-quiz))
* The project ["github-breakout" by cyprieng](https://github.com/cyprieng/github-breakout) turns our GitHub contribution graph into a fully functional Breakout game rendered as SVGs, with support for dark and light modes. It's a playful, visual way to showcase a coding streak. ([github.com](https://github.com/cyprieng/github-breakout))
* [Colorify Rocks](https://colorify.rocks/) is an AI-powered color palette generator that transforms our keywords, whether a theme or a mood, into harmonious color combinations. It offers export-ready palettes, daily inspirations, a color glossary, and design tools such as contrast checkers and image-based pickers to streamline our creative workflow.
* [Pattern Craft](https://patterncraft.fun/) provides a slick and free library with over 100 production-ready CSS and Tailwind background patterns and gradients. With live previews and one-click copy, it's a developer-friendly toolkit for instantly crafting beautiful designs.
* [Kigen Color Generator](https://kigen.design/color) turns a single base color into a full 11-shade palette. With real-time contrast checking, support for multiple color spaces (HEX, RGBA, HSL, OKLCH), and direct exports for Tailwind, Figma, or CSS, it's a fast and precise way to build accessible, scalable color systems.
* [JustButton](https://www.justbutton.space/) offers a live preview of customizable button styles, complete with padding, typography, colors, hover effects, and code export for React, HTML/CSS, or Tailwind. Press the button for a surprise sound, then grab the code and drop it straight into our project. ([justbutton.space UI](https://www.justbutton.space/), GitHub, full code preview)

## Learn

* Chris Coyier shows how to toggle dark-mode emulation directly inside browser DevTools in his quick walkthrough ["Quick Dark Mode Toggles"](https://frontendmasters.com/blog/quick-dark-mode-toggles/). We get tips for Chrome (via the Rendering tab or command palette), Firefox (sun and moon icons in the Inspector), and Safari, plus a nod to tools like Nightfall for system-level switching.

* [Type Challenges](https://github.com/type-challenges/type-challenges) is a massive open-source collection of TypeScript type-system puzzles paired with an online judge. It's a playground for sharpening our type craft, building utility types, and understanding TypeScript's weird and wonderful depths - no runtime code required. With more than 46 k stars and 5 k forks, it's basically the dojo of the TypeScript world.

* [Secure Messaging Apps Comparison | Privacy Matters](https://www.securemessagingapps.com/index.html) gives a transparent look at how popular messaging platforms measure up in privacy and security. It breaks down who encrypts by default, which tools are open-source, and which ones respect our metadata. From Facebook Messenger to Signal, the list helps us choose chat apps that actually deserve our trust.

* The [WCAG in Plain English](https://aaardvarkaccessibility.com/wcag-plain-english/) series from AAArdvark translates accessibility jargon into real-world language. It organizes guidelines by role, disability, or theme so we can actually apply them without needing a PhD in W3C-speak. Levels A and AA are already rewritten; AAA is coming soon.

* [designtokens.fyi](https://designtokens.fyi/), created by Donnie D'Amato, fills a much-needed gap in design-systems communication. It's a living glossary that clears up the fuzzy vocabulary of tokens, themes, and naming conventions - and even earned a shout-out from [Brad Frost](https://bradfrost.com/blog/link/designtokens-fyi/).

* The [Historical Tech Tree](https://www.historicaltechtree.com/), built by Étienne Fortier-Dubois, visualizes humanity's 1,700-plus technological milestones, from stone tools to quantum chips. Each node links influence to invention, creating a mesmerising web of progress that feels more alive than any static timeline.

* Finally, [Learn MCP - Build a Model Context Protocol server with Cloudflare Workers](https://learnmcp.examples.workers.dev/) guides us through seven hands-on labs, from setup and deployment to storage and real-world integration. By the end, we'll have a production-ready MCP server linking AI assistants with external systems through Cloudflare Workers.

## Food for thought

* Eric Meyer's post ["No, Google Did Not Unilaterally Decide to Kill XSLT"](https://meyerweb.com/eric/thoughts/2025/08/22/no-google-did-not-unilaterally-decide-to-kill-xslt/) dives into the WHATWG debate around dropping native XSLT support from browsers. The conversation began with a Google proposal but reflects wider security and maintenance concerns among vendors. Despite the drama, XSLT isn't dead - server-side rendering, WASM polyfills, or lightweight client scripts can still keep it alive for years to come.

* ["A proposal for inline LLM instructions in HTML based on llms.txt"](https://vercel.com/blog/a-proposal-for-inline-llm-instructions-in-html) from Vercel's CTO Malte Ubl suggests embedding `<script type="text/llms.txt">` directly into HTML to give AI models contextual hints while browsers safely ignore them. It's a neat trick for connecting LLMs to protected preview deployments through MCP, enabling agent discovery without touching the user-facing frontend.

* NYU psychologist Jay Van Bavel asks a sharp question in ["Are a few people ruining the internet for the rest of us?"](https://www.theguardian.com/books/2025/jul/13/are-a-few-people-ruining-the-internet-for-the-rest-of-us). His research shows that roughly 10 % of users generate 97 % of political tweets, while 0.1 % spread 80 % of fake news - a small crowd shaping a noisy digital reality. He points to algorithms that amplify extremes, urging us to tweak our own habits and push for systems that reward nuance over outrage.

* Colin Cornaby's essay ["In the future, all food will be cooked in a microwave…"](https://www.colincornaby.me/2025/08/in-the-future-all-food-will-be-cooked-in-a-microwave-and-if-you-cant-deal-with-that-then-you-need-to-get-out-of-the-kitchen/) argues that the humble microwave isn't a lazy shortcut but a glimpse into how cooking will evolve - efficiency beating tradition. He frames resistance to it as cultural nostalgia more than culinary principle. And if that logic sounds familiar, it probably mirrors the AI debate… which might just be the point.

## Fun and stuff

* In the mischievous spirit of "just joshing around," [HN Slop](https://www.josh.ing/hn-slop) serves up fresh, AI-generated startup ideas based on the current Hacker News front page, because why not mine random tech chatter for improbable business fodder?
* Test our understanding of obscure (but technically valid) email formats with [Email is Easy](https://e-mail.wtf/), an interactive quiz that challenges us to label quirky email addresses as valid or invalid based on RFC rules. Created using the `email-addresses` library, it's both enlightening and mischievously fun.

## FOMO

* Handwritten notes often feel more personal than typing, but they rarely make it into digital workflows. Montblanc tries to bridge that gap with [Digital Paper](https://www.akqa.com/work/montblanc/digital-paper/), a project by AKQA that pairs the company's pens with real-time digitisation, letting ink on paper live simultaneously in the analogue and digital world. It also feels like [reMarkable](https://remarkable.com) for the upper 1%.
* The idea of a marketplace for robots might sound like science fiction, but [Ronomics](https://ronomics.com/) pitches itself as a humanoid robotics exchange. The platform focuses on leasing and trading robot prototypes, framing it less like a futuristic showroom and more like a stock market for machines, where deals and negotiations shape what might one day become everyday technology.

## Watch

In the haunting short film [Portrait of God](https://www.youtube.com/watch?v=BI9fKfX5V68), a devout young woman prepares to present on a mysterious painting, only to confront an image that defies belief and unravels her faith in chilling fashion.

<lite-youtube videoid="BI9fKfX5V68" />
