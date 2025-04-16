import { Tab } from 'bootstrap';

const debug = function () {
  if (!window.console || !console.log) {
    return;
  }
  return Function.prototype.bind.call(console.log, console);
}();

const triggerTabList = document.querySelectorAll('#infotabs-nav button')
triggerTabList.forEach(triggerEl => {
  const tabTrigger = new Tab(triggerEl);
  triggerEl.addEventListener('click', event => {
    event.preventDefault();
    tabTrigger.show();
  });
});
