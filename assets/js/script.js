import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import intersect from '@alpinejs/intersect'

import { themeSwitcher } from './scripts/theme-switcher';
import ClickSpark from './components/click-effect.js';

import 'web-vitals-element';
import './scripts/keyboard-layout';
import './scripts/theme-changes';
import { initializeAndSwitchClassOnScroll } from './scripts/navbar-opacity';

// import bootstrap scripts
import './scripts/bs-tabs.js';
import './scripts/bs-tooltips.js';

// @ts-ignore - importing parameters from GoHugo
import * as params from '@params';

// import custom elements
customElements.define("click-effect", ClickSpark);

// initialize navbar opacity
document.addEventListener('DOMContentLoaded', initializeAndSwitchClassOnScroll);

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.Alpine = Alpine;
    window.themeSwitcher = themeSwitcher;
    Alpine.plugin(collapse);
    Alpine.plugin(intersect)
    // Define the Alpine.js data component with initial placeholder values
    Alpine.data('versionData', () => {
      return {
        version: 'Loading...',
        url: '#',
        init() {
          this.fetchVersionData();
        },
        async fetchVersionData() {
          const apiUrl = `https://api.github.com/repos/davidsneighbour/kollitsch.dev/releases/tags/v${params.version}`;
          try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.version = data.tag_name;
            this.url = data.html_url;
          } catch (error) {
            console.error('Failed to fetch version data:', error);
            this.version = 'Error';
            this.url = '#';
          }
        }
      };
    });
    Alpine.start();

  }
};
