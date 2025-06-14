export interface ChangeType {
  type: string;
  header: string;
  description: string;
}

export const items: ChangeType[] = [
  { type: 'content', header: 'Content', description: 'Content changes' },
  { type: 'theme', header: 'Theme', description: 'Theme changes' },
  { type: 'fix', header: 'Bug Fixes', description: 'A bug fix' },
  { type: 'feat', header: 'Features', description: 'A new feature' },
  {
    type: 'docs',
    header: 'Documentation',
    description: 'Documentation only changes',
  },
  { type: 'refactor', header: 'Refactors', description: 'Code refactoring' },
  { type: 'test', header: 'Tests', description: 'Adding or fixing tests' },
  {
    type: 'build',
    header: 'Build System',
    description: 'Build or dependency changes',
  },
  { type: 'ci', header: 'CI', description: 'CI configuration changes' },
  { type: 'chore', header: 'Chore', description: 'Other non-src/test changes' },
  {
    type: 'revert',
    header: 'Reverts',
    description: 'Revert a previous commit',
  },
  {
    type: 'config',
    header: 'Configuration',
    description: 'Configuration changes',
  },
];
