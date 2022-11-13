---
title: Feeds
linktitle: hugo-feeds
summary: ""

date: 2022-07-27T18:34:57+07:00
publishDate: 2022-07-27T18:34:57+07:00
lastmod: 2022-08-03T21:47:05+07:00

resources:
  - src: header-card.png

categories:
  - components

tags:
  - gohugo
  - component
  - design

component:
  slug: hugo-feeds
  host: github.com
  user: davidsneighbour
  status: release
  list: true
---

This is a GoHugo theme component that implements various configurable feed formats. Currently implemented formats are RSS, Atom and JSONfeed.

Find out more about the [RSS](https://cyber.harvard.edu/rss/rss.html), [Atom](https://datatracker.ietf.org/doc/html/rfc4287) and [JSON feed](https://www.jsonfeed.org/version/1.1/) formats

{{< component-box >}}

## ToDo

- [x] proper implementation of the formats
  - [x] RSS
  - [x] Atom
  - [x] JSON feed
- [ ] add hooks (for all feed formats or individual feed formats)
- [ ] configurable section-, taxonomy- and term-feeds
- [ ] partial to output list of available feeds on your website
- [ ] proper testing, validation and dev-site


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

Limits are formatted via integers. 0 disables, everything at 1 and over selects the last x items and -1 will list all items.

### TODO: configuration

### Posts to show in feeds

Set `dnb.feeds.items` to `posts` to show only items that are listed in `params.mainSections` in your feeds. All other values will result in _all_ pages being included.

### Discreet Drafts

Have a read through [@zbetz](https://github.com/zwbetz-gh)'s great article [Discreet Drafts in Hugo](https://zwbetz.com/discreet-drafts-in-hugo/) and rest assured that without configuration this module will hide all drafts (posts with `draft` in their frontmatter set to `true`) from it's feeds. If you wish to force drafts being shown in the feeds then set `dnb.feeds.drafts` to `true`.

## Hooks

`hugo-feeds` implements template hooks via [`hugo-hooks`](https://github.com/davidsneighbour/hugo-hooks) and makes the following hooks available:

| Hook | Description |
| --- | :--- |
| feeds-init | Hooks in after the opening tag. Do not open this to output anything. Just for initialising any of your plugins. |
| feeds-start | Hooks in after the initial first tags that define your feeds purpose and before items of the feed are printed. |
| feeds-end | Hooks in at the end of the feed after the items are printed. |

All hooks exist in a second form containing the feed type and will run then only in that format. For example `feeds-atom-init` runs only at the init stage of the atom feed, `feeds-rss-init` in rss and `feed-jsonfeed-init` in JSONfeeds.
