import icon from '../../assets/icons/software-properties.svg'
import { App, LoadedApp, LoadedPlugin } from '../../types'
import FlowWindow from '../../structures/FlowWindow'
import nullIcon from '../../assets/icons/application-default-icon.svg'

export default class ManagerApp implements App {
  meta = {
    name: 'Flow Manager',
    description: 'A FlowOS utility app.',
    pkg: 'flow.manager',
    version: '1.0.0',
    icon
  }

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.meta.name,
      icon: this.meta.icon,
      width: 350,
      height: 500
    })

    win.content.style.display = 'flex'
    win.content.style.flexDirection = 'column'
    win.content.style.gap = '10px'
    win.content.style.padding = '10px'
    win.content.style.background = 'var(--base)'
    win.content.innerHTML = `
      ${window.flow.apps.map((app: LoadedApp) => {
        return `
          <div style="display:flex;gap: 10px;padding: 10px;background: var(--surface-0);border-radius: 10px;">
            <img src="${app.meta.icon}" style="border-radius: 40%;aspect-ratio: 1 / 1;height: 50px;"/>
            <div>
              <h3 style="margin:0;">${app.meta.name} ${(app.builtin ?? false) ? '<code style="font-size: 0.75em;">(builtin)</code>' : ''}</h3>
              <p style="margin:0;">${app.meta.pkg} (v${app.meta.version}) - App</p>
            </div>
          </div>
        `
      }).join('')}
      ${window.flow.plugins.map((plugin: LoadedPlugin) => {
        return `
          <div style="display:flex;gap: 10px;padding: 10px;background: var(--surface-0);border-radius: 10px;">
            <img src="${plugin.meta.icon ?? nullIcon}" style="border-radius: 100%;aspect-ratio: 1 / 1;height: 50px;"/>
            <div>
              <h3 style="margin:0;">${plugin.meta.name} ${(plugin.builtin ?? false) ? '<code style="font-size: 0.75em;">(builtin)</code>' : ''}</h3>
              <p style="margin:0;">${plugin.meta.pkg} (v${plugin.meta.version}) - Plugin</p>
            </div>
          </div>
        `
      }).join('')}
    `

    return win
  }
}
