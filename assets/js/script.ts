// @ts-ignore
import Alpine from 'alpinejs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Collapse, Tab } from 'bootstrap';
import './components/menu.ts';

// change giscus theme
function changeGiscusTheme(theme: string) {

  let scheme = "light";
  if (theme === "dark") {
    scheme = "dark";
  } else if (theme === "dim") {
    scheme = "dark_dimmed";
  }

  function sendMessage(message: { setConfig: { theme: string; }; }) {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;
    iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
  }

  sendMessage({
    setConfig: {
      theme: scheme
    }
  });
}

// @ts-ignore
window.Alpine = Alpine;

// themechanger
Alpine.store('theme', {
  mode: 'dim',

  init() {
    const mode = localStorage.theme;
    if (mode !== undefined) {
      this.set(localStorage.theme);
      let scheme = "light";
      if (mode === "dark") {
        scheme = "dark";
      } else if (mode === "dim") {
        scheme = "dark_dimmed";
      }
      setTimeout('changeGiscusTheme', 5000, scheme);

    } else if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      this.set('dim');
    } else {
      this.set('light');
    }
  },

  set(mode: string) {
    this.mode = mode;
    localStorage.theme = this.mode;
    changeGiscusTheme(mode)
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
