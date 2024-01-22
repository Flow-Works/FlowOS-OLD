/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  name: 'FlowOS',
  plugin: ['typedoc-material-theme'],
  themeColor: '#1e1e2e',
  entryPoints: ['src/bootloader.ts'],
  entryPointStrategy: 'expand'
}
