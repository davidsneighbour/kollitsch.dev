---
description: TypeScript configuration for Astro projects
applyTo: "src/components/**/*.astro"
---

## Built-in HTML attributes

Astro provides the `HTMLAttributes` type to check that your markup is using valid HTML attributes. You can use these types to help build component props.

For example, if you were building a `<Link>` component, you could do the following to mirror the default HTML attributes for `<a>` tags in your component's prop types.

`src/components/Link.astro`

```ts
---
import type { HTMLAttributes } from "astro/types";
// use a `type`type Props = HTMLAttributes<"a">;
// or extend with an `interface`interface Props extends HTMLAttributes<"a"> {  myProp?: boolean;}
const { href, …attrs } = Astro.props;
---
<a href={href} {…attrs}>  
  <slot />
</a>
```

## `ComponentProps` type

**Added in:** `astro@4.3.0`

This type export allows you to reference the `Props` accepted by another component, even if that component doesn't export that `Props` type directly.

The following example shows using the `ComponentProps` utility from `astro/types` to reference a `<Button />` component's `Props` types:

`src/pages/index.astro`

```
---
import type { ComponentProps } from "astro/types";
import Button from "./Button.astro";
type ButtonProps = ComponentProps<typeof Button>;
---
```

## Polymorphic type

**Added in:** `astro@2.5.0`

Astro includes a helper to make it easier to build components that can render as different HTML elements with full type safety. This is useful for components like `<Link>` that can render as either `<a>` or `<button>` depending on the props passed to it.

The example below implements a fully typed, polymorphic component that can render as any HTML element. The [`HTMLTag`](https://docs.astro.build/en/guides/typescript/#built-in-html-attributes) type is used to ensure that the `as` prop is a valid HTML element.

```ts
---
import type { HTMLTag, Polymorphic } from "astro/types";
type Props<Tag extends HTMLTag> = Polymorphic<{ as: Tag }>;
const { as: Tag, …props } = Astro.props;
---
<Tag {…props} />
```

## Infer `getStaticPaths()` types

**Added in:** `astro@2.1.0`

Astro includes helpers for working with the types returned by your [`getStaticPaths()`](https://docs.astro.build/en/reference/routing-reference/#getstaticpaths) function for dynamic routes.

You can get the type of [`Astro.params`](https://docs.astro.build/en/reference/api-reference/#params) with `InferGetStaticParamsType` and the type of [`Astro.props`](https://docs.astro.build/en/reference/api-reference/#props) with `InferGetStaticPropsType` or you can use `GetStaticPaths` to infer both at once:

`src/pages/posts/[…id].astro`

```ts
import type {
  InferGetStaticParamsType,
  InferGetStaticPropsType,
  GetStaticPaths,
} from "astro";

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => {
    return {
      params: { id: post.id },
      props: { draft: post.data.draft, title: post.data.title },
    };
  });
}) satisfies GetStaticPaths;

type Params = InferGetStaticParamsType<typeof getStaticPaths>;
type Props = InferGetStaticPropsType<typeof getStaticPaths>;

const { id } = Astro.params as Params;
// ------------------^? { id: string; }

const { title } = Astro.props;
// ---------------------^? { draft: boolean; title: string; }
```
