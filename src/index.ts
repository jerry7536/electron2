import { useIpcRenderer } from 'typesafe-electron-ipc/renderer'
import type { IpcSchema } from '../electron/ipc'

const data1 = 'data1'
console.log('hello world \" \' \` 1')
console.log(`test \" \' \` 1${data1}end`)

const renderer = useIpcRenderer<IpcSchema>()

renderer.invoke('info').then(console.log)
const div = document.querySelector('div')!
renderer.on('msg', (_, { transferred }) => {
  div.textContent = `transferred: ${transferred / (2 << 10)} KB`
})
