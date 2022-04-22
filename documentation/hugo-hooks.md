# Hooks

Hooks are listed in their order

<!-- prettier-ignore -->
| Hook | File | Multi | Depends on | Description |
| ---- | ---- | ----- | ---------- | ----------- |
| init | partials/init.html | :x: | | before anything else is executed (before pagination object is created) |
| init-end | partials/init.html | :x: |  | after the pagination object is created and in scratch |
| setup | _default/baseof.html | :x: |  | at the beginning of the main layout |
| body-start | _default/baseof.html | :x: |  |  |
| body-end-pre-script | _default/baseof.html | :x: |  |  |
| body-end | _default/baseof.html | :x: |  |  |
| teardown | _default/baseof.html | :x: |  |  |
