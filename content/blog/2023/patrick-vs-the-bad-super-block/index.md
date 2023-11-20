---
title: Patrick vs. the Bad Super Block
description: ""
draft: true
date: 2023-11-20T20:51:31+07:00
publishDate: 2023-11-20T20:51:31+07:00
lastmod: 2023-11-20T20:56:00+07:00
resources:
- title: Photo by [Patrick Lindenberg](https://unsplash.com/@heapdump) via [Unsplash](https://unsplash.com/)
  name: image name if other than src
  src: header.jpg
tags:
- patrick versus
- hardware
- troubleshooting
- 100DaysToOffload
type: blog
unsplash:
  imageid: 1iVKwElWrPA
---

sudo fsck.ext4 -b 32768 /dev/mapper/luks-ddc11413-1fc3-4a59-8062-77416bf64073
dumpe2fs -h /dev/mapper/luks-ddc11413-1fc3-4a59-8062-77416bf64073
LANG=C sudo dumpe2fs /dev/mapper/luks-ddc11413-1fc3-4a59-8062-77416bf64073 | grep -i superblock
