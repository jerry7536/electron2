import { useIpcRenderer } from 'typesafe-electron-ipc/renderer'
import type { IpcSchema } from '../electron/ipc'

console.log('hello world')

const renderer = useIpcRenderer<IpcSchema>()

renderer.invoke('info').then(console.log)
