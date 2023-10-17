import './style.less'

import StatusBar from './statusbar'
import WM from './wm'

import * as fs from 'fs'

declare global {
  interface Window {
    statusBar: StatusBar
    wm: WM
    fs: typeof fs
  }
}

window.statusBar = new StatusBar()
window.wm = new WM()
window.fs = new (window as any).Filer.FileSystem()

const params = new URLSearchParams(window.location.search)

async function enableDebug() {
  const { default: eruda } = await import("eruda")
  eruda.init()
}

if (params.get("debug")) enableDebug()