import 'web-vitals-element';
import './scripts/keyboard-layout';
// import './scripts/theme-toggle';
import './scripts/theme-changes';

// import bootstrap scripts
import './scripts/bs-tabs.js';
import './scripts/bs-tooltips.js';

// @ts-ignore - importing parameters from GoHugo
import * as params from '@params';

console.log(params);

// import custom elements
import ClickSpark from './components/click-effect';
customElements.define("click-effect", ClickSpark);
