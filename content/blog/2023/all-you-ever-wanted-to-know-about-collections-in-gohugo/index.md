---
title: All You Ever Wanted to Know about Collections in Gohugo
linkTitle: All You Ever Wanted to Know about Collections in Gohugo
description: ""
summary: ""
draft: true
date: 2023-10-31T17:00:58+07:00
publishDate: 2023-10-31T17:00:58+07:00
lastmod: 2023-11-18T16:42:55+07:00
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

<https://gohugo.io/templates/lists/#order-content>
<https://gohugo.io/templates/lists/#group-content>

# Sample collections

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
