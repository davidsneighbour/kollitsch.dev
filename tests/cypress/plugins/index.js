// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
const htmlvalidate = require('cypress-html-validate/dist/plugin');

module.exports = (on) => {
  on('task', {
    seedRisks() {
      console.log('sdjdsj'); // just a placeholder
    },
  });
};



module.exports = (
  /** @type {(action: string, arg: Record<string, Function>) => void} */ on
) => {
  /* html-validate configuration */
  const config = {
    rules: {},
  };
  /* plugin options */
  const options = {
    exclude: [],
    include: [],
    formatter(messages) {
      console.log(messages);
    },
  };
  htmlvalidate.install(on, config, options);
};

// noinspection JSUnresolvedVariable
module.exports = (
  /** @type {any} */ on,
  /** @type {{ configFile: any; }} */ config
) =>
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-var-requires
  require('@dnb-org/cypress-config')(config.configFile);
