import sharedConfig from '@davidsneighbour/remark-config';

const remarkConfig = {
  extends: sharedConfig,
  plugins: [
    [
      ['remark-lint-write-good', false],

      [
        'remark-lint-no-undefined-references',
        {
          allow: ['!NOTE', '!TIP', '!CAUTION', '!IMPORTANT', '!WARNING'],
        },
      ],
    ],
  ],
};

export default remarkConfig;
