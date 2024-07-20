import type { DownloadingInfo } from 'electron-incremental-update/provider'
import type {
  DefineIpcSchema,
  MainSend,
  RendererFetch,
  RendererSend,
} from 'typesafe-electron-ipc/define'

export type IpcSchema = DefineIpcSchema<{
  info: RendererFetch<null, string>
  msg: MainSend<DownloadingInfo>
  update: {
    checkAndInstall: RendererSend
    restore: RendererSend
  }
}>
