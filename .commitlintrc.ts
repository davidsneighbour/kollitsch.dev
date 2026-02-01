// @see https://github.com/Zhengqbbb/cz-git
import type { CommitizenGitOptions, UserConfig } from 'cz-git';
import { items as shared } from './src/config/shared-config.ts';

if (!Array.isArray(shared) || shared.length === 0) {
  console.error('✖ `shared-config.ts` not found or is empty.');
  process.exit(1);
}

// cz-git prompt messages
const promptMessages: CommitizenGitOptions['messages'] = {
  body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
  breaking:
    'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
  confirmCommit: 'Are you sure you want to proceed with the commit above?',
  customFooterPrefixs: 'Input ISSUES prefix:',
  customScope: 'Denote the SCOPE of this change:',
  footer: 'List any ISSUES by this change. E.g.: #31, user/repo#32, #34:\n',
  footerPrefixsSelect:
    'Select the ISSUES type of changeList by this change (optional):',
  scope: 'Denote the SCOPE of this change (optional):',
  subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
  type: "Select the type of change that you're committing:",
};

// cz-git types array
const czTypes = shared.map(({ type, description }) => ({
  name: `${type}: ${description}`,
  value: type,
}));

const commitlintConfig: UserConfig = {
  prompt: {
    allowBreakingChanges: ['feat', 'fix'],
    allowCustomIssuePrefixs: true,
    allowCustomScopes: true,
    allowEmptyIssuePrefixs: true,
    allowEmptyScopes: true,
    breaklineChar: '|',
    breaklineNumber: 100,
    confirmColorize: true,
    customIssuePrefixsAlias: 'custom',
    customIssuePrefixsAlign: 'top',
    customScopesAlias: 'custom',
    customScopesAlign: 'bottom-top',
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
    emptyIssuePrefixsAlias: 'skip',
    emptyScopesAlias: 'empty',
    issuePrefixs: [
      { name: 'closed:   ISSUE has been resolved', value: 'closed' },
      { name: 'see:      ISSUE is connected to this commit', value: 'see' },
    ],
    markBreakingChangeMode: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: 72,
    messages: promptMessages,
    minSubjectLength: 0,
    scopeOverrides: {
      build: ['deps', 'vscode'],
      config: ['settings', 'ai', 'ts', 'lint', 'workspace'],
      content: ['new', 'fix', 'schema', 'update'],
      theme: ['fix', 'feat'],
    },
    scopes: [],
    skipQuestions: [],
    // see https://cz-git.qbb.sh/config/show#themecolorcode
    themeColorCode: '38;2;255;149;128',
    types: czTypes,
    upperCaseSubject: false,
    useEmoji: false,
  },
  rules: {
    // overriding commitlint rules, e.g.:
    // 'header-max-length': [2, 'always', 72],
    // @see https://commitlint.js.org/reference/rules.html
  },
};

export default commitlintConfig;
