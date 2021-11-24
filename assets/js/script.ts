import Alpine from 'alpinejs';
import { Tab } from 'bootstrap';
import './components/menu';
import { preloader } from './components/preloader';

// preloader
preloader("GNAH");

// alpine
Alpine.start()

// tabs
var triggerTabList = [].slice.call(document.querySelectorAll('#myTab button'))
triggerTabList.forEach(function (triggerEl) {
  var tabTrigger = new Tab(triggerEl)
  triggerEl.addEventListener('click', function (event) {
    event.preventDefault()
    tabTrigger.show()
  })
})

// google analytics
var element = document.querySelector('body');
var analyticsID = element.getAttribute('data-ganalytics');
if (analyticsID !== null) {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + analyticsID;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', analyticsID);

}
