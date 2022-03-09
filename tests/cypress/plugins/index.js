/* eslint-disable global-require, import/no-extraneous-dependencies, @typescript-eslint/no-var-requires */
const htmlvalidate = require('cypress-html-validate/dist/plugin');
const loadConfig = require('@dnb-org/cypress-config');

module.exports = (on, config) => {
  htmlvalidate.install(on);
  return loadConfig(config.configFile);
};
