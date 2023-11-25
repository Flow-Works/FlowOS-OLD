import icon from '../../assets/icons/settings.png'
import { App } from '../../types'
import FlowWindow from '../../structures/FlowWindow'

export default class SettingsApp implements App {
  meta = {
    name: 'Settings',
    description: 'An easy-to-use configuration app.',
    pkg: 'flow.settings',
    icon,
    version: '1.0.0'
  }

  configFileLoc = '/.flow/config.json'
  configFolderLoc = '/.flow/'

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.meta.name,
      icon: this.meta.icon,
      width: 700,
      height: 300,
      canResize: true
    })

    win.content.style.padding = '10px'

    win.content.innerHTML = `
      <h1>Settings</h1>
      <div class="settings"></div>
      <button class="save">Save!</button>
      <style>
        h1 {
          margin: 0;
        }

        input, button {
          background: var(--mantle);
          padding: 2.5px;
          border: 1px solid var(--surface-0);
          border-radius: 5px;
          margin: 2.5px;
        }

        label {
          margin: 2.5px;
        }
      </style>
    `

    const titles: {
      [key: string]: string
    } = {
      SERVER_URL: 'FlowServer URL',
      HOSTNAME: 'Device Hostname',
      USERNAME: 'Username',
      '24HR_CLOCK': '24hr Clock'
    }

    const config = await window.config()

    for (const key of Object.keys(config)) {
      const container = document.createElement('div')
      const label = document.createElement('label')
      const input = document.createElement('input')

      if (typeof (config as any)[key] === 'boolean') {
        label.innerText = `${titles[key] ?? key}`
        input.type = 'checkbox'
      } else if (typeof (config as any)[key] === 'string') {
        label.innerText = `${titles[key] ?? key}:\n`
        input.type = 'text'
      }

      input.value = (config as any)[key]

      container.appendChild(label)
      container.appendChild(input)

      win.content.querySelector('.settings')?.appendChild(container)

      win.content.querySelector('.save')?.addEventListener('click', () => {
        (config as any)[key] = input.value

        window.location.reload()
      })
    }

    win.content.querySelector('.save')?.addEventListener('click', () => {
      window.fs.promises.writeFile('/.config/flow.json', JSON.stringify(config))
        .then(null)
        .catch(e => console.error(e))
    })

    return win
  }
}
