const data = require("../../data/build.json");
const versionList = Array.prototype.slice.call(document.querySelectorAll('.is--version'));
versionList.forEach((element: Element) => {
	element.innerText = data.tag_name;
	// const tabTrigger = new Tab(triggerElement);
	// triggerElement.addEventListener('click', (event: { preventDefault: () => void }) => {
	// 	event.preventDefault();
	// 	tabTrigger.show();
	// });
});
