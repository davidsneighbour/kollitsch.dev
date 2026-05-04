---
title: "RFC 2119 for humans"
description: "RFC 2119 explains MUST, SHOULD, and MAY in documentation. Learn how to read and use these terms correctly to avoid ambiguity and define clear rules."
summary: "RFC 2119 defines how words like MUST, SHOULD, and MAY are used in technical documentation. This short guide explains what they really mean, how to read them correctly, and how to use them to remove ambiguity and make rules explicit."
tags:
  - rfc
  - documentation
  - programming
cover:
  src: "samuel-regan-asante-ctE7nhF4qrQ-unsplash.jpg"
  type: image
  title: "Photo by [Samuel Regan-Asante](https://unsplash.com/@reganography) on [Unsplash](https://unsplash.com/photos/a-store-front-at-day-ctE7nhF4qrQ)"
date: 2026-05-04T05:08:26.057Z
---

If you have ever read technical documentation and seen words like MUST, SHOULD, or MAY in all caps, that is not shouting. It is a specification language.

These words come from [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119) and define exactly how strict a rule is. Once you know them, you can read documentation much more precisely.

## The short version

* MUST = required. No exceptions.
* MUST NOT = forbidden. Never do this.
* SHOULD = recommended. You can deviate, but you need a good reason.
* SHOULD NOT = discouraged. Only do this if you understand the consequences.
* MAY = optional. Your choice.

That is the entire system.

It works because it creates a contract between the writer and the reader where there is no ambiguity about what these words mean.

## Why this exists

Normal language is ambiguous.

* "You should do X" might mean "do it", "you could do it", or just "nice idea".
* "You must do X" might be advice or a personal preference, not an actual rule.

RFC 2119 removes that ambiguity. Each keyword has a fixed meaning, regardless of tone or context. Writing them in uppercase makes them easy to spot as part of a specification, not just a casual statement.

## How to read it correctly

When you see:

* "This MUST be configured before startup"

you should read it as:

* "If you do not do this, the system is considered incorrect or broken."

When you see:

* "This SHOULD be configured"

read it as:

* "This is the expected setup. There may be edge cases where you skip it, but you should know exactly why."

## Common mistake

The biggest mistake is treating these words as stylistic emphasis.

They are not.

If a document uses RFC 2119 wording correctly, these words are part of the specification, not decoration.

## When to use it yourself

Use RFC 2119 wording when:

* you write documentation that defines behaviour
* you want to remove interpretation and ambiguity
* you need contributors or users to follow rules consistently

Do not use it when:

* you are writing casual guides or tutorials
* you are unsure about the requirement level

## Long story short

RFC 2119 turns vague wording into enforceable rules. You SHOULD use it.

## Reusable snippets for your documentation

I use the following short paragraph in my projects and reference it wherever RFC 2119 wording appears:

```plaintext
### RFC 2119

Keywords such as MUST, MUST NOT, SHOULD, and MAY in this documentation follow  
RFC 2119: MUST means a strict, non-negotiable requirement; MUST NOT means  
something is absolutely prohibited; SHOULD indicates a strong recommendation  
that should only be deviated from with careful consideration and valid reasons;  
and MAY means something is truly optional. These words are not casual wording  
but indicate specific levels of requirement.
```

And a short notice where it is used:

```plaintext
This document uses RFC 2119 terminology; see the "RFC 2119" section in README.md for details.
```
