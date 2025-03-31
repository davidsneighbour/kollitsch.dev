import { install } from '@github/hotkey';

// Setup all hotkeys on the page
document.querySelectorAll('[data-hotkey]').forEach(el => install(el));
