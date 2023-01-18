const links = require('../../../public/links.json');

const items = links.links;

// see discourse.gohugo.io/t/audit-your-published-site-for-problems/35184
//
// <!-- raw HTML omitted -->
// By default, Hugo strips raw HTML from your markdown prior to rendering,
// and leaves this HTML comment in its place.
//
// ZgotmplZ
// ZgotmplZ is a special value that indicates that unsafe content reached
// a CSS or URL context at runtime.
// For more information see https://pkg.go.dev/html/template.
//
// HAHAHUGO
// Under conditions too complex to explain in this article, a rendered
// shortcode may include all or a portion of the string HAHAHUGOSHORTCODE
// in either uppercase or lowercase. This is difficult to detect in all
// cicumstances because, depending on a variety of factors, the rendered
// shortcode may include H, HA, HAH, HAHA, HAHAH, HAHAHU, HAHAHUG,
// HAHAHUGO, etc. A case-insensitive search of the output for HAHAHUGO is
// likely to catch the majority of cases without producing false positives.
//
// [i18n]
// This is the placeholder produced instead of the default value or an
// empty string if a translation is missing.

describe('Testing layouts', () => {
	items.forEach((route): string => {
		const testName = `${route} has no common Hugo issues on load`;
		it(testName, () => {
			cy.visit(route);
			cy.get('html').should('not.contain', 'ZgotmplZ');
			cy.get('html').should('not.contain', '<!-- raw HTML omitted -->');
			cy.get('html').should('not.contain', 'HAHAHUGO');
			cy.get('html').should('not.contain', '[i18n]');
		});
	});
});
