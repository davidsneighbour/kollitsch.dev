+++
title = "Ubuntu, EFI and Acer"
description = "A quick fix for the \"No Bootable Device found\" error on Acer notebooks after installing Ubuntu."
date = 2022-03-02T21:22:28+07:00

[[resources]]
title = "Photo by [Artiom Vallat](https://unsplash.com/@virussinside) via [Unsplash](https://unsplash.com)"
src = "artiom-vallat-mx9axbKqKW8-unsplash.jpg"

tags = [
  "howto","ubuntu", "acer", "UEFI", "EFI"
]
+++

A while ago I found myself in front of my little baby-notebooks screen telling me in no uncertain terms, that "No Bootable Device (was) found". Hmm. Somehow I remembered that. I also remembered that it's just a little renaming routine that would solve this annoying issue.

The problem in short: Most Acer notebooks expect the [UEFI](https://en.wikipedia.org/wiki/EFI_system_partition)-entry named `Linux` instead of any other name and Ubuntu names it's entry `ubuntu` on installation. Why the confusion? Who knows. Probably just self-preservation on Acer's side, because who knows what people might do to the precious little notebook while not using a fully licensed and price increasing Windows.

The following steps should solve this issue:

- Install Ubuntu (or any other OS you like).
- After the installation reboot into the Live-CD or USB-stick that you installed the system from.
- Mount your EFI partition (let's assume it's mounted at /media/EFI).
- Go into /media/EFI/EFI and `ls -al` the contents of the directory.
- You should see a directory named `ubuntu`. Either copy it to the folder `Linux` or rename it to `Linux`, depending on your adventurism level.
- Reboot and Ubuntu should boot up.

I wonder why this is not something that Ubuntu could somehow do itself on a new installation.

[A more verbose description of the problem can be found here](http://www.slabbe.org/blogue/2018/05/installing-ubuntu-18.04-on-aspire-es-11-es1-132-c6lg/).
