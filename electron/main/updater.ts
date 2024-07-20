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

  updater.checkUpdate()
  updater.on('update-available', console.log)
  updater.on('update-unavailable', console.log)
  updater.on('download-progress', (data) => {
    console.log(data)
    main.send(BrowserWindow.getAllWindows()[0], 'msg', data)
  })
  updater.on('update-downloaded', () => {
    updater.quitAndInstall()
  })
  main.on('update::checkAndInstall', async () => {
    const result = await updater.checkUpdate()
    if (!result) {
      return
    }
    const { response } = await dialog.showMessageBox({
      type: 'info',
      buttons: ['Download', 'Later'],
      message: 'Application update available!',
    })
    if (response !== 0) {
      return
    }
    await updater.downloadUpdate()
  })
  const sourcePath = getPathFromAppNameAsar()
  const backPath = `${sourcePath}.bak`
  main.on('update::restore', async () => {
    console.log('restore')
    // existsSync(backPath) && await unzipFile(backPath, sourcePath)
    renameSync(backPath, `${backPath}1`)
  })
}
