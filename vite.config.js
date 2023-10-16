import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { viteRequire } from 'vite-require'

export default defineConfig({
  plugins: [
    createHtmlPlugin({
      entry: 'src/index.ts',
      template: 'public/index.html',
      inject: {
        data: {
          title: 'index',
          injectScript: '<script src="./bundle.js"></script>'
        }
      }
    }),
    nodePolyfills(),
    viteRequire()
  ]
})
