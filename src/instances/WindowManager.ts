
import HTML from '../lib'
import FlowWindow from '../structures/FlowWindow'
import { FlowWindowConfig } from '../types'

class WindowManager {
  private isLauncherOpen = false
  windowArea: HTMLElement
  launcher: HTMLElement
  windows: FlowWindow[] = []

  /**
   * Creates the window container.
   */
  constructor () {
    this.windowArea = document.createElement('window-area')
  }

  /**
   * Gets the highest window's z-index.
   *
   * @returns The heighest window's z-index.
   */
  getHighestZIndex (): number {
    const indexes = this.windows.map((win: FlowWindow) => {
      return parseInt(win.element.style.zIndex)
    })

    const max = Math.max(...indexes)

    return max === -Infinity ? 0 : max
  }

  /**
   * Creates a window.
   *
   * @param config The config for the window to follow.
   * @returns The created window.
   */
  createWindow (config: FlowWindowConfig): FlowWindow {
    const win = new FlowWindow(this, config)
    this.windows.push(win)
    this.windowArea.appendChild(win.element)
    return win
  }

  /**
   * Creates a modal window.
   *
   * @param {string} title - A string representing the title of the modal window.
   * @param {string} text - The `text` parameter is a string that represents the content or message to
   * be displayed in the modal window.
   * @returns The function `createModal` is returning a `FlowWindow` object.
   */
  async createModal (title: string, text: string): Promise<boolean> {
    const win = new FlowWindow(this, {
      title,
      icon: '',
      width: 300,
      height: 200,
      canResize: false
    })

    return await new Promise((resolve) => {
      new HTML('h3').text(text).appendTo(win.content)
      new HTML('p').text(text).appendTo(win.content)
      new HTML('button').text('Allow').appendTo(win.content).on('click', () => {
        resolve(true)
        win.close()
      })
      new HTML('button').text('Allow').appendTo(win.content).on('click', () => {
        resolve(false)
        win.close()
      })

      this.windows.push(win)
      this.windowArea.appendChild(win.element)
    })
  }

  /**
   * Toggles the app launcher.
   */
  toggleLauncher (): boolean {
    if (this.isLauncherOpen) {
      this.launcher.style.opacity = '0'
      this.launcher.style.backdropFilter = 'blur(0px)'
      this.launcher.style.pointerEvents = 'none'
    } else {
      this.launcher.style.opacity = '1'
      this.launcher.style.backdropFilter = 'blur(20px)'
      this.launcher.style.pointerEvents = 'all'
    }

    this.isLauncherOpen = !this.isLauncherOpen
    return this.isLauncherOpen
  }

  /**
   * Initiates the window manager.
   */
  async init (): Promise<void> {
    window.preloader.setPending('window manager')
    window.preloader.setStatus('creating app launcher...')
    this.launcher = document.createElement('launcher')

    this.launcher.innerHTML = `
      <input placeholder="Search"/>
      <apps></apps>
    `;

    (this.launcher.querySelector('input') as HTMLInputElement).onkeyup = () => {
      (this.launcher.querySelector('apps') as HTMLElement).innerHTML = ''
      if ((this.launcher.querySelector('input') as HTMLInputElement).value !== '') {
        window.flow.apps.filter(x => x.meta.name.toLowerCase().includes((this.launcher.querySelector('input') as HTMLInputElement).value.toLowerCase())).forEach((app) => {
          const appElement = document.createElement('app')
          appElement.onclick = async () => {
            await window.flow.openApp(app.meta.pkg)
            this.toggleLauncher()
          }
          appElement.innerHTML = `<img src="${app.meta.icon}"><div>${app.meta.name}</div>`
          this.launcher.querySelector('apps')?.appendChild(appElement)
        })
      } else {
        window.flow.apps.forEach((app) => {
          window.preloader.setStatus(`adding apps to app launcher\n${app.meta.name}`)
          const appElement = document.createElement('app')
          appElement.onclick = async () => {
            await window.flow.openApp(app.meta.pkg)
            window.wm.toggleLauncher()
          }
          appElement.innerHTML = `<img src="${app.meta.icon}"><div>${app.meta.name}</div>`
          window.wm.launcher.querySelector('apps')?.appendChild(appElement)
        })
      }
    }

    this.launcher.onclick = (e) => {
      if (e.target !== e.currentTarget) return
      this.toggleLauncher()
    }

    (this.launcher.querySelector('apps') as HTMLElement).onclick = (e) => {
      if (e.target !== e.currentTarget) return
      this.toggleLauncher()
    }

    await window.preloader.setDone('window manager')
  }
}

export default WindowManager
