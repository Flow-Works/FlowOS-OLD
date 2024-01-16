import icon from '../../assets/icons/software-properties.svg'
import nullIcon from '../../assets/icons/application-executable.svg'
import libraryIcon from '../../assets/icons/icon-library.svg'
import { Process } from '../../types'

const Manager: Process = {
  config: {
    name: 'Manager',
    type: 'process',
    icon,
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    const win = await process.loadLibrary('lib/WindowManager').then((wm: any) => {
      return wm.createWindow({
        title: 'Manager',
        icon,
        width: 350,
        height: 500,
        canResize: false
      }, process)
    })

    const HTML = await process.loadLibrary('lib/HTML')

    win.content.style.display = 'flex'
    win.content.style.flexDirection = 'column'
    win.content.style.gap = '10px'
    win.content.style.padding = '10px'
    win.content.style.background = 'var(--base)'

    for (const pkg in process.kernel.packageList) {
      const container = new HTML('div').style({
        display: 'flex',
        gap: '10px',
        padding: '10px',
        background: 'var(--surface-0)',
        borderRadius: '10px'
      }).appendTo(win.content)
      new HTML('img').attr({
        src: process.kernel.packageList[pkg].executable.config.icon ?? (process.kernel.packageList[pkg].executable.config.type === 'library' ? libraryIcon : nullIcon),
        style: 'border-radius: 40%;aspect-ratio: 1 / 1;height: 50px;'
      }).appendTo(container)
      const div = new HTML('div').appendTo(container)
      new HTML('h3').style({
        margin: '0'
      }).text(process.kernel.packageList[pkg].executable.config.name).appendTo(div)
      new HTML('code').text(process.kernel.packageList[pkg].executable.config.type as string).appendTo(div)
    }
  }
}

export default Manager
