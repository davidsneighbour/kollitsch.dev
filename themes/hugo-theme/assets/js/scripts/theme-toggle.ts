// @see ttps://web.dev/building-a-theme-switch-component/
// @todo create a react component for this
const storageKey = 'theme-preference'

const onClick = () => {
	// flip current value
	theme.value = theme.value === 'light'
		? 'dark'
		: 'light'

	setPreference()
}

const getColorPreference = () => {
	if (localStorage.getItem(storageKey))
		return localStorage.getItem(storageKey);
	else
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
}

const setPreference = () => {
	localStorage.setItem(storageKey, theme.value);
	reflectPreference();
}

const reflectPreference = () => {
	// @todo get embarrassed about the following 17 lines of code and refactor
	document.firstElementChild.setAttribute('data-bs-theme', theme.value);
	document.querySelector('body').classList.add(theme.value);
	document.querySelector('body').classList.remove(theme.value === 'light' ? 'dark' : 'light');

	if (theme.value === 'dark') {
		document.querySelector('#toggle-button-dark').classList.add('d-inline-block');
		document.querySelector('#toggle-button-dark').classList.remove('d-none');
		document.querySelector('#toggle-button-light').classList.add('d-none');
		document.querySelector('#toggle-button-light').classList.remove('d-inline-block');
	} else {
		document.querySelector('#toggle-button-light').classList.add('d-inline-block');
		document.querySelector('#toggle-button-light').classList.remove('d-none');
		document.querySelector('#toggle-button-dark').classList.add('d-none');
		document.querySelector('#toggle-button-dark').classList.remove('d-inline-block');
	}
	document.querySelector('#theme-toggle')?.setAttribute('aria-label', theme.value);
}

const theme = {
	value: getColorPreference(),
}

// set early so no page flashes / CSS is made aware
reflectPreference()

window.onload = () => {
	// set on load so screen readers can see latest value on the button
	reflectPreference()

	// now this script can find and listen for clicks on the control
	document.querySelector('#theme-toggle').addEventListener('click', onClick)
}

// sync with system changes
window
	.matchMedia('(prefers-color-scheme: dark)')
	.addEventListener('change', ({ matches: isDark }) => {
		theme.value = isDark ? 'dark' : 'light'
		setPreference()
	})
