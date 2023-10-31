---
title: All You Ever Wanted to Know about Collections in Gohugo
linkTitle: All You Ever Wanted to Know about Collections in Gohugo
description: ""
summary: ""
draft: true
date: 2023-10-31T17:00:58+07:00
publishDate: 2023-10-31T17:00:58+07:00
lastmod: 2023-10-31T17:03:37+07:00
resources:
- title: Photo by [Name](Link) via [Unsplash](https://unsplash.com/)
  name: image name if other than src
  src: ave-calvar-HcUDHJfd5GY-unsplash.jpg
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

| function | type | description |
| --- | --- | --- |
| [collections.Dictionary]() | create | creates a map from a list of key/value pairs |
| [collections.Slice](https://gohugo.io/functions/collections/slice/) | create | creates a slice of all passed arguments |
| [collections.Seq]() | create | returns a slice of integers |
| [collections.Append](https://gohugo.io/functions/collections/append/) | modify | append one or more elements to a slice |
| [collections.Merge]() | modify | merge two or more maps |
| [collections.Apply]() | modify | returns a collection after transforming each element with a given function |
| [collections.Delimit]() | modify | joins elements of a collection |
| [collections.Uniq]() | modify | return a slice that has all duplicates removed |
| [collections.Reverse]() | modify | returns a collection after reversing the order of its elements |
| [collections.Shuffle]() | modify | returns a random order of the given collection |
| [collections.Sort]() | modify | returns a sorted collection based on given parameters |
| [collections.First]() | collection | return the first n elements of a collection |
| [collections.Last]() | collection | return the last n elements of a collection |
| [collections.After]() | collection | return all elements after the n-th element of a collection |
| [collections.Group]() | collection | groups a list of pages |
| [collections.Where]() | collection | filters a collection to only the elements containing a matching value for a given field |
| [collections.In]() | lookup | reports whether an element is in an array or slice |
| [collections.Index]() | lookup | looks up the index or key of the structure passed to it |
| [collections.IsSet]() | lookup | reports whether they index or key exists within the collection |
| [collections.Complement]() | compare | compare two or more collections and return elements that are only in the last one |
| [collections.Intersect]() | compare | compare two or more collections and return elements that are in all collections |
| [collections.Union]() | compare | compare two collections and return elements that belong to one or both collection only once |
| [collections.SymDiff]() | compare | compare two or more collections and return the symetric difference |
