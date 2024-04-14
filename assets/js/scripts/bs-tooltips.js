var Popper = require('@popperjs/core');
var Tooltip = require('bootstrap').Tooltip;

// Bootstrap Tooltips
var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
var tooltipList = Array.from(tooltipTriggerList).map(function (tooltipTriggerEl) {
  return new Tooltip(tooltipTriggerEl);
});
