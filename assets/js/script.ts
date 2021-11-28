import Alpine from 'alpinejs';
import { Tab } from 'bootstrap';
import './components/menu.ts';

// alpine
Alpine.start();

// tabs
const triggerTabList = [].slice.call(
  document.querySelectorAll('#myTab button')
);
triggerTabList.forEach((triggerEl: Element) => {
  const tabTrigger = new Tab(triggerEl);
  triggerEl.addEventListener(
    'click',
    (event: { preventDefault: () => void }) => {
      event.preventDefault();
      tabTrigger.show();
    }
  );
});
