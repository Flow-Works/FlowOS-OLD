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
  element.style.display = 'flex';
  element.style.alignItems = 'center';
  element.style.gap = '10px';
  element.style.paddingLeft = '15px';
  element.style.paddingRight = '15px';

  window.addEventListener('app_opened', async (e: CustomEvent) => {
    const app = document.createElement('app');
    app.innerHTML = `<img data-id="${(await e.detail.win).id}" src="${e.detail.app.icon}"/>`;
    app.onclick = async () => {
      const win = await e.detail.win;
      await win.focus();
      await win.toggleMin();
    }
    element.appendChild(app);
  })

  window.addEventListener('app_closed', async (e: CustomEvent) => {
    element.querySelector(`img[data-id="${(await e.detail.win).id}"]`).parentElement.remove();
  })
}