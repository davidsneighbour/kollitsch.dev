---
layout: "@layouts/ContentPage.astro"
title: Privacy Policy
description: This is the privacy policy for kollitsch.dev, outlining data collection, usage, and your rights.
cover: 
  src: privacy.jpg
date: 2025-07-23T05:47:42.802Z
---

# Privacy Policy

* [1. Definitions](#1-definitions)
* [2. General rules](#2-general-rules)
* [3. Tool-specific notes](#3-tool-specific-notes)
  * [3.1. YouTube](#31-youtube)
  * [3.2. Contact form](#32-contact-form)
  * [3.3. Matomo analytics](#33-matomo-analytics)
  * [3.4. Giscus comments](#34-giscus-comments)
* [4. Local storage use](#4-local-storage-use)
* [5. Legal position (my informal opinion)](#5-legal-position-my-informal-opinion)
* [6. Final notes](#6-final-notes)

Last updated: July 23, 2025

## 1. Definitions

* **"I"** refers to the owner and operator of this website, a solo developer and content creator (Patrick Kollitsch / David's Neighbour).  
* **"You"** means any person visiting and interacting with this website.  
* **"Data"** means any information sent to, stored by, or processed via your browser when visiting this site.

## 2. General rules

* I do **not** actively collect personal data. You might provide some data voluntarily in comments and the contact form, those are subject to the tool-specific notes below.
* No cookies are used - *only localStorage* is used to remember preferences (like themes).
* Privacy-respecting integrations (like **YouTube embeds with enhanced privacy mode**) are used where possible.
* Minimal visitor insights are collected via **Matomo Analytics**:
  * Anonymous and session-based.
  * No IP addresses stored.
  * Only country-level location information is collected.
  * Data is used to optimize the website and find broken links or usage patterns.

## 3. Tool-specific notes

### 3.1. YouTube

* Embedded videos use *privacy-enhanced mode*, which limits tracking unless you interact with the video. I am also using a component that loads the video only when you click it. There is no data transfer to YouTube until you play the video.
* You can read [YouTube's privacy policy](https://www.youtube.com/howyoutubeworks/privacy/) for more details.

### 3.2. Contact form

* If you use the contact form, the data you provide (email, name, message) is *only used to respond* to your request. It's not shared or used for any other purpose.
* Spam protection is in place, currently via Netlify Forms.
* *There is no predefined time limit* for storing submitted messages. Messages may be kept indefinitely for communication or reference purposes.

### 3.3. Matomo analytics

* Self-hosted and privacy-focused.
* No cookies are used.
* Session tracking only (expires when you close the browser tab or window).
* You may opt out at any time via the toggle below.
* I might experiment with event tracking (I want to know if you're pushing my buttons). This will not be used for profiling or data collection beyond basic usage patterns.

<div id="matomo-opt-out" class="m-4 p-4 border border-gray-500/50"></div>
<script src="https://analytics.dnbhub.xyz/index.php?module=CoreAdminHome&action=optOutJS&divId=matomo-opt-out&language=auto&fontSize=1rem&fontFamily=exo2&showIntro=1"></script>

### 3.4. Giscus comments

* Uses GitHub Discussions.
* You must sign in with GitHub to comment.
* Comments are public and tied to your GitHub profile.
* You can delete your comments at any time via GitHub.
* You can read [GitHub's privacy policy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) for more details.

## 4. Local storage use

* This site uses `localStorage` to save non-personal settings like theme preferences.
* This data is stored only in your browser and is *never shared or tracked*.

## 5. Legal position (my informal opinion)

* This site follows principles of *data minimization*, *purpose limitation*, and *transparency*.
* No ads, no fingerprinting, no invasive tracking.
* This is a *best-effort, plain-language privacy policy*, not a legal document.
* If more complex features (user accounts, payments, sensitive data) are added, I update this policy.

## 6. Final notes

* If cookies ever show up unintentionally (for example due to a third-party embed), they are removed or amended as soon as discovered.
* You're encouraged to review your browser's privacy settings if concerned about external scripts or embeds.
* The fact that you are reading until this line is astonishing and I appreciate your interest in privacy!
