import { Collapse } from 'bootstrap';

// Bootstrap Collapsibles
const collapseElementList = Array.prototype.slice.call(document.querySelectorAll('.collapse'));
collapseElementList.forEach((collapseElement: Element) => new Collapse(collapseElement, {
	toggle: false,
}).hide());
