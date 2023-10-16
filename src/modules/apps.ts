import { AppOpenedEvent, AppClosedEvent } from '../types'

export const meta = {
  name: 'Apps',
  description: 'Displays the current apps open.',
  id: 'apps'
}

export const run = (element: HTMLDivElement): void => {
  element.style.display = 'flex'
  element.style.alignItems = 'center'
  element.style.gap = '10px'
  element.style.paddingLeft = '15px'
  element.style.paddingRight = '15px'

  window.addEventListener('app_opened', (e: AppOpenedEvent): void => {
    const appIcon = document.createElement('app')
    const app = e.detail.app
    const win = e.detail.win
    appIcon.innerHTML = `<img data-id="${win.id}" src="${app.icon}"/>`
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
