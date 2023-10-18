import icon from '../assets/icons/manager.png'
import { App } from '../types.ts'
import { FlowWindow } from '../wm.ts'

export default class ManagerApp implements App {
  name = 'Manager'
  pkg = 'flow.manager'
  icon = icon
  version = '1.0.0'

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.name,
      icon,
      width: 350,
      height: 500
    })

    win.content.style.display = 'flex'
    win.content.style.flexDirection = 'column'
    win.content.style.gap = '10px'
    win.content.style.padding = '10px'
    win.content.style.background = 'var(--base)'
    win.content.innerHTML = `
      ${window.flow.apps.map(app => {
        return `
          <div style="display:flex;gap: 10px;padding: 10px;background: var(--surface-0);border-radius: 10px;">
            <img src="${app.icon}" style="border-radius: 40%;aspect-ratio: 1 / 1;height: 50px;"/>
            <div>
              <h3 style="margin:0;">${app.name} ${(app.builtin ?? false) ? '<code style="font-size: 0.75em;">(builtin)</code>' : ''}</h3>
              <p style="margin:0;">${app.pkg} (v${app.version})</p>
            </div>
          </div>
        `
      }).join('')}
    `

    return win
  }
}
