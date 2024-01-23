import HTML from '../../HTML'
import FlowWindow from '../../structures/FlowWindow'
import ProcessLib from '../../structures/ProcessLib'
import { FlowWindowConfig, Library } from '../../types'

const WindowManager: Library = {
  config: {
    name: 'WindowManager',
    type: 'library',
    targetVer: '1.0.0-indev.0'
  },
  init: (l, k, p) => {
    document.addEventListener('app_closed', (e: any) => {
      WindowManager.data.windows.find((win: FlowWindow) => {
        if (win.process.token === e.detail.token) {
          win.close()
          return true
        }
        return false
      })
    })
  },
  data: {
    windowArea: new HTML('window-area'),
    windows: [],
    getHighestZIndex: () => {
      const indexes = WindowManager.data.windows.map((win: FlowWindow) => {
        return parseInt(win.element.style.zIndex)
      })

      const max = Math.max(...indexes)

      return max === -Infinity ? 0 : max
    },
    createWindow: (config: FlowWindowConfig, process: ProcessLib) => {
      const win = new FlowWindow(process, WindowManager.data, config)
      const appOpenedEvent = {
        detail: {
          token: process.token,
          proc: process.process,
          win
        }
      }
      document.dispatchEvent(new CustomEvent('app_opened', appOpenedEvent))
      WindowManager.data.windows.push(win)
      WindowManager.data.windowArea.elm.appendChild(win.element)
      return win
    },
    createModal: async (type: 'allow' | 'ok', title: string, text: string, process: ProcessLib) => {
      const win = new FlowWindow(process, WindowManager.data, {
        title,
        icon: '',
        width: 300,
        height: 200,
        canResize: false
      })
      const appOpenedEvent = {
        detail: {
          token: process.token,
          proc: process.process,
          win
        }
      }
      document.dispatchEvent(new CustomEvent('app_opened', appOpenedEvent))

      const { Button } = await process.loadLibrary('lib/Components')

      return {
        value: await new Promise((resolve) => {
          new HTML('h3').text(title).appendTo(win.content)
          new HTML('p').text(text).appendTo(win.content)

          if (type === 'allow') {
            Button.new().text('Allow').appendTo(win.content).on('click', () => {
              resolve(true)
              win.close()
            })
            Button.new().text('Deny').appendTo(win.content).on('click', () => {
              resolve(false)
              win.close()
            })
          } else if (type === 'ok') {
            Button.new().text('OK').appendTo(win.content).on('click', () => {
              resolve(true)
              win.close()
            })
          }

          WindowManager.data.windows.push(win)
          WindowManager.data.windowArea.elm.appendChild(win.element)
        }),
        win
      }
    }
  }
}

export default WindowManager
