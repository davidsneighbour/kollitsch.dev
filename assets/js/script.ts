// @ts-ignore
import Alpine from 'alpinejs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Collapse, Tab } from 'bootstrap';
//import './components/menu.ts';
import 'web-vitals-element';
import splitbee from '@splitbee/web';

// change Giscus theme
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

// Bootstrap Tabs
const triggerTabList = Array.prototype.slice.call(document.querySelectorAll('#myTab button'));
triggerTabList.forEach((triggerElement: Element) => {
	const tabTrigger = new Tab(triggerElement);
	triggerElement.addEventListener('click', (event: { preventDefault: () => void }) => {
		event.preventDefault();
		tabTrigger.show();
	});
});

// Bootstrap Collapsibles
const collapseElementList = Array.prototype.slice.call(document.querySelectorAll('.collapse'));
collapseElementList.map(function collapsibles(collapseElement: Element) {
	return new Collapse(collapseElement, {
		toggle: false,
	}).hide();
});

// start Splitbee analytics
splitbee.init({
  disableCookie: true
})
