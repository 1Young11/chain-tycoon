module.exports = {
   root: true,
   env: { browser: true, es2022: true, node: true },
   extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      '@typescript-eslint/recommended',
      'prettier'
   ],
   parser: 'vue-eslint-parser',
   parserOptions: {
      parser: '@typescript-eslint/parser',
      ecmaVersion: 'latest',
      sourceType: 'module'
   },
   rules: {
      'vue/multi-word-component-names': 'off', // разрешаем App.vue
      '@typescript-eslint/no-explicit-any': 'error', // запрещаем any
      'vue/component-api-style': ['error', ['script-setup']] // только script setup
   }
}