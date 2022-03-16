---
title: 'Notes from the Laboratory: MONTH {{ now.Format "2006" }}'
linkTitle: 'Laboratory {{ now.Format "2006-##" }}'
description: ""
date: {{ .Date }}
resources:
  - src: header.jpg
    title: Photo by [Todd Quackenbush](https://unsplash.com/@toddquackenbush) via [Unsplash](https://unsplash.com/)
categories:
  - notes-from-the-laboratory
tags:
  - laboratory
  - notes
  - self-improvement
  - 100DaysToOffload
---

I am trying this new "thing" of "reporting" what I was up to in a certain time period this year, and monthly reviews just sound like something normal people would do. So bear with me while I am typing up this report.

- **Focus:** The fact, that I found a bug in my [@dnb-org/dnb-hugo-pwa module](https://github.com/dnb-org/dnb-hugo-pwa) while doing this writeup and fixing it subsequently before finishing this writeup is a sign that focusing on important things is still an issue.
- **Fixing things:** The fact, that I found a bug in my [@dnb-org/dnb-hugo-pwa module](https://github.com/dnb-org/dnb-hugo-pwa) while doing this writeup and fixing it subsequently before finishing this writeup is a sign that fixing things is still what I can do on a moments notice.
- **Cleanup:** I started cleaning up all my [@dnb-org](https://github.com/dnb-org) modules and projects. This is still work in progress, but I try to be done by the end of February. The plan is to create a maintainable environment for everything without making me looking at how it is set up each time. Not sure how "real" developers do it. Any time I am done with one thing I have an idea to improve it and get lost in that loop.
- **kollitsch.de:** I added dark/light theming to this website and I wonder, how I never came to think about how to do it this easily. It's just [a bunch of CSS variables](https://github.com/davidsneighbour/kollitsch.de/blob/18401a326350ef806acfdb2d18848a4719bb0db1/assets/scss/style.scss#L26) and [a couple of lines of Alpine.js](https://github.com/davidsneighbour/kollitsch.de/blob/18401a326350ef806acfdb2d18848a4719bb0db1/assets/js/script.ts#L11) that make the magic work. The last step on this journey was [this article on web.dev by Adam Argyle](https://web.dev/building-a-color-scheme/). This sound advise combined with a sudden spark of an idea on how to implement it with Bootstrap 5 lead to the current theme switcher. It's still work in progress (I just yesterday made [code samples love their respective theme](https://github.com/davidsneighbour/kollitsch.de/commit/a7f6051c9fc428c97feef611031a0ae3b7938d9f)). The "dim" theme still needs some work. But I am quite happy with the current display.

  I am also not done with the post headings yet. They look weird right now, I know. Live with it for a while.
- **Customers:** I am aware that more and more customers just float away. A huge problem is that Covid won't just disappear and the only industry on this island that matters, tourism, is still basically dead. Tour-organisations and promotional campaigns won't be able to hide, that the re-invention and recovery of tourism on Ko Samui is a whole different topic and a massive task in 2022 and beyond that year.
- **Cooking:** I am experimenting with "Fried rice with vegetables" and several kinds of Tofu (two different meals). Not sure yet if one or the other will make it into my standard repertoire.
- **Pokki:** My baby (a shihtzu dog, don't worry) is having more and more age related issues. Just yesterday his hind-legs gave up and he was crouching over the grounds for a day or two. He knows that his time is running out and I try to make it as amenable as possible for him. If I get up with the birds in the morning, today at 4am, we don't even need to spend the rest of the morning cleaning the house 🐶 The whole "lets give him all the food he craves at all times" strategy spectacularly backfired. Lots of cleaning. I won't be listening to anyone telling me to give him more food anymore.
- **Language Learning:** I didn't do much in this resort... well, I started looking into [Golang](https://pkg.go.dev/)... does that count? I am programming a little CLI app that ties into [Hugo](https://gohugo.io) to create new content and objects of content.
- **All the other stuff:** As always there was a lot of things that I just ignored or let slide. That's life. I guess.
