// @ts-ignore: No type declarations available for this package
var install = require('@github/hotkey').install;

var _loop = function (el) {
  install(el, el.dataset.hotkey);
};

for (var _i = 0, _a = document.querySelectorAll('[data-hotkey]'); _i < _a.length; _i++) {
  var el = _a[_i];
  _loop(el);
}

// click event for posts on post overviews
// @todo fix implementation
// var triggerList = Array.prototype.slice.call(document.querySelectorAll('.is--hotkey-post'));
// triggerList.forEach(function (triggerElement) {
//   triggerElement.addEventListener('click', function (event) {
//     event.preventDefault();
//     window.location.href = triggerElement.dataset.link ?? '';
//   });
// });
