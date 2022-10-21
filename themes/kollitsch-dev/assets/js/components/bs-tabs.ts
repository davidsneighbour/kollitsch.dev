import { Tab } from 'bootstrap';

// Bootstrap Tabs
const triggerTabList = Array.prototype.slice.call(document.querySelectorAll('is--codesample a'));
triggerTabList.forEach((triggerElement: Element) => {
	const tabTrigger = new Tab(triggerElement);
	triggerElement.addEventListener('click', (event: { preventDefault: () => void }) => {
		event.preventDefault();
		tabTrigger.show();
	});
});
