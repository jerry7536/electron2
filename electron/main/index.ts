import { join } from 'node:path'
import { Worker } from 'node:worker_threads'
import { BrowserWindow, app, shell } from 'electron'
import { disableHWAccForWin7, getPathFromAppNameAsar, getPathFromPreload, getPathFromPublic, isDev, isMac, loadPage, requireNative, setAppUserModelId, singleInstance } from 'electron-incremental-update/utils'
import { startupWithUpdater } from 'electron-incremental-update'
import { setupUpdater } from './updater'

disableHWAccForWin7()
setAppUserModelId(app.getName())
singleInstance()

let win: BrowserWindow | null = null

export default startupWithUpdater((updater) => {
  console.log(getPathFromAppNameAsar())
  async function createWindow() {
    win = new BrowserWindow({
      title: 'Main window',
      icon: getPathFromPublic('favicon.ico'),
      webPreferences: { preload: getPathFromPreload('index.js'), sandbox: false },
    })

    loadPage(win)
    if (isDev) {
      win.webContents.openDevTools()
    }

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) {
        shell.openExternal(url)
      }
      return { action: 'deny' }
    })
    // win.webContents.on('will-navigate', (event, url) => { }) #344
  }

  app.whenReady()
    .then(createWindow)
    .then(async () => console.log((await import('./external')).data))
    .then(() => setupUpdater(updater))
    .then(() => requireNative<typeof import('../native/db')>('db').test())
    .then(() => requireNative('image'))
    .then(() => {
      const worker = new Worker(join(__dirname, './worker.js'))
      worker.postMessage('')
      console.log('hello')
    })

  app.on('window-all-closed', () => {
    win = null
    if (!isMac) {
      app.quit()
    }
  })

  app.on('second-instance', () => {
    if (win) {
    // Focus on the main window if the user tried to open another
      if (win.isMinimized()) {
        win.restore()
      }
      win.focus()
    }
  })

  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
      allWindows[0].focus()
    } else {
      createWindow()
    }
  })
})
