import './style.less'

import StatusBar from './statusbar.ts'
import WM from './wm.ts'

(window as any).statusBar = new StatusBar();
(window as any).wm = new WM()
