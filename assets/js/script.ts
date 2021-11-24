import Alpine from 'alpinejs';
import { Tab } from 'bootstrap';
import './components/menu.ts';

// alpine
Alpine.start();

// tabs
const triggerTabList = [].slice.call(
  document.querySelectorAll('#myTab button')
);
triggerTabList.forEach((triggerEl) => {
  const tabTrigger = new Tab(triggerEl);
  triggerEl.addEventListener('click', (event) => {
    event.preventDefault();
    tabTrigger.show();
  });
});

// google analytics
function gtag() {
  /* eslint-disable prefer-rest-params */
  dataLayer.push(arguments);
}
const element = document.querySelector('body');
const analyticsID = element.getAttribute('data-ganalytics');
if (analyticsID !== null) {
  const ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsID}`;
  const s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
  window.dataLayer = window.dataLayer || [];
  gtag('js', new Date());
  gtag('config', analyticsID);
}
