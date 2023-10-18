import flow from './flow.ts'
import { v4 as uuid } from 'uuid'
import { FlowWindowConfig } from './types.ts'

function dragElement (element: HTMLElement, container: HTMLElement): void {
  let posX = 0; let posY = 0

  element.querySelector('window-header')?.addEventListener('mousedown', dragMouseDown)

  function dragMouseDown (e: MouseEvent): void {
    e.preventDefault()
    closeAll()

    posX = e.clientX
    posY = e.clientY

    document.onmouseup = closeDragElement
    document.onmousemove = elementDrag
  }

  function elementDrag (e: MouseEvent): void {
    e.preventDefault()

    const dx = e.clientX - posX
    const dy = e.clientY - posY

    const newTop = element.offsetTop + dy
    const newLeft = element.offsetLeft + dx

    const containerWidth = container.offsetWidth
    const containerHeight = container.offsetHeight

    if (newTop >= 0 && newTop + element.offsetHeight <= containerHeight) {
      element.style.top = `${newTop}px`
    }

    if (newLeft >= 0 && newLeft + element.offsetWidth <= containerWidth) {
      element.style.left = `${newLeft}px`
    }

    posX = e.clientX
    posY = e.clientY
  }

  function closeDragElement (): void {
    document.onmouseup = null
    document.onmousemove = null
    container.onmouseleave = null
  }

  function closeAll (): void {
    closeDragElement()
    container.onmouseenter = null
  }
}

export class FlowWindow {
  element: HTMLElement

  private readonly header: HTMLElement
  content: HTMLElement

  maximized: boolean
  minimized: boolean

  width: number
  height: number

  isMinimized = false
  isMaximized = false

  wm: WM

  id = uuid()

  config: FlowWindowConfig

  constructor (wm: WM, config: FlowWindowConfig) {
    this.wm = wm
    this.config = config

    this.element = document.createElement('window')

    this.element.style.zIndex = (wm.getHighestZIndex() + 1).toString()
    this.element.style.position = 'absolute'
    this.focus()

    this.element.onmousedown = () => {
      this.focus()
    }

    this.element.style.width = `${config.width ?? 300}px`
    this.element.style.height = `${config.height ?? 200}px`

    this.header = document.createElement('window-header')
    this.header.innerHTML = `<img src="${config.icon}"></img> <div class="title">${config.title}</div><div style="flex:1;"></div><i id="min" class='bx bx-minus'></i><i id="close" class='bx bx-x'></i>`
    if (config.canResize) {
      this.header.innerHTML = `<img src="${config.icon}"></img> <div class="title">${config.title}</div><div style="flex:1;"></div><i id="min" class='bx bx-minus'></i><i id="max" class='bx bx-checkbox'></i><i id="close" class='bx bx-x'></i>`
    }

    (this.header.querySelector('#close') as HTMLElement).onclick = () => {
      this.close()
    }

    (this.header.querySelector('#min') as HTMLElement).onclick = () => this.toggleMin()

    if (config.canResize) {
      (this.header.querySelector('#max') as HTMLElement).onclick = () => this.toggleMax()
    }

    this.content = document.createElement('window-content')

    this.element.appendChild(this.header)
    this.element.appendChild(this.content)

    dragElement(this.element, (document.querySelector('window-area') as HTMLElement))
  }

  toggleMin (): boolean {
    if (this.isMinimized) {
      this.element.style.pointerEvents = 'all'
      this.element.style.opacity = '1'
    } else {
      this.element.style.pointerEvents = 'none'
      this.element.style.opacity = '0'
    }

    this.isMinimized = !this.isMinimized
    return this.isMinimized
  }

  private prevTop: string
  private prevLeft: string
  private prevWidth: string
  private prevHeight: string
  toggleMax (): boolean {
    if (this.isMaximized) {
      this.element.style.width = this.prevWidth
      this.element.style.height = this.prevHeight
      this.element.style.top = this.prevTop
      this.element.style.left = this.prevLeft
    } else {
      this.prevTop = this.element.style.top
      this.prevLeft = this.element.style.left
      this.prevWidth = this.element.style.width
      this.prevHeight = this.element.style.height

      this.element.style.top = '0'
      this.element.style.left = '0'
      this.element.style.width = 'calc(100% - 2px)'
      this.element.style.height = 'calc(100% - 3px)'
    }

    this.isMaximized = !this.isMaximized
    return this.isMaximized
  }

  focus (): void {
    if (this.element.style.zIndex !== this.wm.getHighestZIndex().toString()) {
      this.element.style.zIndex = (this.wm.getHighestZIndex() + 1).toString()
    }
  }

  close (): void {
    this.element.remove()
    const event = new CustomEvent('app_closed', { detail: { win: this } })
    window.dispatchEvent(event)
  }

  setTitle (title: string): void {
    (this.header.querySelector('.title') as HTMLElement).innerText = title
  }
}

class WM {
  private isLauncherOpen = false
  windowArea: HTMLElement
  launcher: HTMLElement
  windows: FlowWindow[] = []

  constructor () {
    this.windowArea = document.createElement('window-area')
  }

  getHighestZIndex (): number {
    const indexes = this.windows.map((win: FlowWindow) => {
      return parseInt(win.element.style.zIndex)
    })

    const max = Math.max(...indexes)

    return max === -Infinity ? 0 : max
  }

  createWindow (config: FlowWindowConfig): FlowWindow {
    const win = new FlowWindow(this, config)
    this.windows.push(win)
    this.windowArea.appendChild(win.element)
    return win
  }

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

  async init (): Promise<void> {
    window.preloader.setPending('window manager')
    window.preloader.setStatus('creating app launcher...')
    this.launcher = document.createElement('launcher')

    this.launcher.innerHTML = `
      <input placeholder="Search"/>
      <apps></apps>
    `

    this.launcher.onclick = (e) => {
      if (e.target !== e.currentTarget) return
      this.toggleLauncher()
    }

    (this.launcher.querySelector('apps') as HTMLElement).onclick = (e) => {
      if (e.target !== e.currentTarget) return
      this.toggleLauncher()
    }

    this.launcher.style.opacity = '0'
    this.launcher.style.filter = 'blur(0px)'
    this.launcher.style.pointerEvents = 'none'

    window.preloader.setStatus('adding apps to app launcher...')

    for (const pkg in flow.apps) {
      window.preloader.setStatus(`adding apps to app launcher\n${flow.apps[pkg].name}`)
      const app = document.createElement('app')
      app.onclick = () => {
        flow.openApp(pkg)
        this.toggleLauncher()
      }
      app.innerHTML = `<img src="${flow.apps[pkg].icon}"><div>${flow.apps[pkg].name}</div>`
      this.launcher.querySelector('apps')?.appendChild(app)
    }

    document.body.appendChild(this.windowArea)
    document.body.appendChild(this.launcher)

    await window.preloader.setDone('window manager')
  }
}

export default WM
