import icon from '../assets/icons/music.png'
import { App } from '../types.ts'
import { FlowWindow } from '../wm.ts'

export default class MusicApp implements App {
  name = 'Music'
  pkg = 'flow.music'
  icon = icon
  version = '1.0.0'

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.name,
      icon,
      width: 700,
      height: 300
    })

    win.content.innerHTML = 'hi'

    return win
  }
}
