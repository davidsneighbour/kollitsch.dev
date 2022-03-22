const fs = require('node:fs');
const path = require('node:path');

const defaults = fs.readFileSync(path.join(__dirname, '/defaults.json'));
const defaultConfiguration = JSON.parse(defaults.toString());

const files = fs.readdirSync(path.join(__dirname, '/types/'));

let typeConfiguration = {};

files.forEach(function mergeConfigs(value) {
  const data = fs.readFileSync(path.join(__dirname, `/types/${value}`));
  typeConfiguration = {
    ...typeConfiguration,
    ...JSON.parse(data),
  };
});

fs.writeFileSync(
  'frontmatter.json',
  `${JSON.stringify(
    {
      ...defaultConfiguration,
      ...typeConfiguration,
    },
    undefined,
    2
  )}\n`
);
