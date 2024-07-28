// const { defineEslintConfig } = require('@subframe7536/eslint-config')

// module.exports = defineEslintConfig({
//   ignores: ['./dist-electron', './dist-entry'],
//   type: 'app',
// })
import { defineEslintConfig } from '@subframe7536/eslint-config'

export default defineEslintConfig({
  ignores: ['./dist-electron', './dist-entry'],
  type: 'app',
})
