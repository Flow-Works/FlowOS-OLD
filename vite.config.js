import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dynamicImport from 'vite-plugin-dynamic-import'

export default defineConfig({
  plugins: [
    nodePolyfills(),
    dynamicImport()
  ]
})
