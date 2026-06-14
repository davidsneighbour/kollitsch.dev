---
title: A Zookeeper's Guide to tsconfig.json
description: A practical guide to configuring TypeScript for a safer, more maintainable codebase. Learn which tsconfig options are essential for catching bugs and improving developer experience.
draft: true
date: 2026-04-11T09:45:53.285Z
tags: [typescript, howto, configuration, metaphors]
cover:
  src: "eierlegende-wollmilchsau.webp"
  title: "Die eierlegende Wollmilchsau&trade;"
---

TypeScript (TS) is not just a compiler. It is the management and safety system of your codebase and you are the Zookeeper. The animals are your variables, functions, and classes. If you let animals roam freely, things *look* fine at first until they break the fence, escape, and bite paying customers of your zoo. You want to keep them safe (we are talking about the animals here), healthy, and well-behaved. TypeScript is your tool for doing that. But how do you configure it to be the best zookeeper it can be?

Disclaimer: it should be obvious, that this is an opinionated configuration. It's what I find useful in my projects. Your mileage may vary, but I hope this gives you a solid starting point for your own zoo.

## The baseline: no silent chaos

These following rules prevent obvious mistakes from slipping through unnoticed.

* **`noUnusedParameters` and `noUnusedLocals`**

  You brought an animal into the zoo. Now don't forget to feed it properly. Don't let it just stand there, unused and neglected.

  ```ts del={"noUnusedParameters will throw an error here":1} del={"noUnusedLocals will throw an error here":3}
  +
  function feedLion(food: string) {
  +
    const feedingSchedule = "twice a day";
    console.log("Feeding lion");
  }

  ```

  The `food` parameter is unused. That's either a mistake or dead code. In both cases `noUnusedParameters` will make you aware of it. The same goes for `noUnusedLocals` and any variable that is declared within your functions but not used.

  These options force you to clean up or justify every variable. No leftovers. Don't let that food spoil.

* **`allowUnusedLabels: false`**

  Labels are like signposts in the zoo. If no one uses them, they confuse everyone.

  ```ts del={"allowUnusedLabels will throw an error here, because no break or continue is referencing the lionCage label":2}
  function cleanEnclosure() {
  +
    lionCage: {
      console.log("Cleaning lion enclosure");
    }
  }
  ```

* **`noUncheckedSideEffectImports`**

  Importing something just to "do something" without control is like opening a cage and hoping nothing escapes.

  ```ts
  import "./setupZoo";
  ```

  If this file mutates global state, you want to know about it and be explicit.

* **`noFallthroughCasesInSwitch`**

  A tiger shouldn't accidentally walk into the elephant enclosure.

  ```ts
  switch (animal.type) {
    case "lion":
      feedLion();
    case "elephant":
      feedElephant();
  }
  ```

  Without a `break`, both run. That's rarely intentional.

* **`allowUnreachableCode: false`**

  Code that can never run is a locked room in the zoo that no one can enter.

  It adds complexity without value.

## Fences with a little zap: safer data handling

These options move from obvious mistakes to subtle runtime bugs.

* **`noUncheckedIndexedAccess`**

  You reach into a cage. Are you sure something is there?

  ```ts
  const animals: string[] = [];
  const first = animals[0]; // string | undefined
  ```

  Without this option, TS assumes the animal exists. With it, you must handle the possibility that it doesn't.

* **`noPropertyAccessFromIndexSignature`**

  If your zoo allows arbitrary animals, you must access them carefully.

  ```ts
  interface Zoo {
    [animal: string]: number;
  }

  const zoo: Zoo = {};
  zoo.lion; // forbidden
  zoo["lion"]; // required
  ```

  This prevents false assumptions about known properties.

* **`exactOptionalPropertyTypes`**

  Optional doesn't mean "maybe undefined and maybe something else".

  ```ts
  interface Animal {
    name?: string;
  }
  ```

  With this option:

  * either `name` exists and is a string
  * or it does not exist at all

  This avoids confusing states where something is explicitly `undefined`.

## Developer control and clarity

These options improve maintainability and debugging.

* **`noImplicitOverride`**

  If you override behaviour, say it explicitly.

  ```ts
  class Animal {
    speak() {}
  }

  class Lion extends Animal {
    override speak() {}
  }
  ```

  No silent behaviour changes.

* **`noErrorTruncation`**

  When something goes wrong, show the full animal, not just its tail.

  This is essential for complex types.

* **`erasableSyntaxOnly`**

  Keep TS purely as a type layer. No runtime surprises.

  Think of it as ensuring the zoo map doesn't alter the zoo itself.

## Introducing new animals gradually

These options help when dealing with existing JavaScript.

* **`allowJS` and `checkJS`**

  You can gradually bring wild animals into the zoo.

  ```js
  // @ts-check
  function feed(animal) {
    return animal.food;
  }
  ```

  TS starts checking JavaScript without forcing a full rewrite.

## The full ruleset

Here is the full list of zoo keeping options I add to my `tsconfig.json`:

```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "allowUnusedLabels": false,
    "noUncheckedSideEffectImports": true,
    "noFallthroughCasesInSwitch": true,
    "allowUnreachableCode": false,
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noErrorTruncation": true,
    "erasableSyntaxOnly": true,
    "allowJS": true,
    "checkJS": true
  }
}
```

## Be a better zookeeper

Without these rules:

* you assume animals exist when they don't
* you feed the wrong enclosure
* you leave unused cages all over the place
* you override behaviour without noticing
* you spend resources debugging half-visible problems

With these rules:

* every value is accounted for
* every assumption is explicit
* every mistake is caught early

Your zoo runs smoothly, and your visitors, your customers are happy.
