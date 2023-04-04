const data = require("../../data/build.json");
const versionList = Array.prototype.slice.call(document.querySelectorAll('.is--site-version a.version'));
versionList.forEach((element: Element) => {
	element.innerText = data.tag_name;
	element.href = data.html_url;
	element.parentNode.classList.add('d-inline-block');
	element.parentNode.classList.remove('d-none');
});
