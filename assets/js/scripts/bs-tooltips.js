// import { createPopper } from '@popperjs/core';
import { Tooltip, Dropdown } from 'bootstrap';

// Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = Array.from(tooltipTriggerList).map(function (tooltipTriggerEl) {
  return new Tooltip(tooltipTriggerEl);
});

const dropdownElementList = document.querySelectorAll('.dropdown-toggle')
const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new Dropdown(dropdownToggleEl))
