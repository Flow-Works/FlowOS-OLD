import { Apps } from './types.ts'

class Flow {
  apps: Apps = {}

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
      this.apps[app.pkg] = app
    }

    window.wm.launcher.style.opacity = '0'
    window.wm.launcher.style.filter = 'blur(0px)'
    window.wm.launcher.style.pointerEvents = 'none'

    window.preloader.setStatus('adding apps to app launcher...')

    for (const pkg in window.flow.apps) {
      window.preloader.setStatus(`adding apps to app launcher\n${window.flow.apps[pkg].name}`)
      const app = document.createElement('app')
      app.onclick = async () => {
        await window.flow.openApp(pkg)
        window.wm.toggleLauncher()
      }
      app.innerHTML = `<img src="${window.flow.apps[pkg].icon}"><div>${window.flow.apps[pkg].name}</div>`
      window.wm.launcher.querySelector('apps')?.appendChild(app)
    }

    document.body.appendChild(window.wm.windowArea)
    document.body.appendChild(window.wm.launcher)

    await window.preloader.setDone('apps')
  }

  async openApp (pkg: string, data?: any): Promise<void> {
    const win = this.apps[pkg].open(data)
    const event = new CustomEvent('app_opened', { detail: { app: this.apps[pkg], win: await win } })
    window.dispatchEvent(event)
  }
}

export default Flow
