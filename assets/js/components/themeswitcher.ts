// @ts-ignore
import Alpine from 'alpinejs';

function sendMessage(message: { setConfig: { theme: string } }) {
  const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
  if (iframe) {
    // @ts-ignore
    iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
  }
}

// change Giscus theme
function changeGiscusTheme(theme = 'dark_dimmed') {
  let scheme = 'dark_dimmed';
  if (theme === 'light') {
    scheme = 'light';
  }

  sendMessage({
    setConfig: {
      theme: scheme,
    },
  });
}

// @ts-ignore
window.Alpine = Alpine;

// themechanger
Alpine.store('theme', {
  mode: 'dark',

  init() {
    const mode = localStorage.theme;
    if (mode !== undefined) {
      this.set(localStorage.theme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      this.set('light');
    } else {
      this.set('dark');
    }
  },

  set(mode: string) {
    this.mode = mode;
    localStorage.theme = this.mode;
    changeGiscusTheme(mode);
    setTimeout(changeGiscusTheme, 2000, mode);
  },
});
