import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@platform-system/design-ui/components/*',
                '@platform-system/design-ui/theme-provider',
                '@platform-system/design-ui/use-theme',
                '@platform-system/design-ui/branding',
                '@platform-system/design-ui/lib/cn',
                '@platform-system/design-ui/ThemeProvider',
                '@platform-system/design-ui/useTheme',
              ],
              message: 'Import from the root package "@platform-system/design-ui" instead.',
            },
          ],
        },
      ],
    },
  },
])
