import { FlowWindowConfig } from '../types'
import { sanitize } from '../utils'
import nullIcon from '../assets/icons/application-default-icon.svg'
import ProcessLib from './ProcessLib'

/**
 * Makes an element draggable.
 *
 * @param element The element to become draggable.
 * @param container The draggable element container.
 */
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

class FlowWindow {
  element: HTMLElement

  private readonly header: HTMLElement
  private readonly realContent: HTMLElement
  content: HTMLElement

  maximized: boolean
  minimized: boolean

  width: number
  height: number

  isMinimized = false
  isMaximized = false

  wm: any

  readonly process: ProcessLib

  onClose: () => void

  config: FlowWindowConfig

  /**
   * Creates a window session.
   *
   * @param wm The current window manager session.
   * @param config The window's pre-set config.
   */
  constructor (process: ProcessLib, wm: any, config: FlowWindowConfig, onClose = () => {}) {
    this.process = process
    this.wm = wm
    this.config = config

    this.onClose = onClose

    this.element = document.createElement('window')

    this.element.style.zIndex = (wm.getHighestZIndex() as number + 1).toString()
    this.element.style.position = 'absolute'
    this.focus()

    this.element.onmousedown = () => {
      this.focus()
    }

    if (config.canResize === undefined || config.canResize === null) config.canResize = true

    if (!config.canResize) this.element.style.resize = 'none'

    this.element.style.width = `${config.width ?? 300}px`
    this.element.style.height = `${config.height ?? 200}px`

    this.header = document.createElement('window-header')
    this.header.innerHTML = `<img alt="${sanitize(config.title)} icon" src="${sanitize(config.icon === '' ? nullIcon : config.icon)}"></img> <div class="title">${sanitize(config.title)}</div><div style="flex:1;"></div><i id="min" class='material-symbols-rounded' style="margin-bottom: 5px;">minimize</i><i id="close" class='material-symbols-rounded'>close</i>`
    if (config.canResize) {
      this.header.innerHTML = `<img alt="${sanitize(config.title)} icon" src="${sanitize(config.icon === '' ? nullIcon : config.icon)}"></img> <div class="title">${sanitize(config.title)}</div><div style="flex:1;"></div><i id="min" class='material-symbols-rounded' style="margin-bottom: 5px;">minimize</i><i id="max" class='material-symbols-rounded' style="font-size: 20px;">square</i><i id="close" class='material-symbols-rounded'>close</i>`
    }

    (this.header.querySelector('#close') as HTMLElement).onclick = () => {
      this.process.kill().catch((e: any) => console.error(e))
    }

    (this.header.querySelector('#min') as HTMLElement).onclick = () => this.toggleMin()

    if (config.canResize) {
      (this.header.querySelector('#max') as HTMLElement).onclick = () => this.toggleMax()
    }

    this.realContent = document.createElement('window-content')
    const shadow = this.realContent.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <style>
        .material-symbols-rounded {
          font-variation-settings:
          'FILL' 0,
          'wght' 400,
          'GRAD' 200,
          'opsz' 48
        }
      </style>
      <style>
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
      
          font-family: "Satoshi", sans-serif;
          font-weight: 600;
      
          color: var(--text);
        }
      </style>
    `
    const shadowBody = document.createElement('body')
    shadowBody.style.margin = '0px'
    shadowBody.style.height = '100%'

    shadow.appendChild(shadowBody)
    this.content = shadowBody

    this.element.appendChild(this.header)
    this.element.appendChild(this.realContent)

    dragElement(this.element, (document.querySelector('window-area') as HTMLElement))
  }

  /**
   * Toggles the window's minimization.
   *
   * @returns The window's current minimization state.
   */
  toggleMin (): boolean {
    if (this.isMinimized) {
      this.element.style.pointerEvents = 'all'
      this.element.style.opacity = '1'
      this.element.style.transform = 'translateY(0)'
    } else {
      this.element.style.pointerEvents = 'none'
      this.element.style.opacity = '0'
      this.element.style.transform = 'translateY(10px)'
    }

    this.isMinimized = !this.isMinimized
    return this.isMinimized
  }

  private prevTop: string
  private prevLeft: string
  private prevWidth: string
  private prevHeight: string

  /**
   * Toggles the window's maximization.
   *
   * @returns The window's current maximization state.
   */
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

  /**
   * Focuses the window.
   */
  focus (): void {
    if (this.element.style.zIndex !== this.wm.getHighestZIndex().toString()) {
      this.element.style.zIndex = (this.wm.getHighestZIndex() as number + 1).toString()
    }
  }

  /**
   * Closes the window.
   */
  close (): void {
    this.element.style.pointerEvents = 'none'
    this.element.style.opacity = '0'
    this.element.style.transform = 'translateY(10px)'
    this.onClose()
    setTimeout(() => {
      this.element.remove()
    }, 200)
  }

  /**
   * Sets the title of the window.
   *
   * @param title - The desired window title.
   */
  setTitle (title: string): void {
    (this.header.querySelector('.title') as HTMLElement).innerText = title
  }
}

export default FlowWindow
