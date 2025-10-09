---
title: The fonts that shape KOLLITSCH.dev*
description: A look at the typefaces that define the visual identity of KOLLITSCH.dev*.
date: 2025-10-08T23:59:08.582Z
tags: [fonts,typography,design,kollitsch]
cover:
  src: type-specimen.png
  title: Type specimen of Changa One and Exo 2
  alt: A type specimen showcasing the fonts Changa One and Exo 2 used on
---

Typography plays a subtle but defining role in how a website feels. On [KOLLITSCH.dev*](https://kollitsch.dev/), two distinct typefaces form the visual foundation - **Changa One** and **Exo 2**. Each serves a specific purpose and reflects a balance between a bold character and everyday readability. Both fonts are available under a open source license via Google Fonts.

## Changa One - strength in simplicity

Used for the site logo and all major headlines, [Changa One](https://fonts.google.com/specimen/Changa+One) brings a blocky and confident look. Its sturdy letterforms make it instantly recognisable, while still being easy to read even at larger display sizes.
However, Changa One only ships with a single weight (400). Despite being visually bold, its declared weight can cause quirks in CSS frameworks such as Tailwind, which expect true bold weights like 700. This required a bit of extra work to enforce consistent rendering - a topic I explored in detail in [Font-weight enforcement in TailwindCSS 4.1](https://kollitsch.dev/blog/2025/font-weight-enforcement-in-tailwind/).

## Exo 2 - function meets comfort

For body text and everything that demands legibility, basically everything else, [Exo 2](https://fonts.google.com/specimen/Exo+2) takes over. This non-serif, variable typeface offers a broad range of weights, leaving me flexible for emphasis without sacrificing harmony. The website primarily uses weights **400** (regular) and **600** (semibold), creating a clear hierarchy without visual fatigue.
Exo 2 performs beautifully on smaller screens and compact layouts, making it ideal for long-form reading and mobile experiences.

## Why this pairing works

Changa One gives headlines a punchy, geometric authority, while Exo 2 provides a clean, balanced rhythm for extended reading. The result is a combination that feels confident yet approachable - much like the voice of KOLLITSCH.dev* itself.

Changa One defines the tone; Exo 2 carries the conversation.

## Setup notes

Both fonts are hosted locally within this website instead of being served from a third party CDN. I do this mostly because they would be cached per hostname in any case and self-hosting gives me full control over loading strategies, subsetting and future updates or optimizations.

You can find the current version of the font-setup in my [Github repository](https://github.com/davidsneighbour/kollitsch.dev/blob/509f455ea8e457c3238dd9fa58ca176c8b8d4311/src/styles/components/fonts.css).
