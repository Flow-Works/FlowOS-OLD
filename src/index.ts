import 'material-symbols'
import './assets/style.less'

import Preloader from './instances/Preloader'
import StatusBar from './instances/StatusBar'
import WindowManager from './instances/WindowManager'
import Flow from './instances/Flow'

import { VirtualFS } from './fs'

import { version } from '../package.json'

const flowDetails = {
  version,
  codename: 'Mochi'
}
declare global {
  interface Window {
    flowDetails: typeof flowDetails
    preloader: Preloader
    flow: Flow
    fs: VirtualFS
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

window.flowDetails = flowDetails
window.preloader = new Preloader()
window.flow = new Flow()
window.statusBar = new StatusBar()
window.wm = new WindowManager();

(async function () {
  window.preloader.setPending('filesystem')
  window.fs = new VirtualFS()

  const registrations = await navigator.serviceWorker.getRegistrations()
  for (const registration of registrations) {
    await registration.unregister()
  }
  await navigator.serviceWorker.register('/uv-sw.js?url=' + encodeURIComponent(btoa('https://server.flow-works.me')), {
    scope: '/service/'
  })

  await window.preloader.setDone('filesystem')

  await window.wm.init()
  await window.flow.init()
  await window.statusBar.init()

  window.preloader.setStatus('')
  window.preloader.finish()
})().catch(e => console.error)
