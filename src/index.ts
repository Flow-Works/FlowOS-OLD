import './style.less'

import StatusBar from './statusbar.ts'
import WM from './wm.ts'

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
