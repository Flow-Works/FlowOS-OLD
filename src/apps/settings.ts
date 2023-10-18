import icon from '../assets/icons/settings.png'
import { App } from '../types.ts'
import { FlowWindow } from '../wm.ts'

export default class SettingsApp implements App {
  meta = {
    name: 'Settings',
    description: 'Modify/customize FlowOS.',
    pkg: 'flow.settings',
    version: '1.0.0',
    icon
  }

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.meta.name,
      icon: this.meta.icon,
      width: 700,
      height: 300
    })

    win.content.style.background = 'var(--base)'
    win.content.style.padding = '10px'
    win.content.innerHTML = `
      <h1>Settings</h1>
      <p>owo2</p>
    `

    return win
  }
}
