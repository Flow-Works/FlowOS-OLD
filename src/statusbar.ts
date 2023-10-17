import * as clock from './modules/clock.ts'
import * as switcher from './modules/switcher.ts'
import * as appView from './modules/appLauncher.ts'
import * as apps from './modules/apps.ts'
import * as weather from './modules/weather.ts'
import * as battery from './modules/battery.ts'

import { StatusItem } from './types'

class StatusBar {
  items: StatusItem[] = []
  element: HTMLElement

  constructor () {
    this.element = document.createElement('toolbar')

    document.body.appendChild(this.element)

    this.add(appView)
    this.add(apps)
    this.add(weather)
    this.add(clock)
    this.add(switcher)
    this.add(battery)
  }

  add (item: StatusItem): void {
    if (this.items.some(x => x.meta.id === item.meta.id)) {
      console.error(`Unable to register tool; ${item.meta.id} is already registered.`)
      return
    }

    const element = document.createElement('div')
    element.setAttribute('data-toolbar-id', item.meta.id)

    this.items.push(item)
    this.element.appendChild(element)

    item.run(element)
  }
}

export default StatusBar
