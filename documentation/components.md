## Adding icons

We use Bootstrap Icons and the [`<Icon>` component](https://github.com/natemoo-re/astro-icon) to add icons. To use an icon find the name at the [Bootstrap Icon overview on the Iconify website](https://icon-sets.iconify.design/bi/?keyword=bootstrap) and use the name in the `name` prop of the `<Icon>` component.

```astro
---
import { Icon } from 'astro-icon/components';
---

<Icon name="house-fill" />
```

### Available props

```ts
interface Props extends HTMLAttributes<"svg"> {
  /**
   * References a specific Icon
   */
  name: string;
  "is:inline"?: boolean;
  title?: string;
  desc?: string;
  size?: number | string;
  width?: number | string;
  height?: number | string;
}
```

### More information

* [Bootstrap Icon overview](https://icons.getbootstrap.com/)
* [Astro Icon documentation](https://github.com/natemoo-re/astro-icon)
