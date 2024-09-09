---
title: Feeds
summary: ""
date: 2022-07-27T18:34:57+07:00
publishDate: 2022-07-27T18:34:57+07:00
lastmod: 2024-02-01T19:42:24+07:00
resources:
- src: header-card.png
tags:
- gohugo
- component
- design
aliases:
- /components/hugo-feeds/
---

This is a GoHugo module that implements three configurable feed formats: RSS, Atom, and JSONfeed.

Find out more about the [RSS](https://cyber.harvard.edu/rss/rss.html), [Atom](https://datatracker.ietf.org/doc/html/rfc4287) and [JSON feed](https://www.jsonfeed.org/version/1.1/) formats

## Configuration

### Limits

`hugo-feeds` uses a cautious approach at configuring the output of the feeds. Where GoHugo's internal RSS template prints _all_ available pages without a configured limit, `hugo-feeds` will load only the 10 latest pages/posts, but you can configure at your pleasure.

If either `rssLimit` or `services.rss.limit` is defined and NOT overridden by any other configuration then these values will be chosen for RSS. Limits for specific feed formats can be configured explicitly.

```toml
[dnb]
[dnb.feeds]
limit = 10

[dnb.feeds.atom]
limit = 10

[dnb.feeds.rss]
limit = 10

[dnb.feeds.json]
limit = 10
```

Limits are formatted via integers. `0` disables, everything at `1` and over selects the last x items and `-1` lists all items.

### Posts to show in feeds

Set `dnb.feeds.items` to `posts` to show items that are listed in `params.mainSections` in your feeds. All other values result in _all_ pages being included.

### Drafts

Without configuration this module hides all drafts (posts with `draft` in their frontmatter set to `true`) from it's feeds. If you wish to force drafts being included in the feeds then set `dnb.feeds.drafts` to `true`.

## Hooks

`hugo-feeds` implements template [hooks](https://github.com/davidsneighbour/hugo-modules/modules/hooks) and makes the following hooks available:

| Hook           | Description                                                                                                       |
| -------------- | :---------------------------------------------------------------------------------------------------------------- |
| **feeds-init** | Hooks in after the opening tag. Do not open this to output anything. Use it for initialising any of your plugins. |
| **feed-start** | Hooks in after the initial first tags that define your feeds purpose and before items of the feed are printed.    |
| **feeds-end**  | Hooks in at the end of the feed after the items are printed.                                                      |

All hooks exist in a second form containing the feed type and will run then only in that format. For example `feeds-atom-init` runs only at the init stage of the atom feed, `feeds-rss-init` in rss and `feed-json-init` in JSONfeeds.
