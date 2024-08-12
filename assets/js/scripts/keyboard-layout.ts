import { install } from '@github/hotkey'

// setup all hotkeys on the page
for (const el of document.querySelectorAll('[data-hotkey]')) {
  install(el)
}
