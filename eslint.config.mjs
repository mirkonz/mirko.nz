import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'
import tailwindcss from 'eslint-plugin-tailwindcss'

const tailwindConfigPath = `${dirname(fileURLToPath(import.meta.url))}/app/tailwind.config.mjs`
const tailwindCssConfigPath = `${dirname(fileURLToPath(import.meta.url))}/app/assets/css/main.css`

export default antfu({
  vue: true,
  nuxt: true,
  typescript: true,
  ignores: [
    'node_modules',
    'dist',
    'public',
    '.nuxt',
    '.output',
    'coverage',
  ],
}, {
  plugins: {
    tailwindcss,
  },
  settings: {
    tailwindcss: {
      config: tailwindConfigPath,
      cssConfigPath: tailwindCssConfigPath,
    },
  },
},
// Filename casing rules
{
  rules: {
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/enforces-negative-arbitrary-values': 'warn',
    'tailwindcss/enforces-shorthand': 'warn',
    'tailwindcss/migration-from-tailwind-2': 'off',
    'tailwindcss/no-arbitrary-value': 'off',
    'tailwindcss/no-custom-classname': 'off',
    'tailwindcss/no-contradicting-classname': 'error',

    'unicorn/filename-case': [
      'error',
      { cases: { kebabCase: true, pascalCase: true } },
    ],

    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 2,
      },
      multiline: {
        max: 1,
      },
    }],
  },
},

// Prefer kebab-case specifically within Nuxt pages directory
{
  files: ['app/pages/**/*.vue'],
  rules: {
    'unicorn/filename-case': ['error', { cases: { kebabCase: true } }],
  },
},

// Allow conventional README capitalization
{
  files: ['README.md'],
  rules: {
    'unicorn/filename-case': 'off',
  },
})
