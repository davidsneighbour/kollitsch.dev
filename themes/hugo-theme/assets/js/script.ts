
import { createRoot } from 'react-dom/client';

import 'web-vitals-element';
import './scripts/logger.js';
import './scripts/back-to-top.js';
import './scripts/version.js';

// import bootstrap scripts
import './scripts/bs-collapsibles.js';
import './scripts/bs-tabs.js';
import './scripts/bs-tooltips.js';

// import react components
import { Profile } from './components/sample.js';

const domNode = document.getElementById('reacttest');
const root = createRoot(domNode);
root.render('<Profile />');
