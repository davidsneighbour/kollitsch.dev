import Alpine from 'alpinejs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Collapse, Tab } from 'bootstrap';
import './components/menu.ts';

// change giscus theme
function changeGiscusTheme(theme = 'dark_dimmed') {
  const scheme = theme === 'light' ? 'light' : 'dark_dimmed';

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function sendMessage(message: { setConfig: { theme: string } }) {
    const iframe = document.querySelector(
      'iframe.giscus-frame'
    ) as HTMLIFrameElement;
    if (!iframe) return;
    iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
  }

  sendMessage({ setConfig: { theme: scheme } });
}

window.Alpine = Alpine;

// themechanger
Alpine.store('theme', {
  mode: 'dark',

  init() {
    const mode = localStorage.theme;
    if (mode === undefined) {
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: light)').matches
      ) {
        this.set('light');
      } else {
        this.set('dark');
      }
    }
  },

  set(mode: string) {
    this.mode = mode;
    localStorage.theme = this.mode;
    changeGiscusTheme(mode);
    setTimeout(changeGiscusTheme, 2000, mode);
  },
});

Alpine.start();

// Bootstrap Tabs
const triggerTabList = Array.prototype.slice.call(
  document.querySelectorAll('#myTab button')
);
triggerTabList.forEach((triggerElement: Element) => {
  const tabTrigger = new Tab(triggerElement);
  triggerElement.addEventListener(
    'click',
    (event: { preventDefault: () => void }) => {
      event.preventDefault();
      tabTrigger.show();
    }
  );
});

// Bootstrap Collapsibles
const collapseElementList = Array.prototype.slice.call(
  document.querySelectorAll('.collapse')
);
collapseElementList.map(function collapsibles(collapseElement: Element) {
  return new Collapse(collapseElement, {
    toggle: false,
  }).hide();
});
