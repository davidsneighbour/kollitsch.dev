const button = document.querySelector('button#btn-share');
const icon = button.querySelector('.icon');
const canonical = document.querySelector('link[rel="canonical"]');

const IS_MAC = /Mac|iPhone/.test(navigator.platform);
const IS_WINDOWS = /Win/.test(navigator.platform);
icon.classList.add(`share${IS_MAC ? 'mac' : (IS_WINDOWS ? 'windows' : '')}`);

button.addEventListener('click', async () => {
	const title = document.title;
	const text = document.title;
	const url = canonical?.href || location.href;
	if ('share' in navigator) {
		try {
			button?.classList.remove('d-none');
			button?.classList.add('d-inline-block');
			await navigator.share({
				url,
				text,
				title,
			});
			return;
		} catch (err) {
			if (err.name !== "AbortError") {
				console.error(err.name, err.message);
			}
		}
	}
});
