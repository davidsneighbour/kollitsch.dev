import Alpine from 'alpinejs';
import { Tab } from 'bootstrap';
import './components/menu.ts';

// alpine
Alpine.start();

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
