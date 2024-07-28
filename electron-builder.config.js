const { name, author } = require('./package.json')

const target = `${name}.asar`
/* eslint-disable no-template-curly-in-string */
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: 'org.test.Playground',
  productName: 'Playground',
  artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
  files: [
    'dist-entry',
    '!node_modules/**',
  ],
  npmRebuild: false,
  // compression: 'store',
  asarUnpack: [
    '**/*.{node,dll}',
  ],
  directories: {
    output: 'release',
  },
  extraResources: [
    { from: `release/${target}`, to: target },
  ],
  win: {
    target: [
      'nsis',
      '7z',
    ],
    signAndEditExecutable: false,
    publisherName: author,
  },
  nsis: {
    shortcutName: '${productName}',
    uninstallDisplayName: '${productName}',
    createDesktopShortcut: true,
    oneClick: true,
  },
  mac: {
    // entitlementsInherit: 'build/entitlements.mac.plist',
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64', 'universal'],
      },
    ],
    darkModeSupport: true,
    identity: null,
  },
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64'],
      },
      {
        target: 'deb',
        arch: ['x64'],
      },
    ],
    maintainer: author,
  },
  publish: null,
}
