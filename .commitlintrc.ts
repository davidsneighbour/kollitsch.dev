// commitlint.config.ts

import type { UserConfig } from 'cz-git'
import { items as shared } from './src/scripts/shared-config.ts'

if (!Array.isArray(shared) || shared.length === 0) {
  console.error('✖ `shared-config.ts` did not export any items!')
  process.exit(1)
}

/** cz-git prompt messages */
const promptMessages: UserConfig['prompt']['messages'] = {
  type:                 "Select the type of change that you're committing:",
  scope:                'Denote the SCOPE of this change (optional):',
  customScope:          'Denote the SCOPE of this change:',
  subject:              'Write a SHORT, IMPERATIVE tense description of the change:\n',
  body:                 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
  breaking:             'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
  footerPrefixsSelect:  'Select the ISSUES type of changeList by this change (optional):',
  customFooterPrefixs:   'Input ISSUES prefix:',
  footer:               'List any ISSUES by this change. E.g.: #31, #34:\n',
  confirmCommit:        'Are you sure you want to proceed with the commit above?',
}

/** cz-git types array */
const czTypes = shared.map(({ type, description }) => ({
  value: type,
  name:  `${type}: ${description}`,
}))

/** @type {UserConfig} */
const commitlintConfig: UserConfig = {
  rules: {
    // your commitlint rules here, e.g.:
    // 'header-max-length': [2, 'always', 72],
  },
  prompt: {
    messages:            promptMessages,
    types:               czTypes,
    useEmoji:            false,
    themeColorCode:      '38;5;159',
    customScopesAlign:   'bottom-top',
    scopes:              [],
    allowCustomScopes:   true,
    allowEmptyScopes:    true,
    scopeOverrides:      { theme: ['fix','feat'], build: ['deps','deps-dev'] },
    customScopesAlias:   'custom',
    emptyScopesAlias:    'empty',
    upperCaseSubject:    false,
    markBreakingChangeMode: true,
    allowBreakingChanges:   ['feat','fix'],
    breaklineNumber:       100,
    breaklineChar:         '|',
    skipQuestions:         [],
    issuePrefixs: [
      { value: 'closed', name: 'closed:   ISSUE has been resolved' },
      { value: 'see',    name: 'see:      ISSUE is connected to this commit' },
    ],
    customIssuePrefixsAlign: 'top',
    emptyIssuePrefixsAlias:  'skip',
    customIssuePrefixsAlias: 'custom',
    allowCustomIssuePrefixs: true,
    allowEmptyIssuePrefixs:  true,
    confirmColorize:         true,
    maxHeaderLength:         Infinity,
    maxSubjectLength:        Infinity,
    minSubjectLength:        0,
    defaultBody:             '',
    defaultIssues:           '',
    defaultScope:            '',
    defaultSubject:          '',
  },
}

export default commitlintConfig
