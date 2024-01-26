import HTML from '../../HTML'
import FlowWindow from '../../structures/FlowWindow'
import ProcessLib from '../../structures/ProcessLib'
import { FlowWindowConfig, Library } from '../../types'
import nullIcon from '../../assets/icons/application-default-icon.svg'

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
        width: 350,
        height: 150,
        canResize: false
      })
      const appOpenedEvent = {
        detail: {
          token: process.token,
          proc: process.process,
          win
        }
      }

      const { Button } = await process.loadLibrary('lib/Components')

      return {
        value: await new Promise((resolve) => {
          win.content.style.padding = '10px'
          win.content.style.display = 'flex'
          win.content.style.flexDirection = 'column'
          win.content.style.gap = '10px'

          const container = new HTML('div').style({
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            height: 'max-content'
          }).appendTo(win.content)

          new HTML('img').attr({ src: process.process.config.icon ?? nullIcon }).style({
            height: '100%',
            'aspect-ratio': '1 / 1',
            borderRadius: '50%',
            alignSelf: 'center'
          }).appendTo(container)

          const space = new HTML('div').style({
            display: 'flex',
            gap: '10px',
            'flex-direction': 'column',
            'justify-content': 'center',
            height: 'max-content'
          }).appendTo(container)

          new HTML('h3').text(title).style({ margin: '0' }).appendTo(space)
          new HTML('p').text(text).style({ margin: '0' }).appendTo(space)
          const div = new HTML('div').style({ display: 'flex', gap: '10px', alignItems: 'right' }).appendTo(space)

          if (type === 'allow') document.dispatchEvent(new CustomEvent('app_opened', appOpenedEvent))

          if (type === 'allow') {
            Button.new('primary').text('Allow').appendTo(div).on('click', () => {
              resolve(true)
              win.close()
            })
            Button.new().text('Deny').appendTo(div).on('click', () => {
              resolve(false)
              win.close()
            })
          } else if (type === 'ok') {
            Button.new('primary').text('OK').appendTo(div).on('click', () => {
              win.close()
              resolve(true)
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
