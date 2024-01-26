import { Library } from '../../types'

let isLauncherOpen = false

const Launcher: Library = {
  config: {
    name: 'Launcher',
    type: 'library',
    targetVer: '1.0.0-indev.0'
  },
  init: (l, k) => {
    Launcher.data.element = new l.HTML('launcher').style({
      opacity: '0',
      'backdrop-filter': 'blur(0px)',
      'pointer-events': 'none'
    })
  },
  data: {
    toggle: () => {
      if (isLauncherOpen) {
        Launcher.data.element.style({
          opacity: '0',
          'backdrop-filter': 'blur(0px)',
          'pointer-events': 'none'
        })
      } else {
        Launcher.data.element.style({
          opacity: '1',
          'backdrop-filter': 'blur(10px)',
          'pointer-events': 'all'
        })
      }

      isLauncherOpen = !isLauncherOpen
      return isLauncherOpen
    }
  }
}

export default Launcher
