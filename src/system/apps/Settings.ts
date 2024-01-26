import { Process } from '../../types'
import icon from '../../assets/icons/preferences-system.svg'
import { stringify } from 'js-ini'

const Settings: Process = {
  config: {
    name: 'Settings',
    type: 'process',
    icon,
    targetVer: '2.0.0'
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
        let input = Input.new()

        if (item === 'THEME_PRIMARY') {
          const { extras } = JSON.parse(Buffer.from(await fs.readFile(`/etc/themes/${config.THEME as string}.theme`)).toString())
          input = Dropdown.new(Object.keys(extras))
        } else if (item === 'THEME') {
          input = Dropdown.new((await fs.readdir('/etc/themes')).map((theme: string) => theme.replace('.theme', '')))
        }

        if (item === 'THEME_PRIMARY' || item === 'THEME') {
          (input.elm as HTMLSelectElement).value = config[item]
        } else {
          input.attr({
            value: config[item]
          })
        }

        console.log(input.getValue())

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
                  fs.writeFile('/etc/flow', stringify(config))
                    .then(() => {
                      document.dispatchEvent(
                        new CustomEvent('config_update', {
                          detail: {
                            config
                          }
                        })
                      )
                      if (item === 'THEME' || item === 'THEME_PRIMARY') {
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
