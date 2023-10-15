import { App } from './types.ts';

import SettingsApp from './apps/settings.ts';
import FilesApp from './apps/files.ts';
import MusicApp from './apps/music.ts';
import EditorApp from './apps/editor.ts';

interface Flow {
  apps: {
    [key: string]: App
  },
  openApp: Function;
}

const flow: Flow = {
  apps: {
    "flow.settings": new SettingsApp(),
    "flow.music": new MusicApp(),
    "flow.files": new FilesApp(),
    "flow.editor": new EditorApp(),
  },
  openApp(pkg: string, data: any) {
    const win = this.apps[pkg].open(data);
    const event = new CustomEvent('app_opened', { detail: { app: this.apps[pkg], win } });
    window.dispatchEvent(event);
  }
}

export default flow;