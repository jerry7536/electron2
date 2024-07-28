import { readdir } from 'node:fs/promises'
import { writeFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import { debugStartup, electronWithUpdater } from 'electron-incremental-update/vite'

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'
  const electron = electronWithUpdater({
    isBuild,
    logParsedOptions: { showKeys: true },
    minify: false,
    bytecode: {
      enable: true,
      beforeCompile(code, id) {
        // writeFileSync(id.replace('.js', '.source.js'), code)
        console.log(id)
        return undefined
      },
    },
    main: {
      files: ['./electron/main/index.ts', './electron/main/worker.ts'],
      onstart: debugStartup,
    },
    preload: {
      files: './electron/preload/index.ts',
    },
    updater: {
      entry: {
        nativeModuleEntryMap: {
          db: './electron/native/db.ts',
          image: './electron/native/image.ts',
        },
        overrideEsbuildOptions: {
          target: 'esnext',
        },
        postBuild: async ({ copyToEntryOutputDir }) => {
          copyToEntryOutputDir({
            from: './node_modules/better-sqlite3/build/Release/better_sqlite3.node',
          })
          const startStr = '@napi-rs+image-'
          const fileName = (await readdir('./node_modules/.pnpm')).filter(p => p.startsWith(startStr))[0]
          const archName = fileName.substring(startStr.length).split('@')[0]
          copyToEntryOutputDir({
            from: `./node_modules/.pnpm/${fileName}/node_modules/@napi-rs/image-${archName}/image.${archName}.node`,
          })
        },
      },
    },
  })

  return {
    plugins: [electron],

    build: {
      sourcemap: false,
    },

    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL('http://127.0.0.1:3344/')
      return {
        host: url.hostname,
        port: +url.port,
      }
    })(),
  }
})
