import icon from '../assets/icons/editor.png';
import { App } from "../types.ts";
import fs from 'fs';

interface EditorConfig {
  path: string;
}

export default class EditorApp implements App {
  name     = 'Editor';
  pkg      = 'flow.editor';
  icon     = icon;
  version  = '1.0.0';

  constructor() {}

  async open(data?: EditorConfig) {
    const win = window.wm.createWindow({
      title: this.name,
      icon: icon,
      width: 500,
      height: 400
    });

    if (data) {
      win.setTitle('Editor - ' + data.path);

      var { default: ace } = await import('brace');
      var editor = ace.edit(win.content);

      if (data.path.split('.').at(-1).match(/(m|c|)(js)/)) {
        require('brace/mode/javascript')
        editor.getSession().setMode('ace/mode/javascript');
      } else if (data.path.split('.').at(-1).match(/json/)) {
        require('brace/mode/json')
        editor.getSession().setMode('ace/mode/json');
      } else if (data.path.split('.').at(-1).match(/(htm)(l|)/)) {
        require('brace/mode/html')
        editor.getSession().setMode('ace/mode/html');
      } else if (data.path.split('.').at(-1).match(/css/)) {
        require('brace/mode/css')
        editor.getSession().setMode('ace/mode/css');
      }
      require('brace/theme/monokai');
      editor.setTheme('ace/theme/monokai');
      
      editor.setValue((await fs.promises.readFile(data.path)).toString());
    }
    
    return win;
  }
}