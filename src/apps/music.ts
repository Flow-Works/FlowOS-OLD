import icon from '../assets/icons/music.png'
import { App } from '../types.ts'
import { FlowWindow } from '../wm.ts'

export default class MusicApp implements App {
  name = 'Music'
  pkg = 'flow.music'
  icon = icon
  version = '1.0.0'

  async open (): Promise<FlowWindow> {
    const win = (window as any).wm.createWindow({
      title: this.name,
      icon
    })

    // TODO: add css styling (in /apps/html)
    win.content.innerHTML = '<iframe src="/src/apps/html/music.html></iframe>'

    return win
  }
}
