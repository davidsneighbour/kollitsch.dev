import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import { themeSwitcher } from './theme-switcher.js';

document.addEventListener('DOMContentLoaded', function () {
  window.Alpine = Alpine;
  window.themeSwitcher = themeSwitcher;
  Alpine.plugin(collapse);
  // Alpine.data('versionData', function () {
  //   return {
  //     'version': params.tag_name,
  //     'url': params.html_url,
  //   };
  // });
  Alpine.start();
});
