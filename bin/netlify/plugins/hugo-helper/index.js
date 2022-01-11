// based on https://github.com/cdeleeuwe/netlify-plugin-hugo-cache-resources

const { join } = require('path');
const glob = require('glob');

const getResourcesDirectory = ({ inputs }) => {
  return join(inputs.srcdir, 'resources');
};

const getDebug = ({ inputs }) => {
  return inputs.debug;
};

const getCache = ({ inputs }) => {
  return inputs.cache;
};

const printList = (items, inputs) => {
  if (getDebug({ inputs }) === true) {
    console.log('---');
    items.forEach((item, index) => {
      console.log(`${index + 1}. ${item}`);
    });
  }
};

module.exports = {
  async onPreBuild({ utils, inputs }) {
    const path = getResourcesDirectory({ inputs });
    const loadCache = getCache({ inputs });
    if (loadCache) {
      const success = await utils.cache.restore(path);
      console.log(`Checking if resources exist at "${path}"`);

      if (success) {
        const cachedFiles = await utils.cache.list(path);

        const files = [
          ...new Set(
            cachedFiles.flatMap((c) => glob.sync(`${c}/**/*`, { nodir: true }))
          ),
        ];

        console.log(
          `Restored cached resources folder. Total files: ${files.length}`
        );
        printList(files, inputs);
      } else {
        console.log(`No cache found for resources folder`);
      }
    }
  },

  async onPostBuild({ utils, inputs }) {
    const path = getResourcesDirectory({ inputs });
    const loadCache = getCache({ inputs });
    if (loadCache) {
      const success = await utils.cache.save(path);

      if (success) {
        const cached = await utils.cache.list(path);
        const files = [
          ...new Set(
            cached.flatMap((c) => glob.sync(`${c}/**/*`, { nodir: true }))
          ),
        ];
        console.log(
          `Saved resources folder to cache. Total files: ${files.length}`
        );
        printList(files, inputs);
      } else {
        console.log(`No resources folder cached`);
      }
    }
  },
};
