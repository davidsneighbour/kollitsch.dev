---
title: "Notes from the Laboratory: January 2023"
linkTitle: Laboratory 2023-01
description: Another monthly report from the depths of the laboratory of kollitsch.dev -
  January 2023

date: 2023-02-01T18:30:58+07:00
publishDate: 2023-02-01T18:30:58+07:00
lastmod: 2023-02-01T19:46:59+07:00

resources:
  - src: header.jpg
    title: Photo by [Todd Quackenbush](https://unsplash.com/@toddquackenbush) via
      [Unsplash](https://unsplash.com/)
categories:
  - notes-from-the-laboratory
tags:
  - laboratory
  - notes
  - self-improvement
  - 100DaysToOffload
---

I am trying this new "thing" of "reporting" what I was up to in a certain time period this year, and monthly reviews just sound like something normal people would do. So bear with me while I am typing up this report.

- **PHP and Error Tracking:** I recently had reason to look into error tracking services like Sentry, Rollbar, Bugsnag, etc. I have used Sentry in the past, but due to a mishap used up all the quota our contract had available. Mishap, hehe. A loop. The experience showed me, that neither Sentry nor any of the other services I tried subsequently until our quota replenishes has any kind of limitation in how many errors to accept. One of the tracked errors was detected 22k times within one night. Weird. All services have locks for high usage, but somehow it didn't trigger. Another annoyance is, that some of the smaller providers are not too much interested in keeping their libraries or SDKs up to date with newer PHP versions. As in `@` for error suppression. Not too nice a look for a error tracking library. THat method was bad style in PHP 5.4 and we are at 8.1 now. Enough ranting.
- **Learning and new stuff:** I registered for [The joy of React](https://www.joyofreact.com/) to refresh my knowledge and maybe learn something new. The course is very new, but everything that has Josh Comeau's name on it is trustworthy enough. Also, they had an extra discount for learners in Thailand ;) Maybe in the end we won't need PHP for the website that is making my hair whiter by the day.
- **All the other stuff:** As always there was a lot of things that I just ignored or let slide. But that's life. I guess.
