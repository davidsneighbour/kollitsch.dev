const debug = function() {
  if (!window.console || !console.log) {
    return;
  }
  return Function.prototype.bind.call(console.log, console);
}();
