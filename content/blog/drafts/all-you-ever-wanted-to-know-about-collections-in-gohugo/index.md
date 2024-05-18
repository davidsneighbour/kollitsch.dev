---
title: All you ever wanted to know about collections in GoHugo, and more
linkTitle: GoHugo collections
description: ""
summary: ""
draft: true
date: 2024-01-17T21:51:27+07:00
publishDate: 2024-01-17T21:51:27+07:00
lastmod: 2024-01-22T22:49:38+07:00
resources:
- title: Collections in Gohugo, by DALL-E
  src: header.png
- src: collections.png
  title: Collections in Gohugo, by DALL-E
categories:
- category1
tags:
- tag1
- tag2
- tag3
- 100DaysToOffload
keywords:
- keyword1
- keyword2
- keyword3
type: blog
unsplash:
  imageid: abcdefghijk
---

## Introduction

Collections are a powerful feature of GoHugo. They are used to create, modify, select, lookup, compare, process, and type *a bunch of somethings*. These *somethings* might be pages in your website, pieces of information, or just anything comparable to arrays and objects in your mother-(programming-)language. This post will cover all of these aspects and how to deal with them in GoHugo.

## Quick reference

| function | type | description |
| --- | --- | --- |
| [collections.Dictionary](https://gohugo.io/functions/collections/dictionary/) | create | creates a map from a list of key/value pairs |
| [collections.Slice](https://gohugo.io/functions/collections/slice/) | create | creates a slice of all passed arguments |
| [collections.KeyVals](https://gohugo.io/functions/collections/keyvals/) | create | creates a collection with a key and all following arguments as sliced values |
| [collections.Seq](https://gohugo.io/functions/collections/seq/) | create | returns a slice of integers |
| [collections.Append](https://gohugo.io/functions/collections/append/) | modify | append one or more elements to a slice |
| [collections.Merge](https://gohugo.io/functions/collections/merge/) | modify | merge two or more maps |
| [collections.Apply](https://gohugo.io/functions/collections/apply/) | modify | returns a collection after transforming each element with a given function |
| [collections.Delimit](https://gohugo.io/functions/collections/delimit/) | modify | joins elements of a collection |
| [collections.Uniq](https://gohugo.io/functions/collections/uniq/) | modify | return a slice that has all duplicates removed |
| [collections.Reverse](https://gohugo.io/functions/collections/reverse/) | modify | returns a collection after reversing the order of its elements |
| [collections.Shuffle](https://gohugo.io/functions/collections/shuffle/) | modify | returns a random order of the given collection |
| [collections.Sort](https://gohugo.io/functions/collections/sort/) | modify | returns a sorted collection based on given parameters |
| [collections.First](https://gohugo.io/functions/collections/first/) | collection | return the first n elements of a collection |
| [collections.Last](https://gohugo.io/functions/collections/last/) | collection | return the last n elements of a collection |
| [collections.After](https://gohugo.io/functions/collections/after/) | collection | return all elements after the n-th element of a collection |
| [collections.Group](https://gohugo.io/functions/collections/group/) | collection | groups a list of pages |
| [collections.Where](https://gohugo.io/functions/collections/where/) | collection | filters a collection to only the elements containing a matching value for a given field |
| [collections.In](https://gohugo.io/functions/collections/in/) | lookup | reports whether an element is in an array or slice |
| [collections.Index](https://gohugo.io/functions/collections/index/) | lookup | looks up the index or key of the structure passed to it |
| [collections.IsSet](https://gohugo.io/functions/collections/isset/) | lookup | reports whether they index or key exists within the collection |
| [collections.Complement](https://gohugo.io/functions/collections/complement/) | compare | compare two or more collections and return elements that are only in the last one |
| [collections.Intersect](https://gohugo.io/functions/collections/intersect/) | compare | compare two or more collections and return elements that are in all collections |
| [collections.Union](https://gohugo.io/functions/collections/union/) | compare | compare two collections and return elements that belong to one or both collection only once |
| [collections.SymDiff](https://gohugo.io/functions/collections/symdiff/) | compare | compare two or more collections and return the symetric difference |
| [collections.Querify](https://gohugo.io/functions/collections/querify/) | process | converts a map to a query string |
| [collections.NewScratch](https://gohugo.io/functions/collections/newscratch/) | process | creates a new locally scoped scratch |
| [reflect.isMap](https://gohugo.io/functions/reflect/ismap/) | typing | reports whether its argument is a map |
| [reflect.isSlice](https://gohugo.io/functions/reflect/isslice/) | typing | reports whether its argument is a slice |

<https://gohugo.io/templates/lists/#order-content>
<https://gohugo.io/templates/lists/#group-content>

## Sample collections

The following collections of books will be used throughout this post to demonstrate the different functions. The rating is a random value between 0 and 5. This is not my opinion on the books, but just a random value to demonstrate the functions. We will work with two collections, either collection 1 or collectio"the full collection" to refer to both collections.

### Collection 1

| # | Title                                 | Author            | Genre            | Year | Rating |
|---|---------------------------------------|-------------------|------------------|------|--------|
| 1 | Mystery of the Ancient Ruins          | Alex Johnson      | Mystery          | 2018 | 4.5    |
| 2 | Dune                                  | Frank Herbert     | Science Fiction  | 1965 | 4.8    |
| 3 | The Art of Cooking                    | John Doe          | Non-Fiction      | 2015 | 4.0    |
| 4 | Animal Farm                           | George Orwell     | Dystopian        | 1945 | 4.5    |
| 5 | A Game of Thrones                     | George R.R. Martin| Fantasy          | 1996 | 4.5    |
| 6 | The Lord of the Rings                 | J.R.R. Tolkien    | Fantasy          | 1954 | 4.9    |
| 7 | Brave New World                       | Aldous Huxley     | Dystopian        | 1932 | 4.3    |
| 8 | Do Androids Dream of Electric Sheep?  | Philip K. Dick    | Science Fiction  | 1968 | 4.4    |
| 9 | Frankenstein                          | Mary Shelley      | Gothic Fiction   | 1818 | 4.2    |
| 10| To Kill a Mockingbird                 | Harper Lee        | Classic Fiction  | 1960 | 4.6    |

### Collection 2

| # | Title                                 | Author            | Genre            | Year | Rating |
|---|---------------------------------------|-------------------|------------------|------|--------|
| 11| The Great Gatsby                      | F. Scott Fitzgerald| Classic Fiction | 1925 | 4.3    |
| 12| Foundation                            | Isaac Asimov      | Science Fiction  | 1951 | 4.6    |
| 13| Pride and Prejudice                   | Jane Austen       | Classic Fiction  | 1813 | 4.5    |
| 14| Neuromancer                           | William Gibson    | Science Fiction  | 1984 | 4.3    |
| 15| The Hitchhiker's Guide to the Galaxy  | Douglas Adams     | Science Fiction  | 1979 | 4.7    |
| 16| 1984                                  | George Orwell     | Dystopian        | 1949 | 4.7    |
| 17| Moby Dick                             | Herman Melville   | Adventure Fiction| 1851 | 4.1    |
| 18| The War of the Worlds                 | H.G. Wells        | Science Fiction  | 1898 | 4.2    |
| 19| The Catcher in the Rye                | J.D. Salinger     | Classic Fiction  | 1951 | 4.0    |
| 20| The Time Machine                      | H.G. Wells        | Science Fiction  | 1895 | 4.3    |

## Create a collection

Certainly! Let's rewrite the section on creating collections in GoHugo to include the full definition of $collection1 and $collection2, a sample using `collections.KeyVals`, and a slice of integers from 0 to 100 using the `collections.Seq` function.

***

## Creating Collections in GoHugo

### Defining Book Collections

In GoHugo, collections can be defined using built-in functions. Here's how you can comprehensively define $collection1 and $collection2:

```go
{{ $collection1 := slice
    (dict "Title" "Mystery of the Ancient Ruins" "Author" "Alex Johnson" "Genre" "Mystery" "Year" 2018 "Rating" 4.5)
    (dict "Title" "Dune" "Author" "Frank Herbert" "Genre" "Science Fiction" "Year" 1965 "Rating" 4.8)
    (dict "Title" "The Art of Cooking" "Author" "John Doe" "Genre" "Non-Fiction" "Year" 2015 "Rating" 4.0)
    (dict "Title" "Animal Farm" "Author" "George Orwell" "Genre" "Dystopian" "Year" 1945 "Rating" 4.5)
    ... // and so on for other books in Collection 1
}}

{{ $collection2 := slice
    (dict "Title" "The Great Gatsby" "Author" "F. Scott Fitzgerald" "Genre" "Classic Fiction" "Year" 1925 "Rating" 4.3)
    (dict "Title" "Foundation" "Author" "Isaac Asimov" "Genre" "Science Fiction" "Year" 1951 "Rating" 4.6)
    (dict "Title" "Pride and Prejudice" "Author" "Jane Austen" "Genre" "Classic Fiction" "Year" 1813 "Rating" 4.5)
    (dict "Title" "Neuromancer" "Author" "William Gibson" "Genre" "Science Fiction" "Year" 1984 "Rating" 4.3)
    ... // and so on for other books in Collection 2
}}
```

### Using `collections.KeyVals`

`collections.KeyVals` is useful for creating a collection with a key and values. Here's an example using part of Collection 1:

```go
{{ $keyValSample := keyVals "FavoriteBooks" (slice (index $collection1 0) (index $collection1 1)) }}
```

This will create a collection with the key "FavoriteBooks" and the first two books from $collection1 as its values.

### Creating a Sequence with `collections.Seq`

The `collections.Seq` function generates a sequence of numbers. Here's how to create a sequence from 0 to 100:

```go
{{ $numberSequence := seq 0 100 }}
```

This command will create a slice containing integers from 0 to 100.

## Modify a collection

Let's modify $collection1 and $collection2 using functions like `collections.Append` and `collections.Merge`:

```go
{{ $extendedCollection1 := append $collection1 (dict "Title" "New Book" "Author" "New Author" "Genre" "New Genre" "Year" 2024 "Rating" 4.7) }}
{{ $mergedCollections := merge $collection1 $collection2 }}
```

## Select from a collection

Select specific elements from $collection1 and $collection2:

```go
{{ $firstTwoBooks := first 2 $collection1 }}
{{ $lastTwoBooks := last 2 $collection2 }}
```

## Lookup in a collection

Check if a specific element is in $collection1 or $collection2:

```go
{{ range $collection1 }}
    {{ if eq .Title "Dune" }}
        Found Dune in Collection 1.
    {{ end }}
{{ end }}
```

## Compare collections

Compare $collection1 and $collection2:

```go
{{ $uniqueInCollection2 := complement $collection2 $collection1 }}
{{ $commonBooks := intersect $collection1 $collection2 }}
```

## Process collections

Transform $collection1 into a different form:

```go
{{ $bookTitlesQuery := querify "titles" (pluck "Title" $collection1) }}
```

## Typ(ecasting|ing) collections

Determine the type of $collection1:

```go
{{ if reflect.isSlice $collection1 }}$collection1 is a slice.{{ end }}
```
