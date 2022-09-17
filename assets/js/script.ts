import Alpine from 'alpinejs';
import 'web-vitals-element';
import 'libs/liteyoutube/lite-yt-embed';
import './components/logger.ts';
import './components/back-to-top.ts';
import './components/version.ts';

// import bootstrap scripts
import './components/bs-collapsibles.ts';
import './components/bs-tabs.ts';
import './components/bs-tooltips.ts';

// @ts-ignore
window.Alpine = Alpine;
Alpine.start();
