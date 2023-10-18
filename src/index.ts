import './style.less'

import Preloader from './preloader'
import StatusBar from './statusbar'
import WM from './wm'

import * as fs from 'fs'

declare global {
  interface Window {
    preloader: Preloader
    statusBar: StatusBar
    wm: WM
    fs: typeof fs
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
window.statusBar = new StatusBar()
window.wm = new WM();

(async function () {
  window.preloader.setPending('filesystem')
  window.fs = new (window as any).Filer.FileSystem()
  await window.preloader.setDone('filesystem')

  await window.statusBar.init()
  await window.wm.init()

  window.preloader.setStatus('')
  window.preloader.finish()
})().catch(e => console.error)
