/**
 * Conventional Commits, with the scope vocabulary this repo actually uses.
 * See .claude/rules/commit-style.md — the two must agree.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'dashboard',
        'map',
        'countries',
        'products',
        'facilities',
        'production',
        'users',
        'roles',
        'audit',
        'auth',
        'i18n',
        'theme',
        'ui',
        'api',
        'mocks',
        'storybook',
        'docker',
        'claude',
        'deps',
      ],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100],
  },
}
