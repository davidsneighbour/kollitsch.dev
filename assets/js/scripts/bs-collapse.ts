import { Collapse } from 'bootstrap';
const collapseElementList = document.querySelectorAll('.collapse')
const collapseList = [...collapseElementList].map(collapseEl => new Collapse(collapseEl))
