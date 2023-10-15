import './style.less';

import StatusBar from './statusbar.ts';
import WM from './wm.ts';

declare global {
  var wm: WM;
  var statusBar: StatusBar;
}

window.statusBar = new StatusBar();
window.wm = new WM();