import collapse from '@alpinejs/collapse';
import intersect from '@alpinejs/intersect';
import DebugLogger from '@davidsneighbour/debuglogger';
import Alpine from 'alpinejs';
import ClickSpark from './components/click-effect.js';
import ProgressBar from './components/progress-bar.js';
import DnbTextScramble from './components/text-scramble.js';
import './scripts/keyboard-layout.js';
import './plugins/lib/clipboard.js';
import './scripts/bs-tooltips.js';
import './plugins/pwa.js';
// @dnb-youtube - YouTube element
import LiteYTEmbed from './mods/youtube/lite-yt-embed-esm.js';

// Import parameters from GoHugo
// @ts-ignore - injected at runtime by GoHugo
import * as params from '@params';

// enable logger for local debugging
const logger = new DebugLogger(params.debug);
logger.setPrefix('⚡', '#00aa00');
logger.enableDebug();

// debug params from hugo
logger.table('Hugo injected params', params);

// Initiate custom elements
customElements.define('lite-youtube', LiteYTEmbed);
customElements.define('click-effect', ClickSpark);
customElements.define('progress-bar', ProgressBar);
customElements.define('dnb-textscramble', DnbTextScramble);

// Extend the Window interface to include the Alpine property
declare global {
  interface Window {
    Alpine: typeof Alpine;
  }
}

// Initialize theme switcher
document.addEventListener('alpine:init', () => {
  Alpine.data('themeSwitcher', () => ({
    theme: 'dark',
    _giscusPath: 'https://giscus.app',
    init() {
      this.theme = this.getColorPreference();
      this.reflectPreference();
      this.changeGiscusTheme();
      setTimeout(() => this.changeGiscusTheme(), 2000);

      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
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
        (window.matchMedia('(prefers-color-scheme: light)').matches
          ? 'light'
          : 'dark')
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
      const iframe = document.querySelector('iframe.giscus-frame');
      if (iframe instanceof HTMLIFrameElement && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: giscusTheme } } },
          this._giscusPath,
        );
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
          this.version = 'v' + params.version;
          this.url =
            'https://github.com/davidsneighbour/kollitsch.dev/releases/tag/' +
            this.version;
        },
      };
    });
    Alpine.start();

    logger.log('Script loaded');

    const placeholder = document.querySelector('h1.sitetitle');
    const stickyBrand = document.querySelector('.sticky-top .navbar-brand');

    logger.log('Elements found:', { placeholder, stickyBrand });

    if (!placeholder || !stickyBrand) {
      logger.error('Placeholder or sticky brand not found!');
      return;
    }

    logger.log(
      'Placeholder position on DOMContentLoaded:',
      placeholder.getBoundingClientRect(),
    );

    const observer = new IntersectionObserver(
      ([entry]) => {
        logger.log(
          'Observer triggered. Is intersecting:',
          entry.isIntersecting,
        );
        if (!entry.isIntersecting) {
          stickyBrand.classList.add('sticky-visible');
        } else {
          stickyBrand.classList.remove('sticky-visible');
        }
      },
      { threshold: 0 },
    );

    observer.observe(placeholder);
    logger.log('Observer set up for:', placeholder);

    // Force initial state check
    const isIntersecting =
      placeholder.getBoundingClientRect().top >= 0 &&
      placeholder.getBoundingClientRect().bottom > 0;

    logger.log('Initial intersection state:', isIntersecting);
    if (!isIntersecting) {
      stickyBrand.classList.add('sticky-visible');
    } else {
      stickyBrand.classList.remove('sticky-visible');
    }
  }
};

document.addEventListener('scroll', () => {
  // update the progress bar... progress... state... thing
  const scroll =
    ((document.documentElement.scrollTop || document.body.scrollTop) /
      ((document.documentElement.scrollHeight || document.body.scrollHeight) -
        document.documentElement.clientHeight)) *
    100;
  const progress = document.querySelector('.progress') as HTMLElement | null;
  if (progress) {
    progress.style.setProperty('--scroll', `${scroll}%`);
    progress.setAttribute('aria-valuenow', scroll.toFixed(2));
  }
  // update the nav bar state
  const body = document.body;
  const scrollThreshold = 50;
  const currentState =
    window.scrollY > scrollThreshold ? 'nav-state2' : 'nav-state1';
  const oppositeState =
    currentState === 'nav-state1' ? 'nav-state2' : 'nav-state1';
  if (!body.classList.contains(currentState)) {
    body.classList.remove(oppositeState);
    body.classList.add(currentState);
  }
});
setTimeout(() => {
  // trigger the scroll event after 500ms for some intial set-up
  document.dispatchEvent(new Event('scroll'));
}, 500);
