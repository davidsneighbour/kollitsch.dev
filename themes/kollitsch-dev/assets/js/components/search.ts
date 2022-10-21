import Alpine from 'alpinejs';
import algoliasearch from 'algoliasearch';
const dotenv = require('dotenv');
dotenv.config();

// Algolia client credentials
const { ALGOLIA_APP_ID } = process.env;
const { ALGOLIA_API_KEY } = process.env;
const { ALGOLIA_INDEX_NAME } = process.env;

// @ts-ignore
window.Alpine = Alpine;
document.addEventListener('alpine:init', () => {
  Alpine.data('app', () => ({
    init() {
      let client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
      this.index = client.initIndex(ALGOLIA_INDEX_NAME);
      this.searchReady = true;
    },
    index: null,
    term: '',
    searchReady: false,
    noResults: false,
    results: null,
    totalHits: null,
    resultsPerPage: null,
    async search() {
      if (this.term === '') return;
      this.noResults = false;
      console.log(`search for ${this.term}`);

      //          let rawResults = await this.index.search(this.term);
      let rawResults = await this.index.search(this.term, {
        attributesToSnippet: ['content']
      });

      if (rawResults.nbHits === 0) {
        this.noResults = true;
        return;
      }
      this.totalHits = rawResults.nbHits;
      this.resultsPerPage = rawResults.hitsPerPage;
      this.results = rawResults.hits.map(h => {
        h.snippet = h._snippetResult.content.value;
        h.date = new Intl.DateTimeFormat('en-us').format(new Date(h.date));
        return h;
      });
    }
  }))
});
