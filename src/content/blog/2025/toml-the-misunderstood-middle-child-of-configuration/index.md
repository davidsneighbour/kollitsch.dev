---
title: TOML - the misunderstood middle-child of configuration
description: >-
  TOML is a simple, human-readable configuration format that avoids the pitfalls
  of other formats like YAML and JSON. Learn its syntax and common pitfalls.
draft: true
date: 2025-05-02T09:11:40+07:00
resources:
  - title: Boxes.
    src: resource-database-qvbZz5rKAxI-unsplash.jpg
tags:
  - toml
  - configuration
  - howto
  - 100daystooffload
fmContentType: blog
cover:
  src: ./resource-database-qvbZz5rKAxI-unsplash.jpg
  title: TOML - the misunderstood middle-child of configuration
publisher: rework
---

TOML (Tom's Obvious, Minimal Language) sits quietly between the noisy intendation drama of YAML and the rigid uncommentable structure of JSON. It's not flashy, but it's reliable. It wants to be clear, unambiguous, and readable - all while avoiding all the guns that other formats keep loaded to shoot your self in the foot.

Let's start with the basics before descending into the deeper syntax caves.

## Simple Value Types

TOML supports a handful of primitive value types that cover most use cases without trying to reinvent configuration as programming.

* **Strings**

  ```toml {noconfig=true}
  favorite_fruit = "Banana"
  color = 'yellow'
  multiline_note = """
  This fruit is sweet
  and perfect for smoothies.
  """
  ```

* **Integer and Float**

  ```toml {noconfig=true}
  quantity = 12
  sweetness = 8.5
  ```

* **Boolean**

  ```toml {noconfig=true}
  is_fresh = true
  is_rotten = false
  ```

* **Date and Time**

  ```toml {noconfig=true}
  harvest_date = 2025-05-02T15:04:05Z
  ```

  No quotes around dates. TOML knows what you mean.

## The Real Adventure: Tables and Arrays

Here's where TOML stops being polite and starts getting real.

* Tables (a.k.a. Sections)

  Tables are defined by headers in square brackets. Nested tables are created by using dot notation.

  ```toml {noconfig=true}
  [apple]
  color = "red"
  size = "medium"

  [apple.nutrition]
  sugar = 10
  type = "fructose"
  ```

  *Tables define structure.* They are the backbone of TOML config files.

* Inline Tables

  Compact version, good for one-liners.

  ```toml {noconfig=true}
  [banana]
  nutrients = { potassium = "high", fiber = "medium" }
  ```

  But beware: they can't span multiple lines. No multiline formatting fun here.

* Arrays

  Simple arrays:

  ```toml {noconfig=true}
  colors = ["red", "green", "yellow"]
  ```

  Multiline arrays:

  ```toml {noconfig=true}
  fruits = [
    "Apple",
    "Banana",
    "Cherry",
  ]
  ```

* Array of Tables

  This is where people either fall in love with TOML or quit.

  ```toml {noconfig=true}
  [[fruit_basket]]
  type = "Apple"
  ripe = true

  [[fruit_basket]]
  type = "Mango"
  ripe = false
  ```

  Double brackets `[[fruit_basket]]` mean: "this is an array of tables".

  The common pitfall? Forgetting that `[[fruit_basket]]` doesn't merge - it appends.

## Strings: Literal vs. Escaped Multiline

TOML supports two ways to write multiline strings, and they behave very differently.

* Literal Multiline Strings

  ```toml {noconfig=true}
  description = '''
  Juicy
  Colorful
  Delicious
  '''
  ```

  This will preserve all the newlines and spacing exactly as-is. Great for paragraphs, blocks of documentation, or tasting notes.

* Escaped Multiline Strings

  ```toml {noconfig=true}
  description = """
  Juicy \
  Colorful \
  Delicious \
  """
  ```

  Backslashes at the end of each line escape the newline, so the whole block is treated as a single line. Use this if you want logical continuity but need to break up the line visually.

## Common Pitfalls and Gotchas

### Mixing Table and Inline Definitions

You cannot define a table partially with inline syntax and partially with block syntax.

```toml {noconfig=true}
[grape]
color = "purple"
grape.details = { seedless = true }  # ❌ Invalid
```

This will throw an error because TOML does not allow redefining `grape.details` both as a table (via dot notation) and as an inline table. Stick to one format per structure.

### Arrays Must Be Homogeneous

All values inside an array must be of the same type.

```toml {noconfig=true}
fruit_mix = ["Apple", 5, true]  # ❌ Invalid: mixed types
```

This must be corrected by ensuring all items are of the same type:

```toml {noconfig=true}
fruit_mix = ["Apple", "Banana", "Pear"]  # ✅ Valid
```

### Duplicate Keys Are Forbidden

If you assign the same key twice, TOML will throw an error - even if the value is identical.

```toml {noconfig=true}
favorite = "Peach"
favorite = "Mango"  # invalid, because `favorite` is already in use
```

TOML enforces this to ensure deterministic behavior. Only one assignment per key is allowed.

### Dot Notation Must Follow Structure

Dot-separated keys must respect hierarchy. You cannot define subkeys if their parent is already defined with a value.

```toml {noconfig=true}
fruit = "Orange"
fruit.type = "Citrus"  # ❌ Invalid: 'fruit' is a value, not a table
```

Instead, make `fruit` a table:

```toml {noconfig=true}
[fruit]
type = "Citrus"  # ✅ Valid
```

### Trailing Commas in Inline Structures Are Not Allowed

```toml {noconfig=true}
colors = { primary = "#FFA500", secondary = "#00FF00", }  # ❌ Invalid
```

Remove the trailing comma:

```toml {noconfig=true}
colors = { primary = "#FFA500", secondary = "#00FF00" }  # ✅ Valid
```

### Whitespace and Indentation Don't Affect Parsing

Unlike YAML, indentation is not significant in TOML. However, inconsistent formatting may hurt readability.

```toml {noconfig=true}
[melon]      # Fine
weight     = 1.2    # Still fine, but messy
```

While this won't break parsing, cleaner formatting helps future-you debug easier.

### Misunderstanding Arrays of Tables

Trying to combine array-of-table notation with individual table headers often leads to confusion.

```toml {noconfig=true}
[[smoothies]]
type = "Berry Mix"

[smoothies.ingredients]  # ❌ Invalid
fruit = "Strawberry"
```

Each `[[smoothies]]` creates a new table instance. To nest inside it:

```toml {noconfig=true}
[[smoothies]]
type = "Berry Mix"
  [smoothies.ingredients]
  fruit = "Strawberry"  # ❌ Still invalid
```

Instead, use inline tables or keep nesting flat per object:

```toml {noconfig=true}
[[smoothies]]
type = "Berry Mix"
ingredients = { fruit = "Strawberry" }  # ✅ Valid
```

## Final Thoughts

TOML is opinionated, but that is what makes it useful. It enforces clarity where others lean into chaos. Once you understand its table mechanics and respect its type safety, it becomes a powerful config format - one that won't surprise you six months later.

Next time you write a config file, consider giving the misunderstood middle child a seat at the table.
