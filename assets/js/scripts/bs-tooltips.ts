// import { createPopper } from '@popperjs/core';
import { Tooltip } from 'bootstrap';

// Bootstrap Tooltips
var tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
var tooltipList = Array.from(tooltipTriggerList).map(function (tooltipTriggerEl) {
  return new Tooltip(tooltipTriggerEl);
});
