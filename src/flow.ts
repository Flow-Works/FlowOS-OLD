import { LoadedApp, LoadedPlugin } from './types.ts'

class Flow {
  apps: LoadedApp[] = []
  appList = [
    'settings',
    'music',
    'files',
    'editor',
    'info',
    'manager'
  ]

  plugins: LoadedPlugin[] = []
  pluginList: string[] = [
    'appLauncher',
    'apps',
    'weather',
    'clock',
    'switcher',
    'battery'
  ]

  private async initApps (): Promise<void> {
    window.preloader.setPending('apps')
    window.preloader.setStatus('importing default apps...')

    for (const appPath of this.appList) {
      window.preloader.setStatus(`importing default apps\n${appPath}`)
      const { default: ImportedApp } = await import(`./apps/${appPath}.ts`).catch((e: Error) => {
        console.error(e)
        window.preloader.setStatus(`unable to import ${appPath}\n${e.name}: ${e.message}`)
      })
      const app = new ImportedApp()
      app.builtin = true

      this.addApp(app)
    }

    window.wm.launcher.style.opacity = '0'
    window.wm.launcher.style.filter = 'blur(0px)'
    window.wm.launcher.style.pointerEvents = 'none'

    window.preloader.setStatus('adding apps to app launcher...')

    this.apps.forEach((app) => {
      window.preloader.setStatus(`adding apps to app launcher\n${app.meta.name}`)
      const appElement = document.createElement('app')
      appElement.onclick = async () => {
        await window.flow.openApp(app.meta.pkg)
        window.wm.toggleLauncher()
      }
      appElement.innerHTML = `<img src="${app.meta.icon}"><div>${app.meta.name}</div>`
      window.wm.launcher.querySelector('apps')?.appendChild(appElement)
    })

    document.body.appendChild(window.wm.windowArea)
    document.body.appendChild(window.wm.launcher)

    await window.preloader.setDone('apps')
  }

  private async initPlugins (): Promise<void> {
    window.preloader.setPending('plugins')
    window.preloader.setStatus('importing default plugins...')

    for (const pluginPath of this.pluginList) {
      window.preloader.setStatus(`importing default plugins\n${pluginPath}`)
      const plugin = await import(`./plugins/${pluginPath}.ts`).catch((e: Error) => {
        console.error(e)
        window.preloader.setStatus(`unable to import ${pluginPath}\n${e.name}: ${e.message}`)
      })
      const loadedPlugin = {
        ...plugin,
        builtin: true
      }
      this.addPlugin(loadedPlugin)
    }
  }

  async init (): Promise<void> {
    await this.initApps()
    await this.initPlugins()
  }

  addApp (app: LoadedApp): void {
    if (this.apps.some(x => x.meta.pkg === app.meta.pkg)) {
      console.error(`Unable to register app; ${app.meta.pkg} is already registered.`)
      return
    }

    this.apps.push(app)
  }

  addPlugin (plugin: LoadedPlugin): void {
    if (window.flow.plugins.some(x => x.meta.pkg === plugin.meta.pkg)) {
      console.error(`Unable to register tool; ${plugin.meta.pkg} is already registered.`)
      return
    }
    this.plugins.push(plugin)
  }

  async openApp (pkg: string, data?: any): Promise<void> {
    const app = this.apps.find(x => x.meta.pkg === pkg)
    const win = app?.open(data)
    const event = new CustomEvent('app_opened', { detail: { app, win: await win } })
    window.dispatchEvent(event)
  }
}

export default Flow
