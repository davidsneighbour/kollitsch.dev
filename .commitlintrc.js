/** @type {import('cz-git').UserConfig} */
export default {
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
  },
  // https://cz-git.qbb.sh/guide/options-show.html
  prompt: {
    messages: {
      type: "Select the type of change that you're committing:",
      scope: 'Denote the SCOPE of this change (optional):',
      customScope: 'Denote the SCOPE of this change:',
      subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking:
        'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixsSelect:
        'Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefixs: 'Input ISSUES prefix:',
      footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },
    // https://github.com/sindresorhus/xterm-colors
    themeColorCode: '38;5;160',
    types: [
      { value: 'fix', name: 'fix:      A bug fix' },
      { value: 'feat', name: 'feat:     A new feature' },
      {
        value: 'docs',
        name: 'docs:     Documentation only changes',
      },
      {
        value: 'theme',
        name: 'theme:    Theme changes',
      },
      {
        value: 'refactor',
        name: 'refactor: A code change that neither fixes a bug nor adds a feature',
      },
      {
        value: 'test',
        name: 'test:     Adding missing tests or correcting existing tests',
      },
      {
        value: 'build',
        name: 'build:    Changes that affect the build system or external dependencies',
      },
      {
        value: 'ci',
        name: 'ci:       Changes to our CI configuration files and scripts',
      },
      {
        value: 'chore',
        name: "chore:    Other changes that don't modify src or test files",
      },
      {
        value: 'revert',
        name: 'revert:   Reverts a previous commit',
      },
    ],
    useEmoji: false,
    customScopesAlign: 'bottom-top',
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    scopeOverrides: {
      theme: ['fix', 'feat'],
      build: ['deps', 'deps-dev'],
    },
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    markBreakingChangeMode: true,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixs: [
      { value: 'closed', name: 'closed:   ISSUE has been resolved' },
      { value: 'see', name: 'see:      ISSUE is connected to this commit' },
    ],
    customIssuePrefixsAlign: 'top',
    emptyIssuePrefixsAlias: 'skip',
    customIssuePrefixsAlias: 'custom',
    allowCustomIssuePrefixs: true,
    allowEmptyIssuePrefixs: true,
    confirmColorize: true,
    maxHeaderLength: Number.POSITIVE_INFINITY,
    maxSubjectLength: Number.POSITIVE_INFINITY,
    minSubjectLength: 0,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
    // https://cz-git.qbb.sh/config/engineer.html
  },
};
