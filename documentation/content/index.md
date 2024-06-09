---
title: Content
summary: ""
weight: 100
---

> [!WARNING]
> This documentation is under (re)construction. Check back later for changes and feel free to open
> an issue if you have questions or suggestions.

- [General notes](#general-notes)

---

## Content

### Archetypes

This website has the following archetypes with their respective front matters and features:

- `default` - the default archetype for all content types
- `blog` - the archetype for blog posts
- `components` - the archetype for components
- `hugo-release-notes` - the archetype for Hugo release notes
- `music2program2` - the archetype for developer music playlists
- `notes-from-the-laboratory` - the archetype for notes from the laboratory
- `tags` - the archetype for tags

### Front matter parameters

#### Layout options

Sample:

```yaml
theme:
  comments: false
```

The following front matter parameters exist to fine-tune the layouts and theme options:

- `comments` - set to false to turn off comment forms and display (default: true)
- `showdate` - set to false to turn off the date per post display (default: true)
