
import { AppClosedEvent, AppOpenedEvent, Plugin } from '../types'
import { getTime } from '../utils'

class StatusBar {
  element: HTMLElement

  /**
   * Creates the status bar.
   */
  constructor () {
    this.element = document.createElement('toolbar')

    this.element.innerHTML = `
      <div class="outlined" data-toolbar-id="start"><span class="material-symbols-rounded">space_dashboard</span></div>
      ${/* <div class="outlined" data-toolbar-id="widgets"><span class="material-symbols-rounded">widgets</span></div> */ ''}
      <div data-toolbar-id="apps"></div>
      <flex></flex>
      <div class="outlined" data-toolbar-id="plugins"><span class="material-symbols-rounded">expand_less</span></div>
      <div class="outlined" data-toolbar-id="controls">
        <span class="material-symbols-rounded battery">battery_2_bar</span>
        <span class="material-symbols-rounded signal">signal_cellular_4_bar</span>
      </div>
      <div class="outlined" data-toolbar-id="calendar"></div>
      ${/* <div class="outlined" data-toolbar-id="notifications">
        <span class="material-symbols-rounded">notifications</span>
      </div> */ ''}
    `

    setInterval((): any => {
      getTime().then((time) => {
        (this.element.querySelector('div[data-toolbar-id="calendar"]') as HTMLElement).innerText = time
      }).catch(e => console.error)
    }, 1000)

    this.element.querySelector('div[data-toolbar-id="start"]')?.addEventListener('click', () => {
      window.wm.toggleLauncher()
    })

    function updateBatteryIcon (battery: any): void {
      let iconHTML = ''

      if (battery.charging === true) {
        if (battery.level === 1) {
          iconHTML = 'battery_charging_full'
        } else if (battery.level >= 0.9) {
          iconHTML = 'battery_charging_90'
        } else if (battery.level >= 0.8) {
          iconHTML = 'battery_charging_80'
        } else if (battery.level >= 0.7) {
          iconHTML = 'battery_charging_70'
        } else if (battery.level >= 0.6) {
          iconHTML = 'battery_charging_60'
        } else if (battery.level >= 0.5) {
          iconHTML = 'battery_charging_50'
        } else if (battery.level >= 0.4) {
          iconHTML = 'battery_charging_40'
        } else if (battery.level >= 0.3) {
          iconHTML = 'battery_charging_30'
        } else if (battery.level >= 0.2) {
          iconHTML = 'battery_charging_20'
        }
      } else {
        if (battery.level === 1) {
          iconHTML = 'battery_full'
        } else if (battery.level >= 0.6) {
          iconHTML = 'battery_6_bar'
        } else if (battery.level >= 0.5) {
          iconHTML = 'battery_5_bar'
        } else if (battery.level >= 0.4) {
          iconHTML = 'battery_4_bar'
        } else if (battery.level >= 0.3) {
          iconHTML = 'battery_3_bar'
        } else if (battery.level >= 0.2) {
          iconHTML = 'battery_2_bar'
        } else if (battery.level >= 0.1) {
          iconHTML = 'battery_1_bar'
        } else if (battery.level >= 0) {
          iconHTML = 'battery_0_bar'
        }
      }

      const batteryDiv = document.querySelector('div[data-toolbar-id="controls"] > .battery')
      if (batteryDiv != null) {
        batteryDiv.innerHTML = iconHTML
      }
    }

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then(function (battery: any) {
        updateBatteryIcon(battery)

        battery.addEventListener('levelchange', function () {
          updateBatteryIcon(battery)
        })

        battery.addEventListener('chargingchange', function () {
          updateBatteryIcon(battery)
        })
      })
    } else {
      const batteryDiv = document.querySelector('div[data-toolbar-id="controls"] > .battery')
      if (batteryDiv != null) {
        batteryDiv.innerHTML = 'battery_unknown'
      }
    }

    function updateIcon (ms: number): void {
      let icon = ''

      if (ms >= 200 && ms < 400) {
        icon = 'signal_cellular_1_bar'
      } else if (ms >= 400 && ms < 600) {
        icon = 'signal_cellular_2_bar'
      } else if (ms >= 600 && ms < 800) {
        icon = 'signal_cellular_3_bar'
      } else if (ms >= 800) {
        icon = 'signal_cellular_4_bar'
      } else {
        icon = 'signal_cellular_0_bar'
      }

      (document.querySelector('div[data-toolbar-id="controls"] > .signal') as HTMLElement).innerHTML = icon
    }

    async function ping (startTime: number): Promise<void> {
      fetch((await window.config()).SERVER_URL + '/bare/')
        .then(() => {
          const endTime = performance.now()
          const pingTime = endTime - startTime
          updateIcon(pingTime)
        })
        .catch(() => {
          (document.querySelector('div[data-toolbar-id="controls"] > .signal') as HTMLElement).innerHTML = 'signal_cellular_connected_no_internet_4_bar'
        })
    }

    setInterval((): any => ping(performance.now()), 10000)

    window.addEventListener('app_opened', (e: AppOpenedEvent): void => {
      const appIcon = document.createElement('app')
      const app = e.detail.app
      const win = e.detail.win
      appIcon.innerHTML = `<img data-id="${win.id}" src="${app.meta.icon}"/>`
      appIcon.onclick = async () => {
        const win = await e.detail.win
        win.focus()
        win.toggleMin()
      }
      this.element.querySelector('div[data-toolbar-id="apps"]')?.appendChild(appIcon)
    })

    window.addEventListener('app_closed', (e: AppClosedEvent): void => {
      const win = e.detail.win
      this.element.querySelector('div[data-toolbar-id="apps"]')?.querySelector(`img[data-id="${win.id}"]`)?.parentElement?.remove()
    })

    document.body.style.flexDirection = 'column-reverse'
    document.body.appendChild(this.element)
  }

  /**
   * Adds a plugin to the status bar.
   *
   * @param item The plugin to be added to the status bar.
   */
  async add (item: Plugin): Promise<void> {
    const element = document.createElement('div')
    element.setAttribute('data-toolbar-id', item.meta.pkg)

    this.element.appendChild(element)

    await item.run(element, await window.config())
  }

  /**
   * Initiates the status bar.
   */
  async init (): Promise<void> {
    window.preloader.setStatus('adding plugins to statusbar...')

    for (const plugin of window.flow.plugins) {
      window.preloader.setStatus(`adding plugins to statusbar\n${plugin.meta.pkg}`)
      await this.add(plugin)
    }

    await window.preloader.setDone('plugins')
  }
}

export default StatusBar
