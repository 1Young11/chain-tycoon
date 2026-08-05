import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'

export default [
   { ignores: ['dist/**', 'node_modules/**', 'server/**', 'src/.eslintrc.cjs'] },
   js.configs.recommended,
   ...tseslint.configs.recommended,
   ...vue.configs['flat/essential'],
   {
      files: ['src/**/*.{js,ts,vue}'],
      languageOptions: {
         globals: globals.browser,
         parserOptions: { parser: tseslint.parser },
      },
      rules: {
         '@typescript-eslint/no-explicit-any': 'off',
         'vue/multi-word-component-names': 'off',
      },
   },
]
