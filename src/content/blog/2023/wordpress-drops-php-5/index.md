---
title: WordPress Drops PHP 5
description: >-
  WordPress announces end of support for PHP 5 in upcoming release. Learn about
  the impact and challenges of updating PHP versions. Read more here.
date: '2023-07-19T21:01:33+07:00'
resources:
  - title: >-
      Photo by [Fikret tozak](https://unsplash.com/@tozakfikret) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg
tags:
  - wordpress
  - php
  - 100DaysToOffload
type: blog
unsplash:
  imageid: Zk--Ydz2IAs
fmContentType: blog
---

The WordPress blog [announced on July 6th](https://make.wordpress.org/core/2023/07/05/dropping-support-for-php-5/) that starting from the next release (WP 6.3 on August 8th, 2023), the CMS will no longer support PHP 5.

Yes, that's correct.

PHP 5.6, the final version of PHP 5, reached the end of its lifecycle on December 31st, 2018, but it was still supported by the most widely used CMS until recently.

According to the [PHP usage stats as of July 2023](https://wordpress.org/about/stats/) from WordPress:

*   PHP 8.2: 2.11%
*   PHP 8.1: 9.37%
*   PHP 8.0: 14.05%
*   PHP 7.4: 51.13%
*   PHP 7.3: 7.92%
*   PHP 7.2: 6.29%
*   PHP 7.1: 1.38%
*   PHP 7.0: 2.05%
*   PHP 5.6: 3.93%

Updating or maintaining up-to-date WordPress installations remains a major challenge for users even after 20 years. A staggering 75% of all installations are running on outdated PHP versions.

However, it's worth noting that support for PHP 8 in WordPress is still in beta:

> Support for PHP 8.0, 8.1, and 8.2 in WordPress core is very good, and [a proposal for the criteria for removing the "beta" support label for each new PHP version has been published](https://make.wordpress.org/core/2023/06/20/proposal-criteria-for-removing-beta-support-from-each-php-8-version/).

PHP 8.0 reached its end of life on November 26th, 2022, and will no longer receive security updates after November 26th, 2023. PHP 8.1 is set to reach its end of life on November 25th, 2023, and will no longer receive security updates after November 25th, 2024. It's important to note that WordPress is not fully supporting these versions yet (according to [PHP.net](https://www.php.net/supported-versions.php)).

However, this situation presents a double-edged sword. My preferred hosting provider (without mentioning any names) began removing all PHP 7 support from their hosting packages over a year ago. They now only offer PHP 8+ support. If you still require "outdated PHP requirements," you have the option to pay extra for that service. Interestingly, this hosting provider is a significant contributor to WordPress.

As a result, my hoster now supports approximately 25.53% of all WordPress installations (excluding paid addon packages), while WordPress has only phased out 3.93% of installations. Make of that what you will. WordPress sometimes feels outdated these days, and over the past five years, I have been gradually transitioning all my WordPress customers to a site that is statically generated. I anticipate that I will "deprecate" WordPress entirely in around five years from now ;)
