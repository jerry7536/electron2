import { exposeIpcRenderer } from 'typesafe-electron-ipc'

console.log('loading preload scripts...')

exposeIpcRenderer()
