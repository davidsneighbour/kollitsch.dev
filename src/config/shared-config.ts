export interface ChangeType {
  type: string;
  header: string;
  description: string;
}

export const items: ChangeType[] = [
  {
    description: 'A new feature (indicates minor release)',
    header: 'Features',
    type: 'feat',
  },
  { description: 'Content changes', header: 'Content', type: 'content' },
  { description: 'Theme changes', header: 'Theme', type: 'theme' },
  {
    description: 'Documentation only changes',
    header: 'Documentation',
    type: 'docs',
  },
  { description: 'Code refactoring', header: 'Refactors', type: 'refactor' },
  { description: 'Adding or fixing tests', header: 'Tests', type: 'test' },
  {
    description: 'Build or dependency changes',
    header: 'Build System',
    type: 'build',
  },
  { description: 'CI configuration changes', header: 'CI', type: 'ci' },
  { description: 'Other non-src/test changes', header: 'Chore', type: 'chore' },
  {
    description: 'Revert a previous commit',
    header: 'Reverts',
    type: 'revert',
  },
  {
    description: 'Configuration changes',
    header: 'Configuration',
    type: 'config',
  },
];
