const { name, author } = require('./package.json')

const target = `${name}.asar`
/* eslint-disable no-template-curly-in-string */
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  appId: 'org.test.Playground',
  productName: 'Test',
  files: [
    'dist-entry',
    '!node_modules/**',
  ],
  npmRebuild: false,
  compression: 'store',
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
      // {
      //   target: 'nsis',
      //   arch: ['x64', 'ia32'],
      // },
      // 'nsis',
      'zip',
      // '7z',
    ],
    signAndEditExecutable: false,
    publisherName: author,
  },
  nsis: {
    artifactName: '${productName}-${os}-${version}-${arch}-Setup.${ext}',
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
        // arch: ['x64', 'arm64', 'universal'],
        arch: ['universal'],
      },
    ],
    artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
    category: 'public.app-category.music',
    darkModeSupport: true,
    identity: null,
  },
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64'],
      },
      // {
      //   target: 'tar.gz',
      //   arch: ['x64', 'arm64'],
      // },
      {
        target: 'deb',
        // arch: ['x64', 'armv7l', 'arm64'],
        arch: ['x64'],
      },
      // {
      //   target: 'rpm',
      //   arch: ['x64'],
      // },
      // {
      //   target: 'snap',
      //   arch: ['x64'],
      // },
      // {
      //   target: 'pacman',
      //   arch: ['x64'],
      // },
    ],
    category: 'Music',
    maintainer: 'subframe7536',
    artifactName: '${productName}-${os}-${version}-${arch}.${ext}',
  },
  publish: null,
}
