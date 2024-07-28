import { initApp } from 'electron-incremental-update'
import { GitHubProvider } from 'electron-incremental-update/provider'
import { handleUnexpectedErrors } from 'electron-incremental-update/utils'

handleUnexpectedErrors(console.error)
initApp({
  updater: {
    provider: new GitHubProvider({
      user: 'jerry7536',
      repo: 'electron2',
    }),
  },
  beforeStart(mainFilePath, logger) {
    logger?.debug(mainFilePath)
  },
})
