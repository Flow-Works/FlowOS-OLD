import './assets/style.less'

import Preloader from './instances/Preloader'
import StatusBar from './instances/StatusBar'
import WindowManager from './instances/WindowManager'
import Flow from './instances/Flow'

import * as fs from 'fs'
import { FlowConfig } from './types'

declare global {
  interface Window {
    preloader: Preloader
    flow: Flow
    fs: typeof fs
    statusBar: StatusBar
    wm: WindowManager
    config: () => Promise<FlowConfig>
  }
}

const params = new URLSearchParams(window.location.search)

async function enableDebug (): Promise<void> {
  const { default: eruda } = await import('eruda')
  eruda.init()
  return await Promise.resolve()
}

if (params.get('debug') !== null && params.get('debug') !== undefined) {
  enableDebug().catch(e => console.error(e))
}

window.preloader = new Preloader()
window.flow = new Flow()
window.statusBar = new StatusBar()
window.wm = new WindowManager();

(async function () {
  window.preloader.setPending('filesystem')
  window.fs = new (window as any).Filer.FileSystem()

  const defaultConfig = {
    SERVER_URL: 'https://server.flow-works.me',
    HOSTNAME: 'flow',
    USERNAME: 'user',
    '24HR_CLOCK': false
  }

  window.fs.exists('/.config', (exists) => {
    if (!exists) window.fs.promises.mkdir('/.config').then(null).catch(e => console.error)

    window.fs.exists('/.config/flow.json', (exists) => {
      if (!exists) {
        window.fs.promises.writeFile('/.config/flow.json', JSON.stringify(defaultConfig)).then(null).catch(e => console.error)
        window.location.reload()
      }
    })
  })

  /**
   * Gets the current FlowOS config.
   *
   * @returns The current FlowOS config.
   */
  window.config = async (): Promise<FlowConfig> => {
    return await new Promise((resolve, reject) => {
      window.fs.exists('/.config/flow.json', (exists) => {
        if (exists) {
          window.fs.promises.readFile('/.config/flow.json')
            .then(content => { resolve(JSON.parse(content.toString())) })
            .catch(() => reject(new Error('Unable to read config file.')))
        } else reject(new Error('Config file does not exist.'))
      })
    })
  }

  navigator.serviceWorker.register('/uv-sw.js?config=' + encodeURIComponent((await window.config()).SERVER_URL), {
    scope: '/service/'
  }).catch(e => console.error(e))

  await window.preloader.setDone('filesystem')

  await window.wm.init()
  await window.flow.init()
  await window.statusBar.init()

  window.preloader.setStatus('')
  window.preloader.finish()
})().catch(e => console.error)
