import './assets/style.less'

import Preloader from './instances/Preloader'
import StatusBar from './instances/StatusBar'
import WindowManager from './instances/WindowManager'
import Flow from './instances/Flow'

import * as fs from 'fs'

declare global {
  interface Window {
    preloader: Preloader
    flow: Flow
    fs: typeof fs
    statusBar: StatusBar
    wm: WindowManager
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
  await window.preloader.setDone('filesystem')

  await window.wm.init()
  await window.flow.init()
  await window.statusBar.init()

  window.preloader.setStatus('')
  window.preloader.finish()

  await navigator.serviceWorker.register('/uv-sw.js', {
    scope: '/service/'
  })
})().catch(e => console.error)
