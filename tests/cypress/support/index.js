/* eslint-disable import/no-extraneous-dependencies */
import 'cypress-axe';
import 'cypress-html-validate/dist/commands';
import './commands';

// @ts-ignore
before(() => {
  // root-level hook
  // runs once before all tests
});

// @ts-ignore
beforeEach(() => {
  // root-level hook
  // runs before every test block
});

// @ts-ignore
afterEach(() => {
  // runs after each test block
  // @ts-ignore
  //cy.htmlvalidate();
});

// @ts-ignore
after(() => {
  // runs once all tests are done
});

// @ts-ignore
describe('Hooks', () => {
  // @ts-ignore
  before(() => {
    // runs once before all tests in the block
  });

  // @ts-ignore
  beforeEach(() => {
    // runs before each test in the block
  });

  // @ts-ignore
  afterEach(() => {
    // runs after each test in the block
  });

  // @ts-ignore
  after(() => {
    // runs once after all tests in the block
  });
});
