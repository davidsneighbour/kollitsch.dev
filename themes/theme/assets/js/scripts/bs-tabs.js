var Tab = require('bootstrap').Tab;

// Bootstrap Tabs
var triggerTabList = Array.prototype.slice.call(document.querySelectorAll('.is--codesample a'));
triggerTabList.forEach(function (triggerElement) {
  var tabTrigger = new Tab(triggerElement);
  triggerElement.addEventListener('click', function (event) {
    event.preventDefault();
    tabTrigger.show();
  });
});
