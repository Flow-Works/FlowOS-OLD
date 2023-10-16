import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteRequire } from 'vite-require'

export default defineConfig({
  plugins: [
    nodePolyfills(),
    viteRequire()
  ]
})
