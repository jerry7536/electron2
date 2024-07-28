import { renameSync } from 'node:fs'
import type { Updater } from 'electron-incremental-update'
import { getAppVersion, getEntryVersion, getPathFromAppNameAsar } from 'electron-incremental-update/utils'
import { BrowserWindow, app, dialog } from 'electron'
import { useIpcMain } from 'typesafe-electron-ipc'
import type { IpcSchema } from '../ipc'

const main = useIpcMain<IpcSchema>()

main.handle('info', () => {
  return new Date().toLocaleDateString()
})

export function setupUpdater(updater: Updater) {
  console.table({
    [`${app.name}.asar path:`]: getPathFromAppNameAsar(),
    'app version:': getAppVersion(),
    'entry (installer) version:': getEntryVersion(),
    'electron version:': process.versions.electron,
  })

  updater.on('update-available', async ({ version }) => {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['Download', 'Later'],
      message: `v${version} update available!`,
    })
    if (response !== 0) {
      return
    }
    await updater.downloadUpdate()
  })
  updater.on('update-not-available', reason => console.log(reason))
  updater.on('download-progress', (data) => {
    console.log(data)
    main.send(BrowserWindow.getAllWindows()[0], 'msg', data)
  })
  updater.on('update-downloaded', () => {
    updater.quitAndInstall()
  })
  updater.checkForUpdates()
}
