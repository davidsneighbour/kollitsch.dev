# URL-switch (quickest)

Add query params to your page URL and the form will render that state on load:

```plaintext
?formDev=1&scenario=email-missing&preview=1
```

Supported `scenario`s (extend as needed):

* `success`
* `email-missing`
* `invalid-email`
* `message-missing`
* `server-500`
* `network`

# Data-attributes (page-by-page defaults)

Add attributes to your `<form>`:

```html
<form
  name="contact"
  method="POST"
  action="/.netlify/functions/send-email"
  data-mock="1"
  data-scenario="email-missing"
  data-preview="1"
  novalidate
>
```

# Inline Dev Toolbar (optional)

Add `formDev=1` to the URL to get a tiny toolbar with buttons to flip states visually. Nothing is submitted.

# How to use it

* **Preview on load via URL**:
  `https://yoursite/contact/?formDev=1&scenario=invalid-email&preview=1`

* **Interactive toolbar**:
  `?formDev=1&toolbar=1` (then click buttons; nothing is sent)

* **Per-page defaults**:
  Add `data-mock="1" data-scenario="server-500" data-preview="1"` to the `<form>` for persistent previews while designing.

This keeps your real submit path intact, but never calls it when mock mode is on—so you can design and QA error/success states in a live-looking environment with zero network traffic.
