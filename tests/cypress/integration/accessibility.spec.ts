const links = require('../../../public/links.json');

const items = links.links;

const terminalLog = (violations) => {
  cy.task(
    'log',
    `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  );
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    })
  );
  cy.task('table', violationData);
};

describe('Component accessibility test', () => {
  items.forEach((route) => {
    const testName = `${route} has no detectable accessibility violations on load`;
    it(testName, () => {
      cy.visit(route);
      cy.injectAxe();
      cy.get('body').each((element, index) => {
        cy.checkA11y(
          'body',
          {
            runOnly: {
              type: 'tag',
              values: ['wcag21aa'],
            },
          },
          terminalLog
        );
      });

      cy.htmlvalidate();
    });
  });
});
