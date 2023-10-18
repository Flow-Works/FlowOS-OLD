import icon from '../assets/icons/settings.png'
import { App } from '../types.ts'
import { FlowWindow } from '../wm.ts'

export default class SettingsApp implements App {
  name = 'Info'
  pkg = 'flow.info'
  icon = icon
  version = '1.0.0'
  canResize = true

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.name,
      icon,
      width: 300,
      height: 400,
      canResize: false
    })

    win.content.style.padding = '10px'
    win.content.innerHTML = `
        <h1>FlowOS</h1>
        <p>v2.0</p>

        <p> Created by ThinLiquid, 1nspird_, Proudparot2, Systemless_  </p>

        <a class="discord" href="https://discord.gg/flowos"> Discord </a>

        <a class="github" href="https://github.com/Flow-Works/FlowOS-2.0"> Github </a>

        <style>

          #contributers {
            font-size:12px;
          }

          h1 {
            text-align: center;
            font-size: 48px;
          }
          p {
            text-align: center;
          }
          .github {
            float:right;
            position: relative;
            top: 80px;
          }
          .discord {
            float:left;
            position: relative;
            top: 80px;
          }
        </style>
    `

    return win
  }
}
