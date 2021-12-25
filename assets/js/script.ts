import { Collapse, Tab } from 'bootstrap';
// eslint-disable-next-line import/no-unresolved,import/extensions
import './components/menu.ts';

// tabs
const triggerTabList = Array.prototype.slice.call(
  document.querySelectorAll('#myTab button')
);

triggerTabList.forEach((triggerElement: Element) => {
  const tabTrigger = new Tab(triggerElement);
  triggerElement.addEventListener(
    'click',
    (event: { preventDefault: () => void }) => {
      event.preventDefault();
      tabTrigger.show();
    }
  );
});

// collapsibles
const collapseElementList = Array.prototype.slice.call(
  document.querySelectorAll('.collapse')
);
collapseElementList.map(function collapsibles(collapseElement: Element) {
  return new Collapse(collapseElement);
});
