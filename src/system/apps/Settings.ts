import { Process } from '../../types'
import icon from '../../assets/icons/preferences-system.svg'
import { stringify } from 'js-ini'

const Settings: Process = {
  config: {
    name: 'Settings',
    type: 'process',
    icon,
    targetVer: '1.0.0-indev.0'
  },
  run: async process => {
    const win = await process
      .loadLibrary('lib/WindowManager')
      .then((wm: any) => {
        return wm.createWindow(
          {
            title: 'Settings',
            icon,
            width: 500,
            height: 500
          },
          process
        )
      })

    const { fs } = process
    const HTML = await process.loadLibrary('lib/HTML')

    const { Input, Button, Dropdown } = await process.loadLibrary('lib/Components')

    const render = async (config: any): Promise<void> => {
      win.content.innerHTML = ''
      for (const item in config) {
        console.log(config[item])
        const input = item === 'THEME'
          ? Dropdown.new((await fs.readdir('/etc/themes')).map((theme: string) => theme.replace('.theme', '')))
          : Input.new()

        if (item === 'THEME') {
          const text = config[item]
          const $select = input.elm as HTMLSelectElement
          const $options = Array.from($select.options)
          const optionToSelect = $options.find(item => item.text === text)
          if (optionToSelect != null) optionToSelect.selected = true
        }
        input.attr({
          value: config[item]
        })
        new HTML('div')
          .appendMany(
            new HTML('label')
              .style({
                'text-transform': 'capitalize'
              })
              .text(`${item.toLowerCase().replaceAll('_', ' ')}:`),
            new HTML('br'),
            new HTML('div')
              .style({
                display: 'flex',
                gap: '5px'
              })
              .appendMany(
                input,
                Button.new().text('Save').on('click', () => {
                  config[item] = input.getValue()
                  process.kernel.setConfig(config)
                  fs.writeFile('/etc/flow', stringify(config))
                    .then(() => {
                      document.dispatchEvent(
                        new CustomEvent('config_update', {
                          detail: {
                            config
                          }
                        })
                      )
                      if (item === 'THEME') {
                        document.dispatchEvent(new CustomEvent('theme_update', {}))
                      }
                    })
                    .catch(e => console.error(e))
                })
              )
          )
          .appendTo(win.content)
      }
    }

    await render(process.kernel.config)
    document.addEventListener('config_update', (e: CustomEvent) => {
      render(e.detail.config).catch(e => console.error(e))
    })
  }
}

export default Settings
