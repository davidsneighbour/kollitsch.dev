---
title: Kurzschnitte II - a ninth part
description: 'Interesting links around the web, from web development to fun stuff.'
date: 2025-03-21T18:42:40+07:00
resources:
  - title: >-
      Photo by [Kelsy Gagnebin](https://unsplash.com/@kelsymichael) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
categories:
  - kurzschnitte
tags:
  - kurzschnitte
  - bookmarks
  - 100daystooffload
fmContentType: blog
cover:
  src: ./header.jpg
  type: image
options:
  head:
    components:
      - lite-youtube
publisher: rework
---

It's been a minute—so let's call this the slightly-belated-but-still-worth-it edition of interesting links around the web. From playful coding companions to government UFO footage, here are the latest (and overdue) links I was hording in my todo list that are worth checking out.

## Webdev

* [Public Work](https://public.work/) offers a search engine that allows users to access over 100,000 copyright-free images from institutions like The Metropolitan Museum of Art and the New York Public Library. This resource is valuable for researchers, artists, and anyone seeking high-quality, freely usable images.
* The [Interop 2024 dashboard](https://wpt.fyi/interop-2024?feature=interop-2024-accessibility) provides insights into browser compatibility concerning accessibility features. This initiative evaluates how different browsers implement accessibility standards, aiming to enhance the user experience for individuals with disabilities. The dashboard presents test results across various focus areas, highlighting discrepancies and guiding developers toward more consistent and inclusive web design.
* For web designers seeking practical inspiration, [Websitevice](https://websitevice.com/) offers a curated gallery of website examples across various industries, including business, startups, real estate, software, and e-commerce. Unlike traditional design award sites, Websitevice focuses on showcasing designs that prioritize functionality and user engagement, making it a valuable resource for creators aiming to achieve tangible results.
* For web developers aiming to enhance performance and maintain typographic consistency across different operating systems, [Modern Font Stacks](https://modernfontstacks.com/) offers a curated collection of CSS `font-family` declarations. These stacks are organized by typeface classifications—such as System UI, Transitional, Old Style, and more—allowing developers to implement system fonts that render instantly without the need for downloading, thereby eliminating layout shifts and flashes. By utilizing these predefined font stacks, you can ensure a seamless and efficient user experience across various platforms.
* For developers seeking to monitor CSS property changes in real-time, [Style Observer](https://observe.style/) offers a robust, production-ready JavaScript library. This tool enables observation of both custom and standard CSS properties on any element, including those within the Shadow DOM. It effectively detects and circumvents browser-specific bugs, ensuring consistent performance across platforms. Lightweight and dependency-free, Style Observer provides a straightforward API for integrating style change detection into your projects.
* For those interested in steganography and AI, [Textcoder](https://github.com/shawnz/textcoder) offers a proof-of-concept tool that encodes secret messages into seemingly ordinary text using Large Language Models (LLMs). By encrypting a message and applying arithmetic coding based on an LLM-derived statistical model, Textcoder generates text that appears as typical LLM output, effectively concealing the hidden message. This approach allows for covert communication in public channels without arousing suspicion. The project is open-source and actively seeking feedback and contributions from the community.
* In his recent article, ["?nodefine — a pattern to skip Custom Element definitions"](https://www.zachleat.com/web/nodefine/), Zach Leatherman introduces an innovative approach for developers working with custom elements. He proposes adding a `?nodefine` query parameter to script URLs, allowing developers to import custom elements without automatically registering them. This technique offers greater flexibility, enabling the use of alternative tag names or additional configurations before definition. Leatherman's method enhances control over custom element registration, facilitating more adaptable and maintainable code.
* In a recent update, the CSS properties `scrollbar-gutter` and `scrollbar-width` have become [Baseline Newly available](https://web.dev/blog/baseline-scrollbar-props/), ensuring consistent support across all major browser engines as of December 11, 2024. The `scrollbar-gutter` property allows developers to reserve space for scrollbars even when they are not present, preventing layout shifts when scrollbars appear. Meanwhile, `scrollbar-width` enables customization of scrollbar thickness or complete removal without affecting scrollability. These enhancements provide greater control over scrollbar aesthetics and behavior, contributing to more stable and visually appealing web designs.

## Learn

* For those looking to harness the full potential of FFmpeg, the website [FFmpeg By Example](https://ffmpegbyexample.com/) offers a comprehensive collection of practical examples. From extracting audio tracks to applying complex video filters, this resource provides step-by-step guides to accomplish various media processing tasks using FFmpeg. Whether you're a beginner or an experienced user, the examples provided can help you effectively utilize FFmpeg's capabilities.
* In his article, ["6 CSS Snippets Every Front-End Developer Should Know In 2025"](https://nerdy.dev/6-css-snippets-every-front-end-developer-should-know-in-2025), Adam Argyle presents essential CSS techniques for modern web development. He emphasizes the importance of implementing springy easing with `linear()`, utilizing view transitions for page navigation, and creating typed custom properties. These snippets aim to enhance user experience and promote efficient coding practices in 2025.
* In his article, ["Do I Need This Node Dependency?"](https://brianmuenzenmeyer.com/posts/2024-do-i-need-this-node-dependency/), Brian Muenzenmeyer explores recent advancements in Node.js that enhance its out-of-the-box capabilities. He discusses features such as native argument parsing, environment variable management, and output styling, which can reduce reliance on external packages like yargs, dotenv, and chalk. Muenzenmeyer emphasizes the importance of evaluating whether additional dependencies are necessary, given Node.js's evolving standard library.
* In his article, ["Faux Containers in CSS Grids"](https://cloudfour.com/thinks/faux-containers-in-css-grids/), Tyler Sticka introduces a technique for creating visual containers that allow certain elements to break out of their bounds, enhancing design flexibility. By decoupling the containing shape from its content using CSS Grid and pseudo-elements, developers can achieve complex layouts without resorting to negative margins or absolute positioning. This approach simplifies the implementation of designs where images or buttons extend beyond their containers, providing a cleaner and more maintainable codebase.

## Food for though

* In his recent article, ["Part 1: The Shitball"](https://bradfrost.com/blog/post/part-1-the-shitball/), Brad Frost examines how malignant narcissists exploit the modern media landscape to hijack public attention. He introduces the concept of "The Shitball" to describe these individuals and their enablers, highlighting the detrimental impact they have on society. Frost emphasizes the importance of redirecting our focus toward positive and constructive endeavors to counteract this pervasive influence. 

## Fun and stuff

* For those seeking to identify specific Unicode characters without knowing their names, [Shapecatcher](https://shapecatcher.com/) offers an intuitive solution. By drawing the desired character in the provided box, the tool matches your sketch to the most similar Unicode symbols in its database. While it currently supports 11,817 glyphs, it's important to note that Japanese, Korean, and Chinese characters are not yet included. Shapecatcher relies on HTML5 features, so using a modern browser is recommended for optimal performance.
* For developers seeking a touch of whimsy in their coding environment, the [VSCode Pets extension](https://github.com/tonybaloney/vscode-pets) introduces playful, animated companions directly into Visual Studio Code. Created by Anthony Shaw, this open-source project allows users to interact with a variety of pixelated pets, including cats, dogs, and even Clippy, enhancing the coding experience with a bit of lighthearted fun. The extension is actively maintained, with recent updates adding new pets and themes, ensuring a continually engaging experience for users.
* For 3D printing enthusiasts looking to merge functionality with design, [qrcode2stl](https://printer.tools/qrcode2stl/) offers a user-friendly tool to generate customizable, 3D-printable QR codes. Users can input various data types, such as text, email, or Wi-Fi credentials, and tailor the appearance of the resulting 3D model to their preferences. Once customized, the tool allows for direct download of the STL files, ready for printing. This resource is part of [Printer.tools](https://printer.tools/), a curated collection of 3D printing tools and resources aimed at enhancing the maker experience.
* For those seeking inspiration in data visualization, the [Data Viz Project](https://datavizproject.com/) offers a comprehensive collection of chart types and diagrams. Curated by the design agency Ferdio, this resource categorizes visualizations by function, shape, and input, making it easier to find the most effective way to present your data. Each visualization includes a description and example, serving as a valuable reference for both novice and experienced designers.
* For those intrigued by the U.S. government's documentation of Unidentified Aerial Phenomena (UAP), [Beautiful Public Data](https://www.beautifulpublicdata.com/us-government-ufo-uap-footage/) offers a curated collection of declassified videos and reports. This compilation includes historical footage, such as 1950s newsreels reporting on suspected alien spacecraft, as well as more recent releases by the Pentagon. Notably, in April 2020, the Department of Defense officially released three videos captured by U.S. Navy pilots, commonly referred to as "FLIR," "GIMBAL," and "GOFAST," which depict encounters with unexplained aerial objects. These releases have contributed to ongoing discussions and investigations into UAPs, including congressional hearings and the establishment of the All-domain Anomaly Resolution Office (AARO) in 2022 to standardize the collection and reporting of such phenomena.
* In celebration of YouTube's 20th anniversary, the platform has introduced a refreshed brand palette, featuring a softer red hue complemented by a dynamic red-to-magenta gradient. This subtle yet meaningful shift aims to modernize YouTube's iconic identity while addressing technical issues associated with the previous pure red, such as screen burn-in and color inconsistencies. The design team carefully selected magenta for its connotations of imagination and evolution, enhancing the platform's visual appeal and aligning with its mission to be welcoming and dynamic. This updated color scheme is thoughtfully applied to key UI elements, including the logo, progress bar, and action buttons like "Like" and "Subscribe," ensuring a cohesive and engaging user experience.

## Watch

* In their latest release, ["Nebulous Nights (An Ambient Excursion into Profound Mysteries)"](https://www.youtube.com/watch?v=t6yxvAtKASE), Röyksopp presents an ethereal auditory journey that delves deep into ambient soundscapes. This track, accompanied by an official visualizer, offers listeners a serene and immersive experience, showcasing the duo's signature blend of electronic and atmospheric elements. Released last month under the Dog Triumph label, "Nebulous Nights" continues Röyksopp's exploration of profound musical themes.

<lite-youtube videoid="t6yxvAtKASE" />
