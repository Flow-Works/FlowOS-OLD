import icon from '../assets/icons/settings.png'
import { App } from '../types.ts'
import { FlowWindow } from '../wm.ts'

export default class SettingsApp implements App {
  name = 'Settings'
  pkg = 'flow.settings'
  icon = icon
  version = '1.0.0'

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.name,
      icon,
      width: 700,
      height: 300
    })

    win.content.style.padding = '10px'
    win.content.innerHTML = `
      <h1>Settings</h1>
      <p>owo2</p>
    `

    return win
  }
}
