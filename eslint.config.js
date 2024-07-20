const { defineEslintConfig } = require('@subframe7536/eslint-config')

module.exports = defineEslintConfig({
  ignores: ['./dist-electron', './dist-entry'],
  type: 'app',
})
