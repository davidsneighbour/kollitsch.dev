const path = require('path');
const uuid = require('uuid');
require('dotenv').config({
  path: path.join(__dirname, `.env`)
});

module.exports = async (config) => {
  return {
    ...config,
    test: process.env.TESTING,
    dir: __dirname,
    id: uuid.v4(),
  }
};
