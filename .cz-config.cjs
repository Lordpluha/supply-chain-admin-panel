/**
 * The commitizen prompt. Offers exactly what commitlint.config.js accepts, so
 * `pnpm commit` cannot produce a message the commit-msg hook then rejects.
 *
 * CommonJS on purpose: cz-customizable loads this with `require()`, and on an
 * ES module that returns `{ default }`, so every prompt came up empty and the
 * CLI died with "You must provide a `choices` parameter".
 */
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     a capability the operator can see' },
    { value: 'fix', name: 'fix:      a defect repaired' },
    { value: 'refactor', name: 'refactor: behaviour unchanged, structure improved' },
    { value: 'perf', name: 'perf:     a measured performance improvement' },
    { value: 'style', name: 'style:    formatting only, no logic' },
    { value: 'test', name: 'test:     tests added or corrected' },
    { value: 'docs', name: 'docs:     documentation, .claude/, README' },
    { value: 'build', name: 'build:    build tooling, dependencies, Docker' },
    { value: 'ci', name: 'ci:       pipelines and hooks' },
    { value: 'chore', name: 'chore:    housekeeping that fits nothing above' },
    { value: 'revert', name: 'revert:   reverts a previous commit' },
  ],
  scopes: [
    { name: 'dashboard' },
    { name: 'map' },
    { name: 'countries' },
    { name: 'products' },
    { name: 'facilities' },
    { name: 'production' },
    { name: 'users' },
    { name: 'roles' },
    { name: 'audit' },
    { name: 'auth' },
    { name: 'i18n' },
    { name: 'theme' },
    { name: 'ui' },
    { name: 'api' },
    { name: 'mocks' },
    { name: 'storybook' },
    { name: 'docker' },
    { name: 'claude' },
    { name: 'deps' },
  ],
  messages: {
    type: 'What kind of change is this?',
    scope: 'Which area does it touch?',
    subject: 'Imperative, lower case, no trailing period (max 72 chars):\n',
    body: 'Why was this needed? Wrap at 100. Use "|" for a new line:\n',
    breaking: 'Breaking changes, and how to migrate:\n',
    footer: 'Issues this closes, e.g. #31:\n',
    confirmCommit: 'Commit this?',
  },
  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix', 'refactor'],
  subjectLimit: 72,
  skipQuestions: ['footer'],
}
