---
title: Fixing Double Ci Runs When Pushing to Gitlab Branches
description: ""

date: 2022-11-09T20:01:35+07:00
publishDate: 2022-11-09T20:01:35+07:00
lastmod: 2022-11-09T21:20:15+07:00

resources:
  - title: Photo by [Mila Tovar](https://unsplash.com/@milatovar) via
      [Unsplash](https://unsplash.com/)
    src: header.jpg

categories:
  - category1

tags:
  - gitlab
  - ci
  - 100DaysToOffload

type: blog
---

A while back I realized, that every time I pushed some commits to a branch on GitLab _two_ separate CI pipelines started. That soon took up lots of free CI-minutes and became a problem. After some research I found out that this is, while it's to be expected due to the design of the system, avoidable with a specific configuration addition.

The reason for the double run is, that CI pipelines run for several events in a repository, the two here are push events to a branch and push events to an existing merge request.

The solution sounds as logical as you would expect: _just™_ tell the pipeline the following:

- if this CI run event is for a _branch push_ and no merge request exists, then run it
- if this CI run event is for a _branch push_ and a merge request exists, then don't run it
- if this CI run event is for a _merge request push_ then run it

or in GitLab's CI YAML format:

```yaml {noconfig=true}
WorkflowName:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH && $CI_OPEN_MERGE_REQUESTS
      when: never
    - if: $CI_COMMIT_BRANCH
```

or with an existing rule:

```yaml {noconfig=true}
WorkflowName:
  rules:
    - if: $CI_COMMIT_BRANCH && $CI_OPEN_MERGE_REQUESTS && $CI_PIPELINE_SOURCE == "push"
      when: never
    - if: $YOUR_OWN_RULES               # add your own rule here
```

While it looks complicated it's an addition to my existing workflow that is easy to handle. And it saves CI minutes.
