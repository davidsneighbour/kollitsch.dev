import Alpine from 'alpinejs';
import * as Popper from "@popperjs/core";
import { Collapse, Tab, Tooltip } from 'bootstrap';
import 'web-vitals-element';
// import 'dotenv/config'
// import "./components/search.ts";

// const { ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX_NAME } = process.env;

// change Giscus theme
// function changeGiscusTheme(theme = 'dark_dimmed') {
//   let scheme = 'dark_dimmed';
// 	if (theme === 'light') {
// 		scheme = 'light';
// 	}

// 	function sendMessage(message: { setConfig: { theme: string } }) {
// 		const iframe = document.querySelector('iframe.giscus-frame') as HTMLIFrameElement;
// 		if (iframe) {
// 			// @ts-ignore
// 			iframe.contentWindow.postMessage({ giscus: message }, 'https://giscus.app');
// 		}
// 	}

// 	sendMessage({
// 		setConfig: {
// 			theme: scheme,
// 		},
// 	});
// }

// @ts-ignore
window.Alpine = Alpine;

// themechanger
// Alpine.store('theme', {
// 	mode: 'dark',

// 	init() {
// 		const mode = localStorage.theme;
// 		if (mode !== undefined) {
// 			this.set(localStorage.theme);
// 		} else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
// 			this.set('light');
// 		} else {
// 			this.set('dark');
// 		}
// 	},

// 	set(mode: string) {
// 		this.mode = mode;
// 		localStorage.theme = this.mode;
// 		changeGiscusTheme(mode);
// 		setTimeout(changeGiscusTheme, 2000, mode);
// 	},
// });

Alpine.start();

// Bootstrap Tabs
const triggerTabList = Array.prototype.slice.call(document.querySelectorAll('#myTab button'));
triggerTabList.forEach((triggerElement: Element) => {
	const tabTrigger = new Tab(triggerElement);
	triggerElement.addEventListener('click', (event: { preventDefault: () => void }) => {
		event.preventDefault();
		tabTrigger.show();
	});
});

// Bootstrap Collapsibles
const collapseElementList = Array.prototype.slice.call(document.querySelectorAll('.collapse'));
collapseElementList.map(function collapsibles(collapseElement: Element) {
	return new Collapse(collapseElement, {
		toggle: false,
	}).hide();
});

// Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))

// Algolia search
// document.addEventListener('alpine:init', () => {
// 	Alpine.data('app', () => ({
// 		init() {
// 			let client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
// 			this.index = client.initIndex(ALGOLIA_INDEX_NAME);
// 			this.searchReady = true;
// 		},
// 		index: null,
// 		term: '',
// 		searchReady: false,
// 		noResults: false,
// 		results: null,
// 		totalHits: null,
// 		resultsPerPage: null,
// 		async search() {
// 			if (this.term === '') return;
// 			this.noResults = false;
// 			console.log(`search for ${this.term}`);

// 			//          let rawResults = await this.index.search(this.term);
// 			let rawResults = await this.index.search(this.term, {
// 				attributesToSnippet: ['content']
// 			});

// 			if (rawResults.nbHits === 0) {
// 				this.noResults = true;
// 				return;
// 			}
// 			this.totalHits = rawResults.nbHits;
// 			this.resultsPerPage = rawResults.hitsPerPage;
// 			this.results = rawResults.hits.map(h => {
// 				h.snippet = h._snippetResult.content.value;
// 				h.date = new Intl.DateTimeFormat('en-us').format(new Date(h.date));
// 				return h;
// 			});
// 		}
// 	}))
// });
