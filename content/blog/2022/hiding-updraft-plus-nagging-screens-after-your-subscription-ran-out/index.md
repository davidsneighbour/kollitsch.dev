---
title: "Hiding UpdraftPlus nagging screens after your subscription ran out"
date: 2022-03-10T22:18:32+07:00
resources:
  - title: "Photo by [Nagara Oyodo](https://unsplash.com/@nagaranbasaran) via [Unsplash](https://unsplash.com/)"
    name: "image name if other than src"
    src: "nagara-oyodo-cBPSOscB5Z0-unsplash.jpg"
categories:
  - wordpress
tags:
  - wordpress
  - updraftplus
  - plugin
  - nagging
  - 100DaysToOffload
---

Nagscreens. You know them. Very annoying. Long story short: I recently stopped updating my subscription to a paid WordPress plugin and it started using nag screens to guilt me into renewing the subscription again. In this specific case we have the [UpdraftPlus](https://updraftplus.com/) plugin that I really suggest everyone to use, but it did not really add new features or did anything else to make me feel like having a yearly subscription for the simple backup plugin would be something I want to do.

I did not renew it and disabled the nag screens the following ways:

**Hide license expiration notifications** in the WordPress dashboard - because, well, you know they are expired:

Add the following custom CSS function to your `functions.php`.

```php
// dnb 2020-09-18
// hide updraft plus notices about expired licenses
function dnb_remote_updraft_license_notifications() {
  echo '<style>
.updraftupdatesnotice-updatesexpired,
.updraftupdatesnotice-updatesexpiringsoon {
display: none !important;
}
</style>';
}
add_action('admin_head', 'dnb_remote_updraft_license_notifications');
```

This solution is only half-baked, because it does not fully disable these notifications. It just hides them. But it works.

**Hide plugin update notifications** that would result in failed update attempts (because you have no license):

Add the following to your `functions.php`

```php
// dnb 2020-09-18
// hide update notifications for non-updatable plugins
function dnb_remove_updraft_update_notifications($value){
    if (isset($value) && is_object($value)){
        unset($value->response['updraftplus/updraftplus.php']);
    }
    return $value;
}
add_filter('site_transient_update_plugins', 'dnb_remove_updraft_update_notifications');
```

This will hide updates for the plugin.

The one pain-point I need to figure out is how to check if a legit update is available, like [the one recently when a security issue was discovered](https://updraftplus.com/updraftplus-security-release-1-22-3-2-22-3/). In those cases most of the yearly-subscription-based plugins will offer an update to users with expired subscriptions too. This specific update will be hidden by the last addition to your `functions.php`. I keep an eye on these issues and comment the `add_filter` method in the last line out to receive a working update notification, then update, then uncomment the line again.
