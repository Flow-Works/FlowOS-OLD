
import { Plugin } from '../types'

class StatusBar {
  element: HTMLElement

  /**
   * Creates the status bar.
   */
  constructor () {
    this.element = document.createElement('toolbar')

    document.body.appendChild(this.element)
  }

  /**
   * Adds a plugin to the status bar.
   *
   * @param item The plugin to be added to the status bar.
   */
  async add (item: Plugin): Promise<void> {
    const element = document.createElement('div')
    element.setAttribute('data-toolbar-id', item.meta.pkg)

    this.element.appendChild(element)

    await item.run(element, await window.config())
  }

  /**
   * Initiates the status bar.
   */
  async init (): Promise<void> {
    window.preloader.setStatus('adding plugins to statusbar...')

    for (const plugin of window.flow.plugins) {
      window.preloader.setStatus(`adding plugins to statusbar\n${plugin.meta.pkg}`)
      await this.add(plugin)
    }

    await window.preloader.setDone('plugins')
  }
}

export default StatusBar
