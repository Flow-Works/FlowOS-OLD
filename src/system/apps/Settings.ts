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

    const fs = await process.loadLibrary('lib/VirtualFS')
    const HTML = await process.loadLibrary('lib/HTML')

    const { Input, Button } = await process.loadLibrary('lib/Components')

    const render = async (config: any): Promise<void> => {
      win.content.innerHTML = ''
      for (const item in config) {
        const input = Input.new().attr({
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
                Button.new().text('Save').on('click', async () => {
                  config[item] = input.getValue()
                  process.kernel.setConfig(config)
                  await fs.writeFile('/etc/flow', stringify(config))
                  document.dispatchEvent(
                    new CustomEvent('config_update', {
                      detail: {
                        config
                      }
                    })
                  )
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
