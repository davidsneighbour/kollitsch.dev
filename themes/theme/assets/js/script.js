import 'web-vitals-element';
import './scripts/keyboard-layout.js';
import './scripts/theme-toggle.js';
import './scripts/theme-changes.js';

// import bootstrap scripts
import './scripts/bs-tabs.js';
import './scripts/bs-tooltips.js';

// @ts-ignore - importing parameters from GoHugo
// import * as params from '@params';

// import stylesheet
import "../scss/style.scss";

// console.log(params);

// import custom elements
import ClickSpark from './components/click-effect.js';
customElements.define("click-effect", ClickSpark);
