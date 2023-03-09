const links = require('../../../public/links.json');
const config = require('../../html-validator/config.json');

const items = links.links;

const randomizer = (inArray: any, num: number) => {
  const shuffled = [...inArray].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

describe('Checking layouts', () => {
  items.forEach((route: string) => {
    const testName = `${route} has no detectable html violations on load`;
    it(testName, () => {
      cy.visit(route);
      cy.htmlvalidate(config);
    });
  });
});
