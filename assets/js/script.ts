import './components/its-javascript.ts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Collapse, Tab } from 'bootstrap';
import 'web-vitals-element';
import './components/themeswitcher.ts';



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
