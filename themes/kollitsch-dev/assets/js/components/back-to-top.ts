const triggerTabList = Array.prototype.slice.call(document.querySelectorAll('is--back-to-top'));
triggerTabList.forEach((triggerElement: Element) => {
	triggerElement.addEventListener('click', (event: { preventDefault: () => void }) => {
		event.preventDefault();
		document.body.scrollTop = 0; // safari
		document.documentElement.scrollTop = 0; // normal browsers
	});
});
