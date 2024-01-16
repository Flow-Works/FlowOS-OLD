import HTML from '../HTML'
import { AppClosedEvent, AppOpenedEvent, Process } from '../types'
import { getTime } from '../utils'
import { db, defaultFS, initializeDatabase, read, setFileSystem, write } from './lib/VirtualFS'
import nullIcon from '../assets/icons/application-default-icon.svg'
import { parse } from 'js-ini'
import { v4 as uuid } from 'uuid'

const BootLoader: Process = {
  config: {
    name: 'Bootloader',
    type: 'process',
    targetVer: '1.0.0-indev.0'
  },
  run: async (process) => {
    const splashScreen = await process.loadLibrary('lib/SplashScreen')
    const splashElement = splashScreen.getElement()
    splashElement.appendTo(document.body)

    const fs = await process.loadLibrary('lib/VirtualFS')
    const wm = await process.loadLibrary('lib/WindowManager')
    const launcher = await process.loadLibrary('lib/Launcher')

    await initializeDatabase('virtualfs')
    db.onerror = (event: Event) => {
      const target = event.target as IDBRequest
      const errorMessage = target.error !== null ? target.error.message : 'Unknown error'
      throw new Error(`[VirtualFS] ${target.error?.name ?? 'Unknown Error'}: ${errorMessage}`)
    }
    if ('storage' in navigator) {
      await navigator.storage?.persist()?.catch(e => console.error(e))
    } else {
      console.warn('Persistent storage is not supported.')
    }
    const fileSystem = await read()
    if (fileSystem === undefined) {
      await write(defaultFS)
    } else {
      await setFileSystem(fileSystem)
    }

    const config = Buffer.from(await fs.readFile('/etc/flow')).toString()
    process.kernel.setFS(fs)
    process.kernel.setConfig(parse(config))

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (const registration of registrations) {
        await registration.unregister()
      }

      try {
        await navigator.serviceWorker.register(`/uv-sw.js?url=${encodeURIComponent(btoa(process.kernel.config.SERVER))}&e=${uuid()}`, {
          scope: '/service/'
        })
      } catch (e) {
        console.error(e)
      }
    } else {
      console.warn('Service workers are not supported.')
    }

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
        .forEach(async (file: string) => {
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
          })
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

    statusBar.element.html(`
      <div class="outlined" data-toolbar-id="start"><span class="material-symbols-rounded">space_dashboard</span></div>
      
      <div data-toolbar-id="apps"></div>
      <flex></flex>
      <div class="outlined" data-toolbar-id="plugins"><span class="material-symbols-rounded">expand_less</span></div>
      <div class="outlined" data-toolbar-id="controls">
        <span class="material-symbols-rounded battery">battery_2_bar</span>
        <span class="material-symbols-rounded signal">signal_cellular_4_bar</span>
      </div>
      <div class="outlined" data-toolbar-id="calendar"></div>
      
    `)

    setInterval((): any => {
      getTime().then((time) => {
        statusBar.element.qs('div[data-toolbar-id="calendar"]').text(time)
      }).catch(e => console.error)
    }, 1000)

    statusBar.element.qs('div[data-toolbar-id="start"]').on('click', () => {
      launcher.toggle()
    })

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        statusBar.updateBatteryIcon(battery)

        battery.addEventListener('levelchange', () => {
          statusBar.updateBatteryIcon(battery)
        })

        battery.addEventListener('chargingchange', () => {
          statusBar.updateBatteryIcon(battery)
        })
      })
    } else {
      const batteryDiv = document.querySelector('div[data-toolbar-id="controls"] > .battery')
      if (batteryDiv != null) {
        batteryDiv.innerHTML = 'battery_unknown'
      }
    }

    async function ping (startTime: number): Promise<void> {
      fetch(`${process.kernel.config.SERVER as string}/bare/`)
        .then(() => {
          const endTime = performance.now()
          const pingTime = endTime - startTime
          statusBar.updateIcon(pingTime)
        })
        .catch(() => {
          (document.querySelector('div[data-toolbar-id="controls"] > .signal') as HTMLElement).innerHTML = 'signal_cellular_connected_no_internet_4_bar'
        })
    }

    setInterval((): any => ping(performance.now()), 10_000)

    document.addEventListener('app_opened', (e: AppOpenedEvent): void => {
      new HTML('app').appendMany(
        new HTML('img').attr({
          alt: `${e.detail.proc.config.name} icon`,
          'data-id': e.detail.token,
          src: e.detail.proc.config.icon ?? nullIcon
        }).on('click', () => {
          e.detail.win.focus()
          e.detail.win.toggleMin()
        })
      ).appendTo(statusBar.element.qs('div[data-toolbar-id="apps"]'))
    })

    document.addEventListener('app_closed', (e: AppClosedEvent): void => {
      statusBar.element.qs('div[data-toolbar-id="apps"]').qs(`img[data-id="${e.detail.token}"]`).elm.parentElement.remove()
    })

    document.body.style.flexDirection = 'column-reverse'

    await statusBar.element.appendTo(document.body)
    await launcher.element.appendTo(document.body)
    await wm.windowArea.appendTo(document.body)

    splashElement.cleanup()
  }
}

export default BootLoader
