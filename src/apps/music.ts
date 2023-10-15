import icon from '../assets/icons/music.png';
import { App } from "../types.ts";

export default class MusicApp implements App {
  name     = 'Music';
  pkg      = 'flow.music';
  icon     = icon;
  version  = '1.0.0';

  constructor() {}

  async open() {
    const win = window.wm.createWindow({
      title: this.name,
      icon: icon
    });

    win.content.innerHTML = 'hi';
    
    return win;
  }
}