import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import process from 'node:process'

export default defineConfig([
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.app.json',
                tsconfigRootDir: process.cwd(),
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                React: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            react: pluginReact,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...pluginReact.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        ignorePatterns: [
            'cypress.config.ts',
        'cypress/**/*.ts',
        ],
  files: ['crossbrowser.test.js'],
  ignores: true,
    }
])
