import { Library } from '../../types'

let isLauncherOpen = false

const Launcher: Library = {
  config: {
    name: 'Launcher',
    type: 'library',
    targetVer: '1.0.0-indev.0'
  },
  init: (l, k) => {
    Launcher.data.element = new l.HTML('div').style({
      background: `${document.documentElement.style.getPropertyValue('--mantle')}E0`,
      width: '350px',
      height: '500px',
      margin: '20px',
      padding: '10px',
      overflow: 'hidden',
      'border-radius': '20px',
      border: '1px solid var(--surface-0)',
      position: 'fixed',
      bottom: '-500px',
      left: '0',
      transition: 'bottom 0.5s cubic-bezier(1,0,0,1)',
      'z-index': '1000',
      'box-shadow': '0 0 10px 0 rgba(0,0,0,0.5)',
      'user-select': 'none',
      'backdrop-filter': 'blur(10px)'
    })
  },
  data: {
    toggle: () => {
      if (isLauncherOpen) {
        Launcher.data.element.style({
          bottom: '-500px'
        })
      } else {
        Launcher.data.element.style({
          bottom: '68px'
        })
      }

      isLauncherOpen = !isLauncherOpen
      return isLauncherOpen
    }
  }
}

export default Launcher
