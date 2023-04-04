ready(function () {
  "use strict";

  var elementExists = document.getElementById("search-box");

  if (elementExists) {

    var search = instantsearch({
      appId: appId,
      apiKey: apiKey,
      indexName: indexName,
      numberLocale: numberLocale,
      routing: true,
      searchFunction: function (helper) {
        /**
         * do not render a search on page load
         */
        // if (helper.state.query === "") {
        // 	return;
        // }
        helper.search();
      }
    });

    let template = "<article id=\"{{{objectID}}}\">";
    template += "<header class=\"title\">";
    template += "<h2 class=\"entry-title\">";
    template += "<a href=\"{{{permalink}}}\">";
    template += "{{{title}}}";
    template += "</a>";
    template += "</h2>";
    template += "<div class=\"meta\">";
    template += "<div class=\"row\">";
    template += "<span class=\"col text-sm-left text-xs-left text-md-end\">";
    template += "<time class=\"post-date updated timestamp\" datetime=\"{{{publishdate}}}\">";
    template += "{{{date}}}";
    template += "</time>";
    template += "</span>";
    template += "</div>";
    template += "</div>";
    template += "</header>";
    template += "<div class=\"text entry-content\">";
    template += "{{{summary}}}";
    template += "</div>";
    template += "</article>";

    /*
     * @see https://community.algolia.com/instantsearch.js/v2/widgets/searchBox.html
     */
    search.addWidget(
      instantsearch.widgets.searchBox({
        container: "#search-box",
        placeholder: "Weblog durchsuchen...",
        magnifier: false,
        loadingIndicator: false,
        poweredBy: true,
        reset: false,
        wrapInput: false,
        cssClasses: {
          input: "form-control"
        },
        render: function () {
          jQuery(".timestamp").each(function () {
            var $this = jQuery(this);
            moment.locale("de");
            var day = moment.unix($this.text);
            $this.text = "Am " + day.format("dddd, MMMM Do YYYY, h:mm:ss a");
          });
        }
      })
    );

    /**
     * @see https://community.algolia.com/instantsearch.js/v2/widgets/analytics.html
     */
    // search.addWidget(
    // 	instantsearch.widgets.analytics({
    // 		pushFunction: function(formattedParameters, state, results) {
    // 			// Google Analytics
    // 			// window.ga("set", "page", "/suche/?query=" + state.query + "&" + formattedParameters + "&numberOfHits=" + results.nbHits);
    // 			// window.ga("send", "pageView");
    //
    // 			// GTM
    // 			//dataLayer.push({"event": "search", "query": state.query, "parameters": formattedParameters, "hits": results.nbHits});
    // 		}
    // 	})
    // );

    /**
     * @see https://community.algolia.com/instantsearch.js/v2/widgets/pagination.html
     */
    search.addWidget(
      instantsearch.widgets.pagination({
        container: ".pagination-container",
        maxPages: 20,
        scrollTo: false,
        showFirstLast: false,
        cssClasses: {
          root: "pagination justify-content-center",
          item: "page-item",
          link: "page-link",
          page: "",
          previous: "",
          next: "",
          first: "",
          last: "",
          active: "page-item active",
          disabled: "page-item disabled"
        }
      })
    );

    /**
     * @see https://community.algolia.com/instantsearch.js/v2/widgets/hits.html
     */
    search.addWidget(
      instantsearch.widgets.hits({
        container: "#hits",
        templates: {
          empty: "No results",
          item: template
        }
      })
    );

    /**
     * @see https://community.algolia.com/instantsearch.js/v2/widgets/hitsPerPageSelector.html
     */
    search.addWidget(
      instantsearch.widgets.hitsPerPageSelector({
        container: "#hits-per-page-selector",
        items: [
          { value: 10, label: "10 pro Seite", default: true },
          { value: 20, label: "20 pro Seite" },
          { value: 30, label: "30 pro Seite" },
        ],
        cssClasses: {
          select: "form-control"
        },
        autoHideContainer: false
      })
    );

    /**
     * @see https://community.algolia.com/instantsearch.js/v2/widgets/stats.html
     */
    search.addWidget(
      instantsearch.widgets.stats({
        container: "#stats-container"
      })
    );

    search.start();

  }

});
