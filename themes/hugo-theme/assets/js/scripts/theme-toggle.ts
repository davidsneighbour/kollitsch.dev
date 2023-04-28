// @see ttps://web.dev/building-a-theme-switch-component/
// @todo create a react component for this
const storageKey = 'theme-preference'

// set giscus theme urls
const giscusDarkTheme = 'dark';
const giscusLightTheme = 'light';

const onClick = () => {
	theme.value = theme.value === 'light' ? 'dark' : 'light';
	setPreference();
	changeGiscusTheme();
	setTimeout(changeGiscusTheme, 2000);
}

const getColorPreference = () => {
	if (localStorage.getItem(storageKey)) {
		return localStorage.getItem(storageKey);
	}
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const setPreference = () => {
	localStorage.setItem(storageKey, theme.value);
	reflectPreference();
}

const reflectPreference = () => {
	// @todo get embarrassed about the following 17 lines of code and refactor
	document.firstElementChild?.setAttribute('data-bs-theme', theme.value);
	document.querySelector('body')?.classList.add(theme.value);
	document.querySelector('body')?.classList.remove(theme.value === 'light' ? 'dark' : 'light');

	if (theme.value === 'dark') {
		document.querySelector('#toggle-button-dark')?.classList.add('d-inline-block');
		document.querySelector('#toggle-button-dark')?.classList.remove('d-none');
		document.querySelector('#toggle-button-light')?.classList.add('d-none');
		document.querySelector('#toggle-button-light')?.classList.remove('d-inline-block');
	} else {
		document.querySelector('#toggle-button-light')?.classList.add('d-inline-block');
		document.querySelector('#toggle-button-light')?.classList.remove('d-none');
		document.querySelector('#toggle-button-dark')?.classList.add('d-none');
		document.querySelector('#toggle-button-dark')?.classList.remove('d-inline-block');
	}
	document.querySelector('#theme-toggle')?.setAttribute('aria-label', theme.value);
}

// @todo move into hugo-giscus component
const changeGiscusTheme = () => {
	const theme = document.firstElementChild?.getAttribute('data-bs-theme') === 'dark' ? giscusDarkTheme : giscusLightTheme;

	function sendMessage(message: object) {
		const iframe = document.querySelector('iframe.giscus-frame');
		if (!iframe) {
			return;
		}
		iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
	}

	sendMessage({
		setConfig: {
			theme: theme
		}
	});

}

const theme = {
	value: getColorPreference(),
}
reflectPreference()
window.onload = () => {
	reflectPreference();
	document.querySelector('#theme-toggle').addEventListener('click', onClick);
}

window
	.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change', ({ matches: isDark }) => {
		theme.value = isDark ? 'dark' : 'light'
		setPreference()
	});

changeGiscusTheme();
setTimeout(changeGiscusTheme, 5000);


// const modeToggle = document.getElementsByClassName("mode-toggle")[0];
// if (typeof modeToggle !== "undefined") {
//   modeToggle.addEventListener('click', changeGiscusTheme);
// }


// (function() {
// 	var dmmq = window.matchMedia('(prefers-color-scheme: dark)');
// 	var giscusFrame;
// 	function updateGiscus() {
// 			if (!giscusFrame) giscusFrame = document.querySelector('iframe.giscus-frame');
// 			if (dmmq.matches) {
// 					// Dark theme
// 					giscusFrame.contentWindow.postMessage({ giscus: { setConfig: { theme: 'dark' } } }, 'https://giscus.app');
// 			} else {
// 					// Light theme
// 					giscusFrame.contentWindow.postMessage({ giscus: { setConfig: { theme: 'light' } } }, 'https://giscus.app');
// 			}
// 	}
// 	setTimeout(updateGiscus, 1000); // leave time for giscus to load
// 	dmmq.addEventListener('change', updateGiscus);
// })();


// function changeGiscusTheme() {
// 	// theme can either be `dark` or `light`.
// 	let theme = localStorage.getItem("pref-theme");
// 	let message = { setConfig: { theme: theme } };
// 	let iframe = document.querySelector('iframe.giscus-frame');
// 	// iframe might not be loaded by the time this function is called.
// 	if (iframe) {
// 			iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
// 	}
// }

// function handleMessage(event) {
// 	if (event.origin !== 'https://giscus.app') return;
// 	if (!(typeof event.data === 'object' && event.data.giscus)) return;
// 	changeGiscusTheme();
// }

// window.addEventListener('message', handleMessage);
