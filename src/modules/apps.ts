import flow from '../flow.ts';
import { App } from '../types.ts';
import { FlowWindow } from '../wm.ts';

export const meta = {
  name: 'Apps',
  description: 'Displays the current apps open.',
  id: 'apps'
}

interface Status {
  win: FlowWindow,
  appElement: HTMLElement
}

export const run = (element: HTMLDivElement) => {
  let windows: Status[] = [];

  element.style.display = 'flex';
  element.style.alignItems = 'center';
  element.style.gap = '10px';
  element.style.paddingLeft = '15px';
  element.style.paddingRight = '15px';

  window.addEventListener('app_opened', (e: CustomEvent) => {
    const app = document.createElement('app');
    app.innerHTML = `<img src="${e.detail.app.icon}"/>`;
    app.onclick = async () => {
      const win = await e.detail.win;
      await win.focus();
      await win.toggleMin();
    }
    windows.push({ win: e.detail.win, appElement: app });
    element.appendChild(app);
  })

  window.addEventListener('app_closed', async (e: CustomEvent) => {
    const status = (await windows).find(async (x) => {
      return (await x) === e.detail.win;
    })
    status.appElement.remove();
    windows = windows.filter(x => x !== status);
  })
}