# head.html 

`head.html` is a fully equipped fully configurable head tag collection for your GoHugo based website. 

## Configuration parameters

- All configuration is located in the params section below `params.dnb.head`. 
- All samples in this document are documented in TOML and assume the section header is already present above them.

```toml
[params]
[params.dnb]
[params.dnb.head]
parameter = value
```

### General setup

`head.html` uses opiniated defaults that can be overridden via configuration:

- `meta > charset` (default: "utf-8")
- `meta > viewport` (default: "width=device-width, initial-scale=1")
- `base` uses the `baseURL` parameter of the global configuration object

### `title` and `description` generation

### Author generation

### Speed optimisation

### Translations

### Verification

### Social Graph

### Series

### SEO

### Others

## Hooks

- head-init
- head-start
- head-pre-css
- head-post-css
- head-end
  
