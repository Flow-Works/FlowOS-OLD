import { Process } from '../../types'
import icon from '../../assets/icons/theme-config.svg'

const ThemeConfig: Process = {
  config: {
    name: 'Theme Maker',
    type: 'process',
    icon,
    targetVer: '2.0.0'
  },
  run: async (process) => {
    const wm = await process.loadLibrary('lib/WindowManager')
    const HTML = await process.loadLibrary('lib/HTML')
    const { Input, Button } = await process.loadLibrary('lib/Components')

    const win = wm.createWindow({
      title: 'Theme Maker',
      icon,
      width: 600,
      height: 200
    }, process)

    const content = new HTML(win.content)

    const items = [
      'crust',
      'mantle',
      'base',
      'surface-0',
      'surface-1',
      'surface-2',
      'text'
    ]

    const name = Input.new().attr({
      value: 'My Theme'
    })

    content.appendMany(
      new HTML('div')
        .appendMany(
          new HTML('label').text('Name: '),
          name
        ),
      ...items.map((item) => {
        return new HTML('div')
          .appendMany(
            new HTML('label').text(`${item[0].toUpperCase() + item.slice(1)}: `),
            Input.new().attr({
              type: 'color',
              id: item,
              value: '#000000'
            })
          )
      }),
      Button.new().text('Create').on('click', () => {
        const theme: {
          [key: string]: any
        } = {
          name: name.getValue(),
          colors: {}
        }
        items.forEach((item) => {
          theme.colors[item] = content.qs(`#${item}`)?.getValue()
        })
        process.fs.writeFile(`/etc/themes/${theme.name.replace(/\s/g, '') as string}.theme`, JSON.stringify(theme))
          .then(() => {
            wm.createModal('ok', 'Theme Manager', 'Theme created successfully.', process)
              .catch(e => console.error(e))
          })
          .catch(e => console.error(e))
      })
    )
  }
}

export default ThemeConfig
