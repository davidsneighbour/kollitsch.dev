// eslint-disable-next-line import/no-extraneous-dependencies
const htmlvalidate = require('cypress-html-validate/dist/plugin');
const loadConfig = require('@davidsneighbour/cypress-config');
require('dotenv').config();

const { PORT } = process.env;
const { IP } = process.env;

module.exports = (on, config) => {
  htmlvalidate.install(on);
  const configuration = loadConfig(config.configFile);
  configuration.baseUrl = `http://${IP}:${PORT}`;
  return configuration;
};
