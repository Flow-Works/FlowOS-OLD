import { App } from './types.ts'

class Flow {
  apps: App[] = []
  appList = [
    'settings',
    'music',
    'files',
    'editor',
    'info'
  ]

  async init (): Promise<void> {
    window.preloader.setPending('apps')
    window.preloader.setStatus('importing default apps...')

    for (const appPath of this.appList) {
      const { default: ImportedApp } = await import(`./apps/${appPath}.ts`)
      const app = new ImportedApp()

      window.preloader.setStatus(`importing default apps\n${appPath}`)
      this.add(app)
    }

    window.wm.launcher.style.opacity = '0'
    window.wm.launcher.style.filter = 'blur(0px)'
    window.wm.launcher.style.pointerEvents = 'none'

    window.preloader.setStatus('adding apps to app launcher...')

    this.apps.forEach((app) => {
      window.preloader.setStatus(`adding apps to app launcher\n${app.name}`)
      const appElement = document.createElement('app')
      appElement.onclick = async () => {
        await window.flow.openApp(app.pkg)
        window.wm.toggleLauncher()
      }
      appElement.innerHTML = `<img src="${app.icon}"><div>${app.name}</div>`
      window.wm.launcher.querySelector('apps')?.appendChild(appElement)
    })

    document.body.appendChild(window.wm.windowArea)
    document.body.appendChild(window.wm.launcher)

    await window.preloader.setDone('apps')
  }

  add (app: App): void {
    if (this.apps.some(x => x.pkg === app.pkg)) {
      console.error(`Unable to register app; ${app.pkg} is already registered.`)
      return
    }

    this.apps.push(app)
  }

  async openApp (pkg: string, data?: any): Promise<void> {
    const app = this.apps.find(x => x.pkg === pkg)
    const win = app?.open(data)
    const event = new CustomEvent('app_opened', { detail: { app, win: await win } })
    window.dispatchEvent(event)
  }
}

export default Flow
