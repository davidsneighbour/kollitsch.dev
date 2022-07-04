// @ts-ignore
import Alpine from 'alpinejs';
//import './components/menu.ts';
import 'web-vitals-element';

// change Giscus theme
// @todo https://tailwindcss.com/docs/dark-mode
function changeGiscusTheme(theme = 'dark_dimmed') {
  let scheme = 'dark_dimmed';
	if (theme === 'light') {
		scheme = 'light';
	}

	function sendMessage(message: { setConfig: { theme: string } }) {
		const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
		if (iframe) {
			// @ts-ignore
			iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
		}
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
// @todo https://tailwindcss.com/docs/dark-mode
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

Alpine.start();
