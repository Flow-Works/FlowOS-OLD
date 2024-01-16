import { Library } from '../../types'

const StatusBar: Library = {
  config: {
    name: 'StatusBar',
    type: 'library',
    targetVer: '1.0.0-indev.0'
  },
  init: (l, k, p) => {
    StatusBar.data.element = new l.HTML('toolbar')
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
