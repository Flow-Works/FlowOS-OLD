import icon from '../assets/icons/settings.png'
import { App } from '../types.ts'
import { FlowWindow } from '../wm.ts'

export default class SettingsApp implements App {
  name = 'Settings'
  pkg = 'flow.settings'
  icon = icon
  version = '1.0.0'

  async open (): Promise<FlowWindow> {
    const win = (window as any).wm.createWindow({
      title: this.name,
      icon,
      width: 700,
      height: 300
    })

    win.content.style.padding = '10px'
    // TODO: add css styling
    win.content.innerHTML = `
    win.content.innerHTML = '<iframe src="/src/apps/html/settings.html></iframe>'
    `

    return win
  }
}
