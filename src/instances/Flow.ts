import { LoadedApp, LoadedPlugin } from '../types'
import nullIcon from '../assets/icons/application-default-icon.svg'

class Flow {
  apps: LoadedApp[] = []
  defaultAppList: string[] = [
    'settings',
    'music',
    'files',
    'editor',
    'info',
    'manager',
    'browser',
    'store'
  ]

  appList: string[] = []

  plugins: LoadedPlugin[] = []
  pluginList: string[] = []

  /**
   * Initiates applications.
   */
  private async initApps (): Promise<void> {
    window.preloader.setPending('apps')
    window.preloader.setStatus('importing apps...')

    window.fs.exists('/Applications', (exists) => {
      if (!exists) window.fs.promises.mkdir('/Applications').catch(e => console.error(e))
      window.fs.promises.readdir('/Applications').then((list) => {
        list.forEach((file) => {
          window.fs.promises.readFile('/Applications/' + file).then(content => {
            if (!content.toString().endsWith('.js')) return
            if (content.toString() === '') return
            this.appList.push(`data:text/javascript;base64,${btoa(content.toString())}`)
          }).catch((e) => console.error(e))
        })
      }).catch(e => console.error(e))
    })

    for (const appPath of this.defaultAppList) {
      window.preloader.setStatus(`importing default apps\n${appPath}`)
      const { default: ImportedApp } = await import(`../builtin/apps/${appPath}.ts`).catch(async (e: Error) => {
        console.error(e)
        await window.preloader.setError('apps')
        window.preloader.setStatus(`unable to import ${appPath}\n${e.name}: ${e.message}`)
      })
      const app = new ImportedApp()
      app.builtin = true
      app.meta.icon = app.meta.icon ?? nullIcon

      this.addApp(app)
    }

    if (this.appList.length > 0) {
      for (const appPath of this.appList) {
        window.preloader.setStatus(`importing appstore apps\n${appPath}`)

        try {
          const { default: ImportedApp } = await import(appPath)
          const app = new ImportedApp()
          app.builtin = false
          app.meta.icon = app.meta.icon ?? nullIcon

          this.addApp(app)
        } catch (e: any) {
          console.error(e)
          await window.preloader.setError('apps')
          window.preloader.setStatus(`unable to import ${appPath}\n${(e as Error).name}: ${(e as Error).message}`)
          break
        }
      }
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

  /**
   * Initiates plugins.
   */
  private async initPlugins (): Promise<void> {
    window.preloader.setPending('plugins')
    window.preloader.setStatus('importing default plugins...')

    for (const pluginPath of this.pluginList) {
      window.preloader.setStatus(`importing default plugins\n${pluginPath}`)
      const plugin = await import(`../builtin/plugins/${pluginPath}.ts`).catch((e: Error) => {
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

  /**
   * Initiates the Flow session.
   */
  async init (): Promise<void> {
    await this.initApps()
    await this.initPlugins()
  }

  /**
   * Registers an app.
   *
   * @param app The app to be registered.
   */
  addApp (app: LoadedApp): void {
    if (this.apps.some(x => x.meta.pkg === app.meta.pkg)) {
      console.error(`Unable to register app; ${app.meta.pkg} is already registered.`)
      return
    }

    this.apps.push(app)
  }

  /**
   * Registers a plugin.
   *
   * @param plugin The plugin to be registered.
   */
  addPlugin (plugin: LoadedPlugin): void {
    if (window.flow.plugins.some(x => x.meta.pkg === plugin.meta.pkg)) {
      console.error(`Unable to register tool; ${plugin.meta.pkg} is already registered.`)
      return
    }
    this.plugins.push(plugin)
  }

  /**
   * Opens a registered application.
   *
   * @param pkg The PKG ID of the application.
   * @param data Payload info for app to recieve.
   */
  async openApp (pkg: string, data?: any): Promise<void> {
    const app = this.apps.find(x => x.meta.pkg === pkg)
    const win = app?.open(data)
    const event = new CustomEvent('app_opened', { detail: { app, win: await win } })
    window.dispatchEvent(event)
  }
}

export default Flow
