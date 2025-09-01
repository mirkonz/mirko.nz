module.exports = {
  extends: [
    'stylelint-config-standard',
  ],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    // Allow Tailwind v4 at-rules
    'at-rule-no-unknown': [true, { ignoreAtRules: ['theme', 'custom-variant', 'tailwind'] }],
  },
  ignoreFiles: [
    '**/.nuxt/**',
    '**/dist/**',
    '**/public/**',
    '**/node_modules/**',
  ],
}

