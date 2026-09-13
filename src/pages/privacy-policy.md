---
layout: "@layouts/ContentPage.astro"
title: Privacy Policy
description: This is the privacy policy for kollitsch.dev, outlining data collection, usage, and your rights.
cover: 
  src: privacy.jpg
date: 2025-07-23T05:47:42.802Z
---

* [1. Definitions](#1-definitions)
* [2. General rules](#2-general-rules)
* [3. Tool-specific notes](#3-tool-specific-notes)
  * [3.1. YouTube](#31-youtube)
  * [3.2. Vimeo](#32-vimeo)
  * [3.2. Contact form](#32-contact-form)
  * [3.3. Matomo analytics](#33-matomo-analytics)
  * [3.4. Giscus comments](#34-giscus-comments)
  * [3.5. Spotify embeds](#35-spotify-embeds)
* [4. Local storage use](#4-local-storage-use)
* [5. Legal position (my informal opinion)](#5-legal-position-my-informal-opinion)
* [6. Final notes](#6-final-notes)

Last updated: July 28, 2026

## 1. Definitions

* **"I"** refers to the owner and operator of this website, a solo developer and content creator (Patrick Kollitsch / David's Neighbour).  
* **"You"** means any person visiting and interacting with this website.  
* **"Data"** means any information sent to, stored by, or processed via your browser when visiting this site.

## 2. General rules

* I do **not** actively collect personal data. You might provide some data voluntarily in comments and the contact form; those are subject to the tool-specific notes below.
* I do not set site cookies intentionally. `localStorage` is used for the non-personal preferences listed below.
* Privacy-respecting integrations (like **YouTube embeds with enhanced privacy mode**) are used where possible.
* Minimal visitor insights are collected via **Matomo Analytics**:
  * Anonymous and session-based.
  * No IP addresses stored.
  * Only country-level location information is collected.
  * Data is used to optimise the website, understand search usage, and find broken links or usage patterns.

## 3. Tool-specific notes

### 3.1. YouTube

* Embedded videos use *privacy-enhanced mode*, which limits tracking unless you interact with the video. I am also using a component that loads the video only when you click it. There is no data transfer to YouTube until you play the video.
* You can read [YouTube's privacy policy](https://www.youtube.com/howyoutubeworks/privacy/) for more details.

### 3.2. Vimeo

* Embedded Vimeo videos use a lightweight component that loads poster metadata first and creates the Vimeo player only when you interact with the video.
* The Vimeo player URL sets Vimeo's `dnt=1` parameter where available.
* You can read [Vimeo's privacy policy](https://vimeo.com/privacy) for more details.

### 3.2. Contact form

* If you use the contact form, the data you provide (email, name, message) is *only used to respond* to your request. It's not shared or used for any other purpose.
* Contact form submissions are sent to a Netlify Function at `/.netlify/functions/send-email`, which forwards the message via Resend using server-side credentials.
* Spam protection is handled by validation and a hidden honeypot field. The form markup also includes a Netlify reCAPTCHA placeholder, but the current delivery path is the Netlify Function plus Resend, not Netlify Forms storage.
* *There is no predefined time limit* for storing submitted messages. Messages may be kept indefinitely for communication or reference purposes.

### 3.3. Matomo analytics

* Self-hosted and privacy-focused.
* The site does not intentionally use Matomo cookies; Matomo is configured for session-style tracking.
* Session tracking only (expires when you close the browser tab or window).
* You may opt out at any time via the toggle below.
* Search queries on the site search page may be tracked as site-search events, including result counts.
* 404 pages may send an event containing the missing path and referrer, to help find broken links.
* I might experiment with event tracking (I want to know if you're pushing my buttons). This will not be used for profiling or data collection beyond basic usage patterns.

<!-- markdownlint-disable MD033 -->
<div id="matomo-opt-out" class="m-4 p-4 border border-gray-500/50"></div>
<script src="https://analytics.dnbhub.xyz/index.php?module=CoreAdminHome&action=optOutJS&divId=matomo-opt-out&language=auto&fontSize=1rem&fontFamily=exo2&showIntro=1"></script>
<!-- markdownlint-enable MD033 -->

### 3.4. Giscus comments

* Uses GitHub Discussions.
* You must sign in with GitHub to comment.
* Comments are public and tied to your GitHub profile.
* You can delete your comments at any time via GitHub.
* You can read [GitHub's privacy policy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) for more details.

### 3.5. Spotify embeds

* Some older posts may include Spotify embeds loaded from `open.spotify.com`.
* Spotify may receive technical request data when an embedded player loads or when you interact with it.
* You can read [Spotify's privacy policy](https://www.spotify.com/legal/privacy-policy/) for more details.

## 4. Local storage use

* `kdev-theme` stores the selected colour theme (`light`, `dark`, or `auto`).
* `mastodon_instance_url` stores the Mastodon instance you choose when using the Mastodon share link.
* In development mode only, the breakpoint/dev toolbar may store `devBarHidden`, `devBarPosition`, and `devBarOpacity`; `hideDevBar` is an older migrated key.
* This data is stored only in your browser and is *not sent to my server* by these preference features.

## 5. Legal position (my informal opinion)

* This site follows principles of *data minimization*, *purpose limitation*, and *transparency*.
* No ads, no fingerprinting, no invasive tracking.
* This is a *best-effort, plain-language privacy policy*, not a legal document.
* If more complex features (user accounts, payments, sensitive data) are added, I update this policy.

## 6. Final notes

* If cookies ever show up unintentionally (for example due to a third-party embed), they are removed or amended as soon as discovered.
* You're encouraged to review your browser's privacy settings if concerned about external scripts or embeds.
* The fact that you are reading until this line is astonishing and I appreciate your interest in privacy!
