export default {

  extends: 'stylelint-config-recommended-vue',
  // overrides: [
  //   {
  //     files: ['**/*.vue'],
  //     extends: ['stylelint-config-recommended-vue/css'],
  //   },
  // ],
  // overrides: [
  //   {
  //     files: ['**/*.vue'],
  //     customSyntax: 'postcss-html',
  //   },
  // ],
  rules: {
  //   // Allow Tailwind v4 at-rules
    'at-rule-no-unknown': [true, { ignoreAtRules: ['theme', 'custom-variant', 'tailwind'] }],
  },
  ignoreFiles: [
    '**/.nuxt/**',
    '**/dist/**',
    '**/public/**',
    '**/node_modules/**',
  ],
}
