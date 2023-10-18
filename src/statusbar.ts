
import { StatusItem } from './types'

class StatusBar {
  pluginList: string[] = [
    './modules/appLauncher.ts',
    './modules/apps.ts',
    './modules/weather.ts',
    './modules/clock.ts',
    './modules/switcher.ts',
    './modules/battery.ts'
  ]

  plugins: StatusItem[] = []
  element: HTMLElement

  constructor () {
    this.element = document.createElement('toolbar')

    document.body.appendChild(this.element)
  }

  add (item: StatusItem): void {
    if (this.plugins.some(x => x.meta.id === item.meta.id)) {
      console.error(`Unable to register tool; ${item.meta.id} is already registered.`)
      return
    }

    const element = document.createElement('div')
    element.setAttribute('data-toolbar-id', item.meta.id)

    this.plugins.push(item)
    this.element.appendChild(element)

    item.run(element)
  }

  async init (): Promise<void> {
    window.preloader.setPending('plugins')
    window.preloader.setStatus('importing default plugins...')

    for (const pluginPath of this.pluginList) {
      const plugin = await import(pluginPath)

      window.preloader.setStatus(`importing default plugins\n${pluginPath}`)
      this.add(plugin)
    }

    await window.preloader.setDone('plugins')
  }
}

export default StatusBar
