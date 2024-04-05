---
title: Hook and Filters
summary: ""
weight: 100
---

> [!WARNING]
> This documentation is under (re)construction. Check back later for changes and feel free to open
> an issue if you have questions or suggestions.

- [General notes](#general-notes)

---

Hooks are listed in their order of appearance.

| Hook  | File  | Runs | Depends on | Description  |
| --- | --- | --- | --- | --- |
| init  | partials/init.html  | 1  |  | before anything else runs (before the pagination object is created) |
| init-end  | partials/init.html  | 1  |  | after the pagination object is created and in scratch  |
| setup  | _default/baseof.html | 1  |  | at the beginning of the main layout  |
| body-start  | _default/baseof.html | 1  |  |  |
| body-pre-main | _default/baseof.html | 1  |  |  |
| body-main-start | _default/baseof.html | 1  |  |  |
| body-main-end | _default/baseof.html | 1  |  |  |
| body-post-main | _default/baseof.html | 1  |  |  |
| body-end-pre-script | _default/baseof.html | 1  |  |  |
| body-end  | _default/baseof.html | 1  |  |  |
| teardown  | _default/baseof.html | 1  |  |  |
