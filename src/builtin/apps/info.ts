import icon from '../../assets/icons/userinfo.svg'
import badge from '../../assets/badge.png'
import { App } from '../../types'

import FlowWindow from '../../structures/FlowWindow'
import HTML from '../../lib'

export default class InfoApp implements App {
  meta = {
    name: 'Info',
    description: 'FlowOS Information.',
    pkg: 'flow.info',
    version: '1.0.0',
    icon
  }

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.meta.name,
      icon: this.meta.icon,
      width: 300,
      height: 400,
      canResize: false
    })

    win.content.style.padding = '10px'
    win.content.style.textAlign = 'center'
    win.content.style.display = 'flex'
    win.content.style.flexDirection = 'column'
    win.content.style.justifyContent = 'center'
    win.content.style.alignItems = 'center'
    win.content.style.background = 'var(--base)'

    const div = new HTML('div').appendTo(win.content)
    new HTML('h1').style({
      margin: '0'
    }).text(`FlowOS ${window.flowDetails.codename}`).appendTo(div)
    new HTML('p').style({
      margin: '0'
    }).text(`v${window.flowDetails.version}`).appendTo(div)
    new HTML('br').appendTo(div)
    new HTML('img').attr({
      src: badge,
      height: '50'
    }).appendTo(div)
    new HTML('br').appendTo(div)
    new HTML('a').text('Discord').attr({
      href: 'https://discord.gg/86F8dK9vfn',
      class: 'discord'
    }).appendTo(div)
    new HTML('span').text(' - ').appendTo(div)
    new HTML('a').text('Github').attr({
      href: 'https://github.com/Flow-Works/FlowOS',
      class: 'github'
    }).appendTo(div)

    return win
  }
}
