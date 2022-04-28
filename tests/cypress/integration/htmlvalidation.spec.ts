const links = require('../../../public/links.json');
const items = links.links;

describe('Checking layouts', () => {
  items.forEach((route) => {
    const testName = `${route} has no detectable html violations on load`;
    it(testName, () => {
      cy.visit(route);
      cy.get('h1').should('contain', 'kollitsch.dev');
      cy.htmlvalidate();
    });
  });
});
