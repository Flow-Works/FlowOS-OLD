import { AppOpenedEvent, AppClosedEvent } from '../types'

export const meta = {
  name: 'Apps',
  description: 'Displays the current apps open.',
  pkg: 'flow.apps',
  version: '1.0.0'
}

export const run = (element: HTMLDivElement): void => {
  element.style.display = 'flex'
  element.style.alignItems = 'center'
  element.style.gap = '5px'
  element.style.flex = '1'
  window.addEventListener('app_opened', (e: AppOpenedEvent): void => {
    const appIcon = document.createElement('app')
    const app = e.detail.app
    const win = e.detail.win
    appIcon.style.background = 'var(--surface-0)'
    appIcon.style.padding = '5px 7.5px'
    appIcon.style.borderRadius = '5px'
    appIcon.innerHTML = `<img data-id="${win.id}" src="${app.meta.id as string}"/> ${app.meta.name}`
    appIcon.onclick = async () => {
      const win = await e.detail.win
      win.focus()
      win.toggleMin()
    }
    element.appendChild(appIcon)
  })
  window.addEventListener('app_closed', (e: AppClosedEvent): void => {
    const win = e.detail.win
    element.querySelector(`img[data-id="${win.id}"]`)?.parentElement?.remove()
  })
}
