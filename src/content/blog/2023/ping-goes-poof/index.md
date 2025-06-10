---
title: "Ping Goes Poof"
linkTitle: "Ping Goes Poof"
description: ""
summary: ""
date: "2023-06-28T20:33:58+07:00"
resources:
  - title: "Photo by [Pascal Meier](https://unsplash.com/@zhpix) via [Unsplash](https://unsplash.com/)"
    src: "header.jpg"
tags:
  - "google"
  - "seo"
  - "hugo-sitemap"
  - "100DaysToOffload"
unsplash:
  imageid: "abcdefghijk"
fmContentType: "blog"
cover: "./header.jpg"
---

Google on Monday announced that [they will change several things regarding to sitemaps and pinging the search engine about updates of the sitemap](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping).

The main points are:

Pings are not accepted anymore starting in 6 months, due to them being unreliable. Instead Google will crawl the sitemap.xml file on a regular basis. The sitemap.xml file should be updated whenever a page is updated. The `lastmod` tag in the sitemap.xml file should be updated whenever the page content is updated - NOT  when elements on the page are updated. This seems to be the death punch to [indexnow.org](https://www.indexnow.org/index) too, as it's main purpose was to ping search engines about updates.

On the other hand, Google continues to ignore the changefreq and priority elements in sitemaps. These elements have no impact on Google's crawling and indexing processes. Website owners should be aware that including changefreq and priority in their sitemaps will not influence the search engine's behavior.

With these latest updates, Google is streamlining the use of sitemaps and at the same time cutting off some spammers. It also becomes clear that the sitemap as a tool to discover new content should not be used to force Google to crawl a site:

> …it needs to consistently match reality: if your page changed 7 years ago, but you're telling us in the lastmod element that it changed yesterday, eventually we're not going to believe you anymore when it comes to the last modified date of your pages.

My [sitemap module for GoHugo](/components/hugo-sitemap/) by the way is already only displaying updates when the content of a page is updated. It does not change the date on changes of unrelated page elements. It also does not include the changefreq and priority elements in the sitemap.xml file in it's [latest release](https://github.com/davidsneighbour/hugo-blockify/releases/tag/v0.0.84).
