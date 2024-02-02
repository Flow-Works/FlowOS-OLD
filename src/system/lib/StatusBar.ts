import { AppClosedEvent, AppOpenedEvent, Library } from '../../types'
import nullIcon from '../../assets/icons/application-default-icon.svg'
import { getTime } from '../../utils'

const StatusBar: Library = {
  config: {
    name: 'StatusBar',
    type: 'library',
    targetVer: '1.0.0-indev.0'
  },
  init: (l, k, p) => {
    StatusBar.data.element = new l.HTML('toolbar')
    StatusBar.data.element.html(`
      <div class="outlined" data-toolbar-id="start"><span class="material-symbols-rounded">space_dashboard</span></div>
      
      <div data-toolbar-id="apps"></div>
      <div style="flex:1;"></div>
      <div class="outlined" data-toolbar-id="plugins"><span class="material-symbols-rounded">expand_less</span></div>
      <div class="outlined" data-toolbar-id="controls">
        <span class="material-symbols-rounded battery">battery_2_bar</span>
        <span class="material-symbols-rounded signal">signal_cellular_4_bar</span>
      </div>
      <div class="outlined" data-toolbar-id="calendar"></div>
      
    `)

    setInterval((): any => {
      getTime().then((time) => {
        StatusBar.data.element.qs('div[data-toolbar-id="calendar"]')?.text(time)
      }).catch(e => console.error)
    }, 1000)

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        StatusBar.data.updateBatteryIcon(battery)

        battery.addEventListener('levelchange', () => {
          StatusBar.data.updateBatteryIcon(battery)
        })

        battery.addEventListener('chargingchange', () => {
          StatusBar.data.updateBatteryIcon(battery)
        })
      })
    } else {
      const batteryDiv = document.querySelector('div[data-toolbar-id="controls"] > .battery')
      if (batteryDiv != null) {
        batteryDiv.innerHTML = 'battery_unknown'
      }
    }

    async function ping (startTime: number): Promise<void> {
      fetch(`${(k.config as any).SERVER as string}/bare/`)
        .then(() => {
          const endTime = performance.now()
          const pingTime = endTime - startTime
          StatusBar.data.updateIcon(pingTime)
        })
        .catch(() => {
          (document.querySelector('div[data-toolbar-id="controls"] > .signal') as HTMLElement).innerHTML = 'signal_cellular_connected_no_internet_4_bar'
        })
    }

    setInterval((): any => ping(performance.now()), 10_000)

    document.addEventListener('app_opened', (e: AppOpenedEvent): void => {
      new l.HTML('app').appendMany(
        new l.HTML('img').attr({
          alt: `${e.detail.proc.config.name} icon`,
          'data-id': e.detail.token,
          src: e.detail.proc.config.icon ?? nullIcon
        }).on('click', () => {
          e.detail.win.focus()
          e.detail.win.toggleMin()
        })
      ).appendTo(StatusBar.data.element.qs('div[data-toolbar-id="apps"]')?.elm as HTMLElement)
    })

    document.addEventListener('app_closed', (e: AppClosedEvent): void => {
      StatusBar.data.element.qs('div[data-toolbar-id="apps"]')?.qs(`img[data-id="${e.detail.token}"]`)?.elm.parentElement?.remove()
    })
  },
  data: {
    updateBatteryIcon (battery: any) {
      let iconHTML = ''

      if (battery.charging === true) {
        if (battery.level === 1) {
          iconHTML = 'battery_charging_full'
        } else if (battery.level >= 0.9) {
          iconHTML = 'battery_charging_90'
        } else if (battery.level >= 0.8) {
          iconHTML = 'battery_charging_80'
        } else if (battery.level >= 0.6) {
          iconHTML = 'battery_charging_60'
        } else if (battery.level >= 0.5) {
          iconHTML = 'battery_charging_50'
        } else if (battery.level >= 0.3) {
          iconHTML = 'battery_charging_30'
        } else if (battery.level >= 0) {
          iconHTML = 'battery_charging_20'
        }
      } else if (battery.level === 1) {
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

      const batteryDiv = document.querySelector('div[data-toolbar-id="controls"] > .battery')
      if (batteryDiv != null) {
        batteryDiv.innerHTML = iconHTML
      }
    },
    updateIcon (ms: number) {
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
  }
}

export default StatusBar
