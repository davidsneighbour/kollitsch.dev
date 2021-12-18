---
title: "Analysing Collections"
date: 2021-04-04T12:16:13+07:00
description: "This is meta description"
tags:
- collections
functions:
- intersect
- union
- symdiff
- complement
---

## Introduction

When working with collections (maps and slices) in Hugo we often want to compare two collections. Listing items, that are in one collection but not the other. Listing all items of two collections combined, but not twice, if they are in both collections. Listing items that are only in one of the collections. Listing items of the same category as the current page, but not the items on the current page itself. This list can go on and on. Hugo offers some powerful functions to do exactly this.

Currently we have four different functions available to work with collections:

- [Intersect](#intersect) (returns items that are in both collections)
- [Union](#union) (returns all items from collection 1 and 2)
- [Symdiff](#symdiff) (returns all items that are NOT in both collections)
- [Complement](#complement) (returns all items of collection 1 that are NOT in collection 2)

## Intersect

Returns the elements of two arrays or slices, that are in both collections, in the order as the first array.

### Syntax

{{< highlight >}}
{{ *collection1* | **intersect** *collection2* }}  
{{ **intersect** *collection1* *collection2* }}
{{< /highlight >}}

### Example

```go-html-template
{{ $collection1 := slice 10 20 30 40 50 60 }}
{{ $collection2 := slice 50 60 70 80 90 100 }}
{{ $result := intersect $collection1 $collection2 }}
```

`$result` will contain `[50, 60]`.

### Notes

- TBD

### Use cases

#### AND filter in where query

An useful example is to use it as AND filters when combined with where:

```go-html-template
{{ $pages := where .Site.RegularPages "Type" "not in" (slice "page" "about") }}
{{ $pages = $pages | union (where .Site.RegularPages "Params.pinned" true) }}
{{ $pages = $pages | intersect (where .Site.RegularPages "Params.images" "!=" nil) }}
```

The above fetches regular pages not of page or about type unless they are pinned. And finally, we exclude all pages with no images set in Page params.

## Union

Given two arrays or slices, returns a new array that contains the elements that belong to either or both arrays/slices.

### Syntax

{{< syntax >}}
{{ *collection1* | **union** *collection2* }}  
{{ **union** *collection1* *collection2* }}
{{< /syntax >}}

### Example

```go-html-template
{{ $collection1 := slice 10 20 30 40 50 60 }}
{{ $collection2 := slice 50 60 70 80 90 100 }}
{{ $result := union $collection1 $collection2 }}
```

`$result` will contain `[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]`.

### Notes

- Every element in the `$result` will occur only once, even if it was part of both collections.
- `nil` is a special content type, meaning that nothing exists. It is NOT `false` (which is a boolean). This leads to the issue, that if you compare `nil` with `nil` you will receive an error. You can however compare a slice to `nil` and a map to `nil`. Confused? Think of `nil` as `nothing but not like any other nothing`.
- This function works only on slices (single dimensional arrays) of elements. These elements can be either numbers (integers or floats) or strings.

### Use cases

#### OR filter in where query

This is also very useful to use as OR filters when combined with where:

```go-html-template
{{ $pages := where .Site.RegularPages "Type" "not in" (slice "page" "about") }}
{{ $pages = $pages | union (where .Site.RegularPages "Params.pinned" true) }}
{{ $pages = $pages | intersect (where .Site.RegularPages "Params.images" "!=" nil) }}
```

The above fetches regular pages not of page or about type unless they are pinned. And finally, we exclude all pages with no images set in Page params.

#### Find unique items in a map or slice

```go-html-template
{{ $collection := slice 1 2 2 3 3 3 4 4 4 4 }}
{{ $result := union $collection $collection }}
```

Due to the fact that `union` returns only single occurences of each item in each slice or map the `$result` will contain only `[1, 2, 3, 4]`.

## Symdiff

collections.SymDiff (alias symdiff) returns the symmetric difference of two collections.

### Syntax

{{< syntax >}}
{{ *collection1* | **symdiff** *collection2* }}  
{{ **symdiff** *collection1* *collection2* }}
{{< /syntax >}}

### Example

```go-html-template
{{ $collection1 := slice 10 20 30 40 50 60 }}
{{ $collection2 := slice 50 60 70 80 90 100 }}
{{ $result := symdiff $collection1 $collection2 }}
```

`$result` will contain `[10, 20, 30, 40, 70, 80, 90, 100]`.

### Notes

- TBD

### Use cases

```go-html-template
{{ slice 1 2 3 | symdiff (slice 3 4) }}
```

The above will print [1 2 4].

## Complement

collections.Complement (alias complement) gives the elements of a collection that are not in any of the others.

### Syntax

{{< syntax >}}  
{{ *collection1* | **complement** *collection2* [*collection3* ...] }}  
{{ **complement** *collection1* *collection2* [*collection3* ...] }}  
{{< /syntax >}}

### Example

```go-html-template
{{ $collection1 := slice 10 20 30 40 50 60 }}
{{ $collection2 := slice 50 60 70 80 90 100 }}
{{ $result := complement $collection1 $collection2 }}
```

`$result` will contain `[10, 20, 30, 40]`.

### Notes

- TBD

### Use cases

```go-html-template
{{ $pages := .Site.RegularPages | first 50 }}
{{ $news := where $pages "Type" "news" | first 5 }}
{{ $blog := where $pages "Type" "blog" | first 5 }}
{{ $other := $pages | complement $news $blog | first 10 }}
```

The above is an imaginary use case for the home page where you want to display different page listings in sections/boxes on different places on the page: 5 from news, 5 from the blog and then
