/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  name: 'FlowOS',
  plugin: ['typedoc-material-theme'],
  themeColor: '#1e1e2e',
  entryPoints: ['src/kernel.ts'],
  entryPointStrategy: 'expand'
}
