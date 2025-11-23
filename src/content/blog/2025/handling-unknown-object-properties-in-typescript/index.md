---
title: Handling unknown object properties in TypeScript
description: Learning how to handle unknown object properties in TypeScript with index signatures for safe and flexible type management.
date: 2025-11-23T05:56:47.283Z
tags:
  - howto
  - typescript
  - today-i-learned
cover:
  src: getty-images-o4exhQKCbRE-unsplash.jpg
  title: Sometimes it's complicated.
---

When modelling real world objects in TypeScript, we often know some properties in advance while others remain undefined until runtime. Take a car as an object for example. We might always know its colour, number of seats, tyres, or max speed, but additional information can appear depending on context, such as manufacturer notes or metadata loaded from an API.

Good to know that TypeScript hands us a clean way to combine both fixed and unknown properties in one type (and then move on with our lives).

The core feature to know is an [index signature](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures). It allows us to define known properties while opening the door for extra ones.

Using `unknown` for additional fields (see `interface Car`) keeps your type safe. If you prefer to skip type checking for additional fields, you can use `any` instead (see `interface CarUnsafe`):

```ts {6,13}
interface Car {
  colour: string;
  seats: number;
  maxSpeed: number;
  tyres: number;
  [key: string]: unknown;
}
interface CarUnsafe {
  colour: string;
  seats: number;
  maxSpeed: number;
  tyres: number;
  [key: string]: any;
}
```

Both versions accept extra properties, but they behave very differently during usage.

### Using `unknown` extra properties

If we choose `unknown` then TypeScript will force us to narrow the type correctly:

```ts
const car: Car = {
  colour: 'red',
  seats: 4,
  maxSpeed: 200,
  tyres: 4,
  customFeature: 123,
};
if (typeof car.customFeature === 'number') {
  console.log(car.customFeature + 1);
}
```

Just writing `console.log(car.customFeature);` instead of the type check will raise a type error, because TypeScript cannot be sure what type `customFeature` is. We have to check it first. This adds a layer of safety when dealing with these unknown properties.

### Using `any` extra properties

Choosing `any` with additional fields will keep them untyped and unpredictable, but allows for more freedom:

```ts
const carUnsafe: CarUnsafe = {
  colour: 'blue',
  seats: 2,
  maxSpeed: 180,
  tyres: 4,
  debugData: 'anything goes here',
};
console.log(carUnsafe.debugData.toUpperCase());
```

`unknown` gives us flexibility with safety. `any` gives us freedom at the cost of control. Both solve the problem of mixing defined and undefined properties. The right choice depends on whether we want to treat unknown fields as first class data or simply allow them to exist in addition to our known properties.
