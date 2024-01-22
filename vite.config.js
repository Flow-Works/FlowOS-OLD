import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import viteCompression from 'vite-plugin-compression'
import fs from 'fs'

/** @type {import('vite').Plugin} */
const hexLoader = {
  name: 'hex-loader',
  transform (code, id) {
    const [path, query] = id.split('?')
    if (query !== 'raw-hex') { return null }

    const data = fs.readFileSync(path)
    const hex = data.toString('hex')

    return `export default '${hex}';`
  }
}

export default defineConfig({
  plugins: [
    hexLoader,
    nodePolyfills(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
      threshold: 10240,
      disable: false,
      verbose: true
    })
  ],
  build: {
    target: 'ESNEXT'
  }
})
