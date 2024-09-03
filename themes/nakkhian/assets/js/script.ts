import Alpine from 'alpinejs';
import collapse from '@alpinejs/collapse';
import intersect from '@alpinejs/intersect';

import ClickSpark from './components/click-effect.ts';
import ProgressBar from './components/progress-bar.ts';

import './scripts/keyboard-layout.ts';
import './scripts/theme-changes.ts';
import { initializeAndSwitchClassOnScroll } from './scripts/navbar-opacity.ts';

// import bootstrap scripts
import './scripts/bs-tooltips.ts';

// @ts-ignore - importing parameters from GoHugo
import * as params from '@params';

// youtube element
import LiteYTEmbed from './lite-yt-embed.js';
customElements.define('lite-youtube', LiteYTEmbed);

// import custom elements
customElements.define('click-effect', ClickSpark);
customElements.define('progress-bar', ProgressBar);

// initialize navbar opacity
window.onload = initializeAndSwitchClassOnScroll;
document.addEventListener('DOMContentLoaded', initializeAndSwitchClassOnScroll);

// initialize theme switcher
document.addEventListener('alpine:init', () => {
  Alpine.data('themeSwitcher', () => ({
    theme: 'dark',
    _giscusPath: 'https://giscus.app',
    init() {
      this.theme = this.getColorPreference();
      this.reflectPreference();
      this.changeGiscusTheme();
      setTimeout(() => this.changeGiscusTheme(), 2000);

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.theme = e.matches ? 'dark' : 'light';
        this.setPreference();
      });
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      this.setPreference();
      this.changeGiscusTheme();
      setTimeout(() => this.changeGiscusTheme(), 2000);
    },
    getColorPreference() {
      return (
        localStorage.getItem('dnb-theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      );
    },
    setPreference() {
      localStorage.setItem('dnb-theme', this.theme);
      this.reflectPreference();
    },
    reflectPreference() {
      if (document.firstElementChild) {
        document.firstElementChild.setAttribute('data-bs-theme', this.theme);
      }
      document.body.classList.add(this.theme);
      document.body.classList.remove(this.theme === 'dark' ? 'light' : 'dark');
    },
    changeGiscusTheme() {
      const giscusTheme = this.theme === 'dark' ? 'dark' : 'light';
      let iframe = document.querySelector('iframe.giscus-frame');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ giscus: { setConfig: { theme: giscusTheme } } }, this._giscusPath);
      }
    },
  }));
});

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.Alpine = Alpine;
    Alpine.plugin(collapse);
    Alpine.plugin(intersect);
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
        },
      };
    });
    Alpine.start();
  }
};

document.addEventListener('scroll', function () {
  const scroll =
    ((document.documentElement.scrollTop || document.body.scrollTop) /
      ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight)) *
    100;
  const progress = document.querySelector('.progress');
  progress.style.setProperty('--scroll', scroll + '%');
  progress.setAttribute('aria-valuenow', scroll);
});
