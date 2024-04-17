import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';

import { themeSwitcher } from './scripts/theme-switcher';
import ClickSpark from './components/click-effect.js';

import 'web-vitals-element';
import './scripts/keyboard-layout';
import './scripts/theme-changes';

// import bootstrap scripts
import './scripts/bs-tabs.js';
import './scripts/bs-tooltips.js';

// @ts-ignore - importing parameters from GoHugo
import * as params from '@params';

// import custom elements
customElements.define("click-effect", ClickSpark);

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.Alpine = Alpine;
    window.themeSwitcher = themeSwitcher;
    Alpine.plugin(collapse);
    Alpine.data('versionData', function () {
      return {
        'version': params.tag_name,
        'url': params.html_url,
      };
    });
    Alpine.start();
  }
};
