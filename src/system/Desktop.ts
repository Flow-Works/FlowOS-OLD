import HTML from '../HTML'
import { Process } from '../types'
import nullIcon from '../assets/icons/application-default-icon.svg'

const BootLoader: Process = {
  config: {
    name: 'Desktop',
    type: 'process',
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    const splashScreen = await process.loadLibrary('lib/SplashScreen')
    const splashElement = splashScreen.getElement()
    splashElement.appendTo(document.body)

    const { fs } = process
    const wm = await process.loadLibrary('lib/WindowManager')
    const launcher = await process.loadLibrary('lib/Launcher')

    const input = new HTML('input').attr({
      type: 'text',
      placeholder: 'Search'
    }).on('keyup', () => {
      apps.elm.innerHTML = ''
      renderApps().catch(e => console.error(e))
    }).appendTo(launcher.element)
    const apps = new HTML('apps').appendTo(launcher.element)

    const renderApps = async (): Promise<void> => {
      apps.html('')
      const files = await fs.readdir('/home/Applications/')
      files
        .filter((x: string) => x.endsWith('.app') && ((input.elm as HTMLInputElement) !== null ? x.toLowerCase().includes((input.elm as HTMLInputElement).value.toLowerCase()) : true))
        .forEach((file: string) => {
          fs.readFile(`/home/Applications/${file}`).then(async (data: Uint8Array) => {
            const path = Buffer.from(data).toString()
            const executable = await process.kernel.getExecutable(path) as Process

            const appElement = new HTML('app').on('click', () => {
              process.launch(path).catch((e: any) => console.error(e))
              launcher.toggle()
            }).appendTo(apps)
            new HTML('img').attr({
              src: executable.config.icon ?? nullIcon,
              alt: `${executable.config.name} icon`
            }).appendTo(appElement)
            new HTML('div').text(executable.config.name).appendTo(appElement)
          }).catch((e: any) => console.error(e))
        })
    }

    await renderApps()
    document.addEventListener('fs_update', () => {
      renderApps().catch(e => console.error(e))
    })

    launcher.element.on('click', (e: Event) => {
      if (e.target !== e.currentTarget) return
      launcher.toggle()
    })

    const statusBar = await process.loadLibrary('lib/StatusBar')

    statusBar.element.qs('div[data-toolbar-id="start"]')?.on('click', () => {
      launcher.toggle()
    })

    document.body.style.flexDirection = 'column-reverse'

    await statusBar.element.appendTo(document.body)
    await launcher.element.appendTo(document.body)
    await wm.windowArea.appendTo(document.body)

    splashElement.cleanup()
  }
}

export default BootLoader
