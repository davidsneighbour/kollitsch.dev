---
applyTo: "**/*.astro,**/*.ts"
---

# Tailwind Plus Elements Documentation

Tailwind Plus Elements is a JavaScript UI component library that powers all the interactive behavior in our HTML snippets. It has no dependencies on JavaScript frameworks like React, and works with any modern stack—Next.js, Rails, Laravel, Svelte, Astro, or even plain HTML.

## Available components

Tailwind Plus Elements includes the following UI components:

- [Autocomplete][]
- [Command palette][]
- [Dialog][]
- [Disclosure][]
- [Dropdown menu][]
- [Popover][]
- [Select][]
- [Tabs][]

## Browser support

Elements targets the same modern browsers supported by Tailwind CSS v4.0, and relies on the following minimum versions:

- **Chrome 111** _(released March 2023)_
- **Safari 16.4** _(released March 2023)_
- **Firefox 128** _(released July 2024)_

## Installing in your project

The easiest way to install Elements is via the CDN. To do this, add the following script to your project's `<head>` tag:

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindplus/elements@1" type="module"></script>
```

Alternatively, if you have a build pipeline you can also install it via npm:

```bash
npm install @tailwindplus/elements
```

Next, import Elements into your root layout:

```js
import '@tailwindplus/elements'
```

## Detecting when ready

Sometimes you may want to add additional functionality to the Elements' components using JavaScript. To do this you must ensure that Elements has been loaded and is ready before interacting with it. You can do this by listening to the `elements:ready` event on the `window` object:

```js
function myFunction() {
  let autocomplete = document.getElementById('autocomplete')
  // Do something with the autocomplete element
}

if (customElements.get('el-autocomplete')) {
  myFunction()
} else {
  window.addEventListener('elements:ready', myFunction)
}
```

## Autocomplete

The `<el-autocomplete>` component is a text input that allows users to enter arbitrary values or select from a list of filtered suggestions. It behaves like a native`<datalist>`, but offers greater control over styling.

### Component API

#### `<el-autocomplete>`

The main autocomplete component that manages form integration, filtering, and coordinates with its child components

| Type                      | Name           | Description                               |
| ------------------------- | -------------- | ----------------------------------------- |
| CSS variables (Read-only) | --input-width  | Provides the width of the input element.  |
| CSS variables (Read-only) | --button-width | Provides the width of the button element. |

#### `<el-options>`

The options container that handles the popover behavior.

| Type                        | Name            | Description                                                                                |
| --------------------------- | --------------- | ------------------------------------------------------------------------------------------ |
| Attributes                  | popover         | Required to enable the popover behavior.                                                   |
| Attributes                  | anchor          | Configures the way the options are anchored to the button.                                 |
| Attributes                  | anchor-strategy | Sets the `position` CSS property of the popover to either `absolute` (default) or `fixed`. |
| CSS variables               | --anchor-gap    | Sets the gap between the anchor and the popover.                                           |
| CSS variables               | --anchor-offset | Sets the distance that the popover should be nudged from its original position.            |
| Data attributes (Read-only) | data-closed     | Present before transitioning in, and when transitioning out.                               |
| Data attributes (Read-only) | data-enter      | Present when transitioning in.                                                             |
| Data attributes (Read-only) | data-leave      | Present when transitioning out.                                                            |
| Data attributes (Read-only) | data-transition | Present when transitioning in or out.                                                      |
| Methods                     | togglePopover() | Toggles the options visibility.                                                            |
| Methods                     | showPopover()   | Shows the options.                                                                         |
| Methods                     | hidePopover()   | Hides the options.                                                                         |

#### `<el-option>`

Individual selectable option within the autocomplete.

| Type                        | Name          | Description                                       |
| --------------------------- | ------------- | ------------------------------------------------- |
| Attributes                  | value         | The value of the option (required for selection). |
| Attributes                  | disabled      | Whether the option is disabled.                   |
| ARIA attributes (Read-only) | aria-selected | Present when the option is selected.              |

#### `<el-selectedcontent>`

Automatically displays the content of the currently selected option.

### Examples

#### Basic example

Use the `<el-autocomplete>` and `<el-options>` components, along with a native `<input>` and `<button>`, to build an autocomplete input:

```html
<el-autocomplete>
  <input name="user" />
  <button type="button">
    <svg><!-- ... --></svg>
  </button>

  <el-options popover>
    <el-option value="Wade Cooper">Wade Cooper</el-option>
    <el-option value="Tom Cooper">Tom Cooper</el-option>
    <el-option value="Jane doe">Jane Doe</el-option>
  </el-options>
</el-autocomplete>
```

#### Positioning the dropdown

Add the `anchor` prop to the `<el-options>` to automatically position the dropdown relative to the `<input>`:

```html
<el-options popover anchor="bottom start">
  <!-- ... -->
</el-options>
```

Use the values `top`, `right`, `bottom`, or `left` to center the dropdown along the appropriate edge, or combine it with `start` or `end` to align the dropdown to a specific corner, such as `top start` or `bottom end`.

To control the gap between the input and the dropdown, use the `--anchor-gap` CSS variable:

```html
<el-options popover anchor="bottom start" class="[--anchor-gap:4px]">
  <!-- ... -->
</el-options>
```

Additionally, you can use `--anchor-offset` to control the distance that the dropdown should be nudged from its original position.

#### Setting the dropdown width

The `<el-options>` has no width set by default, but you can add one using CSS:

```html
<el-options popover class="w-52">
  <!-- ... -->
</el-options>
```

If you'd like the dropdown width to match the `<input>` width, use the `--input-width` CSS variable that's exposed on the `<el-options>` element:

```html
<el-options popover class="w-(--input-width)">
  <!-- ... -->
</el-options>
```

#### Adding transitions

To animate the opening and closing of the dropdown, target the `data-closed`, `data-enter`, `data-leave`, and `data-transition` attributes with CSS to style the different stages of the transition:

```html
<el-options
  popover
  class="transition transition-discrete data-closed:opacity-0 data-enter:duration-75 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
>
  <!-- ... -->
</el-options>
```

#### Disabling the input

To disable the input, add the `disabled` attribute to the `<input>`:

```html
<el-autocomplete>
  <input name="user" disabled />

  <!-- ... -->
</el-autocomplete>
```

## Command palette

The `<el-command-palette>` component provides a fast, keyboard-friendly way for users to search and select from a predefined list of options. It's typically displayed inside a dialog - often triggered with a `Cmd+K` shortcut - making it ideal for building power-user features like global searches.

### Component API

#### `<el-command-palette>`

The main command component that manages filtering and coordinates with its child components

| Type       | Name                  | Description                                                                                                                                                                  |
| ---------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Attributes | name                  | The form field name for the command when used in forms.                                                                                                                      |
| Attributes | value                 | The selected value of the command. Can be read and set programmatically.                                                                                                     |
| Events     | change                | Dispatched when the active item changes. Detail contains `relatedTarget` property with the active item or `null`.                                                            |
| Methods    | setFilterCallback(cb) | Allows you to customize the filtering behavior of the command. The callback receives an object with `query`, `node` and `content` properties, and should return a `boolean`. |
| Methods    | reset()               | Resets the command to its initial state.                                                                                                                                     |

#### `<el-command-list>`

Contains all the command items and groups. All focusable children will be considered options.

#### `<el-defaults>`

Optional container for suggestion items that are shown when the input is empty.

#### `<el-command-group>`

Groups related command items together.

#### `<el-no-results>`

Optional element shown when no items match the current query.

#### `<el-command-preview>`

Optional preview content shown when a specific item is active.

| Type       | Name | Description                                                   |
| ---------- | ---- | ------------------------------------------------------------- |
| Attributes | for  | The `id` of the item this preview content is associated with. |

### Examples

#### Basic example

Use the `<el-command-palette>`, `<el-command-list>`, `<el-no-results>` components, along with a native `<input>`, to build a command palette:

```html
<el-dialog>
  <dialog>
    <el-command-palette>
      <input autofocus placeholder="Search…" />

      <el-command-list>
        <button hidden type="button">
          Option #1
        </button>
        <button hidden type="button">
          Option #2
        </button>
        <button hidden type="button">
          Option #3
        </button>
      </el-command-list>

      <el-no-results hidden>No results found.</el-no-results>
    </el-command-palette>
  </dialog>
</el-dialog>
```

## Dialog

The `<el-dialog>` component is a lightweight wrapper around the native `<dialog>` element that adds scroll locking, click-outside-to-close support, and smooth exit transitions that work consistently across all browsers. It builds on standard HTML APIs while making dialogs easier to use and style.

### Component API

#### `<el-dialog>`

Wrapper around the native `<dialog>` element used to manage the open state and transitions.

| Type                        | Name            | Description                                                                                                                                              |
| --------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Attributes                  | open            | A boolean attribute that indicates whether the dialog is open or closed. You can change the attribute to dynamically open or close the dialog.           |
| Data attributes (Read-only) | data-closed     | Present before transitioning in, and when transitioning out.                                                                                             |
| Data attributes (Read-only) | data-enter      | Present when transitioning in.                                                                                                                           |
| Data attributes (Read-only) | data-leave      | Present when transitioning out.                                                                                                                          |
| Data attributes (Read-only) | data-transition | Present when transitioning in or out.                                                                                                                    |
| Events                      | open            | Dispatched when the dialog is opened in any way other than by updating the `open` attribute.                                                             |
| Events                      | close           | Dispatched when the dialog is closed in any way other than by updating the `open` attribute.                                                             |
| Events                      | cancel          | Dispatched when the user attempts to dismiss the dialog via Escape key or clicking outside. Calling `preventDefault()` prevents the dialog from closing. |
| Methods                     | show()          | Shows the dialog in modal mode.                                                                                                                          |
| Methods                     | hide()          | Hides the dialog. Takes an optional object with a `restoreFocus` property to disable the default focus restoration.                                      |

#### `<dialog>`

The native dialog element.

| Type     | Name       | Description        |
| -------- | ---------- | ------------------ |
| Commands | show-modal | Opens the dialog.  |
| Commands | close      | Closes the dialog. |

#### `<el-dialog-backdrop>`

The visual backdrop behind your dialog panel.

| Type                        | Name            | Description                                                  |
| --------------------------- | --------------- | ------------------------------------------------------------ |
| Data attributes (Read-only) | data-closed     | Present before transitioning in, and when transitioning out. |
| Data attributes (Read-only) | data-enter      | Present when transitioning in.                               |
| Data attributes (Read-only) | data-leave      | Present when transitioning out.                              |
| Data attributes (Read-only) | data-transition | Present when transitioning in or out.                        |

#### `<el-dialog-panel>`

The main content area of your dialog. Clicking outside of this will trigger the dialog to close.

| Type                        | Name            | Description                                                  |
| --------------------------- | --------------- | ------------------------------------------------------------ |
| Data attributes (Read-only) | data-closed     | Present before transitioning in, and when transitioning out. |
| Data attributes (Read-only) | data-enter      | Present when transitioning in.                               |
| Data attributes (Read-only) | data-leave      | Present when transitioning out.                              |
| Data attributes (Read-only) | data-transition | Present when transitioning in or out.                        |

### Examples

#### Basic example

Use the `<el-dialog>` and `<el-dialog-panel>` components, along with a native `<dialog>`, to build a dialog:

```html
<button command="show-modal" commandfor="delete-profile" type="button">Delete profile</button>

<el-dialog>
  <dialog id="delete-profile">
    <el-dialog-panel>
      <form method="dialog">
        <h3>Delete profile</h3>
        <p>Are you sure? This action is permanent and cannot be undone.</p>
        <div class="flex gap-4">
          <button command="close" commandfor="delete-profile" type="button">Cancel</button>
          <button type="submit">Delete</button>
        </div>
      </form>
    </el-dialog-panel>
  </dialog>
</el-dialog>
```

#### Opening the dialog

You can open dialogs using the `show-modal` [invoker command](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API):

```html
<button command="show-modal" commandfor="delete-profile" type="button">Open dialog</button>

<el-dialog>
  <dialog id="delete-profile"><!-- ... --></dialog>
</el-dialog>
```

Alternatively you can add the `open` attribute to the `<el-dialog>` to open it:

```diff
- <el-dialog>
+ <el-dialog open>
    <dialog><!-- ... --></dialog>
  </el-dialog>
```

You can also programmatically open the dialog using the `show()` method on `<el-dialog>`:

```html
<el-dialog id="delete-profile">
  <dialog><!-- ... --></dialog>
</el-dialog>

<script type="module">
  const dialog = document.getElementById('delete-profile')
  dialog.show()
</script>
```

#### Closing the dialog

You can close dialogs using the `close` [invoker command](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API):

```html
<button command="close" commandfor="delete-profile" type="button">Close dialog</button>

<el-dialog>
  <dialog id="delete-profile"><!-- ... --></dialog>
</el-dialog>
```

Alternatively you can remove the `open` attribute from the `<el-dialog>` to close it:

```diff
- <el-dialog open>
+ <el-dialog>
    <dialog><!-- ... --></dialog>
  </el-dialog>
```

You can also programmatically close the dialog using the `hide()` method on `<el-dialog>`:

```html
<el-dialog id="delete-profile">
  <dialog><!-- ... --></dialog>
</el-dialog>

<script type="module">
  const dialog = document.getElementById('delete-profile')
  dialog.hide()
</script>
```

#### Adding a backdrop

Use the `<el-dialog-backdrop>` component to add a backdrop behind your dialog panel:

```html
<el-dialog>
  <dialog class="backdrop:bg-transparent">
    <el-dialog-backdrop class="pointer-events-none bg-black/50" />
    <el-dialog-panel><!-- ... --></el-dialog-panel>
  </dialog>
</el-dialog>
```

The primary benefit of using the `<el-dialog-backdrop>` component over the native `::backdrop` pseudo-element is that it can be transitioned reliably using CSS.

#### Adding transitions

To animate the opening and closing of the dialog, target the `data-closed`, `data-enter`, `data-leave`, and `data-transition` attributes with CSS to style the different stages of the transition:

```html
<el-dialog>
  <dialog class="backdrop:bg-transparent">
    <el-dialog-backdrop
      class="pointer-events-none bg-black/50 transition duration-200 data-closed:opacity-0"
    />
    <el-dialog-panel
      class="bg-white transition duration-200 data-closed:scale-95 data-closed:opacity-0"
    >
      <!-- ... -->
    </el-dialog-panel>
  </dialog>
</el-dialog>
```

## Disclosure

The `<el-disclosure>` component provides a simple, accessible way to show and hide content - ideal for building things like toggleable accordion panels or expandable sections.

### Component API

#### `<el-disclosure>`

Contains the content of the disclosure.

| Type                        | Name            | Description                                                  |
| --------------------------- | --------------- | ------------------------------------------------------------ |
| Attributes                  | hidden          | Whether the disclosure is initially hidden (closed).         |
| Attributes                  | open            | Automatically synced with the `hidden` attribute.            |
| Data attributes (Read-only) | data-closed     | Present before transitioning in, and when transitioning out. |
| Data attributes (Read-only) | data-enter      | Present when transitioning in.                               |
| Data attributes (Read-only) | data-leave      | Present when transitioning out.                              |
| Data attributes (Read-only) | data-transition | Present when transitioning in or out.                        |
| Methods                     | show()          | Shows the disclosure.                                        |
| Methods                     | hide()          | Hides the disclosure.                                        |
| Methods                     | toggle()        | Toggles the disclosure.                                      |
| Commands                    | --show          | Shows the disclosure.                                        |
| Commands                    | --hide          | Hides the disclosure.                                        |
| Commands                    | --toggle        | Toggles the disclosure.                                      |

### Examples

#### Basic example

Use the `<el-disclosure>` component, along with a native `<button>`, to build a disclosure:

```html
<button command="--toggle" commandfor="my-disclosure" type="button">
  What's the best thing about Switzerland?
</button>

<el-disclosure hidden id="my-disclosure"> I don't know, but the flag is a big plus. </el-disclosure>
```

#### Opening a disclosure

You can open disclosures using the `--show` [invoker command](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API):

```html
<button command="--show" commandfor="my-disclosure" type="button">Show disclosure</button>

<el-disclosure hidden id="my-disclosure">
  <!-- ... -->
</el-disclosure>
```

Alternatively you can remove the `hidden` attribute to open it:

```diff
- <el-disclosure hidden>
+ <el-disclosure>
    <!-- ... -->
  </el-disclosure>
```

You can also programmatically open disclosures using the `show()` method:

```html
<el-disclosure hidden id="my-disclosure">
  <!-- ... -->
</el-disclosure>

<script type="module">
  const disclosure = document.getElementById('my-disclosure')
  disclosure.show()
</script>
```

#### Closing a disclosure

You can close disclosures using the `--hide` [invoker command](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API):

```html
<button command="--hide" commandfor="my-disclosure" type="button">Hide disclosure</button>

<el-disclosure id="my-disclosure">
  <!-- ... -->
</el-disclosure>
```

Alternatively you can add the `hidden` attribute to close it:

```diff
- <el-disclosure>
+ <el-disclosure hidden>
    <!-- ... -->
  </el-disclosure>
```

You can also programmatically close disclosures using the `hide()` method:

```html
<el-disclosure id="my-disclosure">
  <!-- ... -->
</el-disclosure>

<script type="module">
  const disclosure = document.getElementById('my-disclosure')
  disclosure.hide()
</script>
```

#### Toggling a disclosure

You can toggle disclosures using the `--toggle` [invoker command](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API):

```html
<button command="--toggle" commandfor="my-disclosure" type="button">Toggle disclosure</button>

<el-disclosure hidden id="my-disclosure">
  <!-- ... -->
</el-disclosure>
```

You can also programmatically toggle disclosures using the `toggle()` method:

```html
<el-disclosure hidden id="my-disclosure">
  <!-- ... -->
</el-disclosure>

<script type="module">
  const disclosure = document.getElementById('my-disclosure')
  disclosure.toggle()
</script>
```

#### Adding transitions

To animate the opening and closing of the disclosure, target the `data-closed`, `data-enter`, `data-leave`, and `data-transition` attributes with CSS to style the different stages of the transition:

```html
<el-disclosure hidden class="transition transition-discrete duration-1000 data-closed:opacity-0">
  <!-- ... -->
</el-disclosure>
```

## Dropdown menu

The `<el-dropdown>` component makes it easy to build dropdown menus with full keyboard support and built-in anchoring to control where the dropdown appears relative to its trigger.

### Component API

#### `<el-dropdown>`

Connects the button with the menu.

| Type          | Name          | Description                                          |
| ------------- | ------------- | ---------------------------------------------------- |
| CSS variables | --input-width | Provides the width of the input element (read-only). |

#### `<el-menu>`

Contains all the menu items. All focusable children will be considered options.

| Type                        | Name            | Description                                                                                            |
| --------------------------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| Attributes                  | popover         | Required to enable the popover behavior.                                                               |
| Attributes                  | open            | Controls the open/closed state of the menu.                                                            |
| Attributes                  | anchor          | Where to position the dropdown menu. Supports values like "bottom", "bottom-start", "bottom-end", etc. |
| Attributes                  | anchor-strategy | Sets the `position` CSS property of the popover to either `absolute` (default) or `fixed`.             |
| CSS variables               | --anchor-gap    | Sets the gap between the anchor and the popover.                                                       |
| CSS variables               | --anchor-offset | Sets the distance that the popover should be nudged from its original position.                        |
| Data attributes (Read-only) | data-closed     | Present before transitioning in, and when transitioning out.                                           |
| Data attributes (Read-only) | data-enter      | Present when transitioning in.                                                                         |
| Data attributes (Read-only) | data-leave      | Present when transitioning out.                                                                        |
| Data attributes (Read-only) | data-transition | Present when transitioning in or out.                                                                  |
| Methods                     | togglePopover() | Toggles the menu visibility.                                                                           |
| Methods                     | showPopover()   | Shows the menu.                                                                                        |
| Methods                     | hidePopover()   | Hides the menu.                                                                                        |

### Examples

#### Basic example

Use the `<el-dropdown>` and `<el-menu>` components, along with a native `<button>`, to build a dropdown menu:

```html
<el-dropdown>
  <button type="button">Options</button>
  <el-menu anchor="bottom start" popover>
    <button class="focus:bg-gray-100" type="button">Edit</button>
    <button class="focus:bg-gray-100" type="button">Duplicate</button>
    <hr role="none" />
    <button class="focus:bg-gray-100" type="button">Archive</button>
    <button class="focus:bg-gray-100" type="button">Delete</button>
  </el-menu>
</el-dropdown>
```

All focusable children within the `<el-menu>` component will be considered options.

## Popover

The `<el-popover>` component is used to display floating panels with arbitrary content - perfect for things like navigation menus and flyouts.

### Component API

#### `<el-popover>`

Contains the content of the popover.

| Type                        | Name            | Description                                                                                      |
| --------------------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| Attributes                  | anchor          | Where to position the popover. Supports values like "bottom", "bottom-start", "bottom-end", etc. |
| Attributes                  | anchor-strategy | Sets the `position` CSS property of the popover to either `absolute` (default) or `fixed`.       |
| Data attributes (Read-only) | data-closed     | Present before transitioning in, and when transitioning out.                                     |
| Data attributes (Read-only) | data-enter      | Present when transitioning in.                                                                   |
| Data attributes (Read-only) | data-leave      | Present when transitioning out.                                                                  |
| Data attributes (Read-only) | data-transition | Present when transitioning in or out.                                                            |
| Events                      | toggle          | Dispatched when the popover opens or closes.                                                     |
| Methods                     | togglePopover() | Toggles the popover visibility.                                                                  |
| Methods                     | showPopover()   | Shows the popover.                                                                               |
| Methods                     | hidePopover()   | Hides the popover.                                                                               |

#### `<el-popover-group>`

Links related popovers to prevent them from closing when focus is moved between them.

### Examples

#### Basic example

Use the `<el-popover-group>` component, along with a native `<button>`, to build a popover:

```html
<button popovertarget="content-a" type="button">Menu A</button>

<el-popover id="content-a" anchor="bottom start" popover> Content A </el-popover>
```

#### Grouping popovers

Use the `<el-popover-group>` component to group popovers together. This prevents them from closing when focus is moved between them:

```html
<el-popover-group>
  <button popovertarget="content-a" type="button">Menu A</button>
  <el-popover id="content-a" anchor="bottom start" popover> Content A </el-popover>

  <button popovertarget="content-b" type="button">Menu B</button>
  <el-popover id="content-b" anchor="bottom start" popover> Content B </el-popover>
</el-popover-group>
```

## Select

The `<el-select>` component is a fully accessible replacement for a native `<select>` element, designed to give you complete control over styling.

### Component API

#### `<el-select>`

Manages form integration and coordinates with its child components.

| Type                      | Name          | Description                                                             |
| ------------------------- | ------------- | ----------------------------------------------------------------------- |
| Attributes                | name          | The form field name for the select when used in forms.                  |
| Attributes                | value         | The selected value of the select. Can be read and set programmatically. |
| Events                    | input         | Dispatched when the selected option changes.                            |
| Events                    | change        | Dispatched when the selected option changes.                            |
| CSS variables (Read-only) | --input-width | Provides the width of the input element (read-only).                    |

#### `<el-options>`

The options container that handles the popover behavior.

| Type                        | Name            | Description                                                                                |
| --------------------------- | --------------- | ------------------------------------------------------------------------------------------ |
| Attributes                  | popover         | Required to enable the popover behavior.                                                   |
| Attributes                  | anchor          | Configures the way the options are anchored to the button.                                 |
| Attributes                  | anchor-strategy | Sets the `position` CSS property of the popover to either `absolute` (default) or `fixed`. |
| CSS variables               | --anchor-gap    | Sets the gap between the anchor and the popover.                                           |
| CSS variables               | --anchor-offset | Sets the distance that the popover should be nudged from its original position.            |
| Data attributes (Read-only) | data-closed     | Present before transitioning in, and when transitioning out.                               |
| Data attributes (Read-only) | data-enter      | Present when transitioning in.                                                             |
| Data attributes (Read-only) | data-leave      | Present when transitioning out.                                                            |
| Data attributes (Read-only) | data-transition | Present when transitioning in or out.                                                      |
| Methods                     | togglePopover() | Toggles the options visibility.                                                            |
| Methods                     | showPopover()   | Shows the options.                                                                         |
| Methods                     | hidePopover()   | Hides the options.                                                                         |

#### `<el-option>`

Individual selectable option within the select.

| Type                        | Name          | Description                                       |
| --------------------------- | ------------- | ------------------------------------------------- |
| Attributes                  | value         | The value of the option (required for selection). |
| Attributes                  | disabled      | Whether the option is disabled.                   |
| ARIA attributes (Read-only) | aria-selected | Present when the option is selected.              |

#### `<el-selectedcontent>`

Automatically displays the content of the currently selected option.

### Examples

#### Basic example

Use the `<el-select>`, `<el-options>` and `<el-selectedcontent>` components, along with a native `<button>`, to build a select input:

```html
<el-select name="status" value="active">
  <button type="button">
    <el-selectedcontent>Active</el-selectedcontent>
  </button>
  <el-options popover>
    <el-option value="active">Active</el-option>
    <el-option value="inactive">Inactive</el-option>
    <el-option value="archived">Archived</el-option>
  </el-options>
</el-select>
```

#### Positioning the dropdown

Add the `anchor` prop to the `<el-options>` to automatically position the dropdown relative to the `<input>`:

```html
<el-options popover anchor="bottom start">
  <!-- ... -->
</el-options>
```

Use the values `top`, `right`, `bottom`, or `left` to center the dropdown along the appropriate edge, or combine it with `start` or `end` to align the dropdown to a specific corner, such as `top start` or `bottom end`.

To control the gap between the input and the dropdown, use the `--anchor-gap` CSS variable:

```html
<el-options popover anchor="bottom start" class="[--anchor-gap:4px]">
  <!-- ... -->
</el-options>
```

Additionally, you can use `--anchor-offset` to control the distance that the dropdown should be nudged from its original position.

#### Setting the dropdown width

The `<el-options>` has no width set by default, but you can add one using CSS:

```html
<el-options popover class="w-52">
  <!-- ... -->
</el-options>
```

If you'd like the dropdown width to match the `<button>` width, use the `--button-width` CSS variable that's exposed on the `<el-options>` element:

```html
<el-options popover class="w-(--button-width)">
  <!-- ... -->
</el-options>
```

#### Adding transitions

To animate the opening and closing of the dropdown, target the `data-closed`, `data-enter`, `data-leave`, and `data-transition` attributes with CSS to style the different stages of the transition:

```html
<el-options
  popover
  class="transition transition-discrete data-closed:opacity-0 data-enter:duration-75 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
>
  <!-- ... -->
</el-options>
```

#### Disabling the input

To disable the input, add the `disabled` attribute to the `<button>`:

```html
<el-select name="status" value="active">
  <button type="button" disabled>
    <el-selectedcontent>Active</el-selectedcontent>
  </button>

  <!-- ... -->
</el-select>
```

## Tabs

The `<el-tab-group>` component makes it easy to build accessible, keyboard-navigable tab interfaces with full control over styling and layout.

### Component API

#### `<el-tab-group>`

The main container that coordinates the tabs and panels.

| Type    | Name                | Description                   |
| ------- | ------------------- | ----------------------------- |
| Methods | setActiveTab(index) | Sets the active tab by index. |

#### `<el-tab-list>`

The container for tab buttons.

#### `<el-tab-panels>`

The container for tab panels. All direct children are considered panels.

### Examples

#### Basic example

Use the `<el-tab-group>`, `<el-tab-list>`, and `<el-tab-panels>` components, along with native `<button>` elements, to build a tab group:

```html
<el-tab-group>
  <el-tab-list>
    <button type="button">Tab 1</button>
    <button type="button">Tab 2</button>
    <button type="button">Tab 3</button>
  </el-tab-list>
  <el-tab-panels>
    <div>Content 1</div>
    <div hidden>Content 2</div>
    <div hidden>Content 3</div>
  </el-tab-panels>
</el-tab-group>
```

#### Setting the active tab

The initially active tab is determined by the absence of the `hidden` attribute on panels. This allows the component to work correctly with server-side rendering.

```html
<el-tab-panels>
  <div>Active panel</div>
  <div hidden>Inactive panel</div>
  <div hidden>Inactive panel</div>
</el-tab-panels>
```
