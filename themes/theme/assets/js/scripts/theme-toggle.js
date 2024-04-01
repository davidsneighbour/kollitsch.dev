import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
// @ts-ignore
import * as params from '@params';
import { themeSwitcher } from './theme-switcher';

document.addEventListener('DOMContentLoaded', function () {
  window.Alpine = Alpine;
  window.themeSwitcher = themeSwitcher;
  console.log(params);
  Alpine.plugin(collapse);
  Alpine.data('versionData', function () {
    return {
      'version': params.tag_name,
      'url': params.html_url,
    };
  });
  Alpine.start();
});
