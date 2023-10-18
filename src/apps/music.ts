import icon from '../assets/icons/music.png'
import { App } from '../types.ts'
import { FlowWindow } from '../wm.ts'

export default class MusicApp implements App {
  meta = {
    name: 'Music',
    description: 'A simple music app.',
    pkg: 'flow.music',
    version: '1.0.0',
    icon
  }

  async open (): Promise<FlowWindow> {
    const win = window.wm.createWindow({
      title: this.meta.name,
      icon: this.meta.icon,
      width: 700,
      height: 300
    })

    win.content.style.background = 'var(--base)'
    win.content.innerHTML = 'hi'

    return win
  }
}
