import pkg from '../package.json'
import VirtualFS from './system/VirtualFS'
import HTML from './HTML'
import { Executable, KernelConfig, Package, Permission, Process, ProcessInfo, FileSystem } from './types'
import ProcessLib from './structures/ProcessLib'
import semver from 'semver'
import ProcLib from './structures/ProcLib'
import { v4 as uuid } from 'uuid'
import eruda from 'eruda'
import { parse } from 'js-ini'

export const spaces = '         '

const print = {
  ok: (action: string, text: string) => console.log(`[  OK  ] ${action} ${text}`),
  failed: (action: string, text: string, error: any) => console.error(`[FAILED] ${action} ${text}`),
  none: (action: string, text: string) => console.group(`${action} ${text}`)
}

const handle = async (type: 'target' | 'service' | 'mount', name: string, Instance: any): Promise<boolean | any> => {
  try {
    if (type !== 'target') print.none(type === 'mount' ? 'Mounting' : 'Starting', name)
    const instance = typeof Instance === 'object' ? Instance : new Instance()
    const data = await instance.init()
    print.ok(
      type === 'service'
        ? 'Started'
        : type === 'mount'
          ? 'Mounted'
          : 'Reached target',
      name
    )
    console.groupEnd()
    return typeof Instance === 'object' ? data : instance
  } catch (e) {
    print.failed('Failed', `to start ${name}`, e)
    console.error(`${spaces}${e.stack.split('\n').join(`\n${spaces}`) as string}`)
    return false
  }
}

export default class Kernel {
  readonly version: string
  readonly codename: string
  processList: ProcessInfo[] = []
  packageList: {
    [key: string]: Package
  } = {}

  fs: FileSystem | false

  config: KernelConfig | false
  lastPid: number = 0

  constructor () {
    this.codename = 'Pocky'
    this.version = pkg.version
  }

  private async setTheme (themeName: string): Promise<void> {
    if (this.fs === false) throw new Error('Filesystem hasn\'t been initiated.')
    const file = await this.fs.readFile(`/etc/themes/${themeName}.theme`)
    const { colors } = JSON.parse(Buffer.from(file).toString())
    for (const color in colors) {
      document.documentElement.style.setProperty(`--${color}`, colors[color])
    }
  }

  async boot (boot: HTML, progress: HTML, args: URLSearchParams): Promise<void> {
    progress.style({ width: '0%' })
    const bootArgs = args.toString().replace(/=($|&)/g, '=true ')
    console.log(`FlowOS - v${pkg.version}, Flow Works (c) ${new Date().getFullYear()}`)
    console.log()
    console.log(`User Agent : ${navigator.userAgent}`)
    console.log(`Boot Args  : ${bootArgs === '' ? 'None' : bootArgs}`)
    console.log()
    console.log('...')
    console.log()
    if (args.has('debug')) eruda.init()
    this.fs = await handle('target', 'Virtual File Systems', VirtualFS)
    if (this.fs === false) return
    else progress.style({ width: '20%' })
    this.config = await handle('target', 'FlowOS Configuration', {
      init: async () => {
        if (this.fs === false) return
        return parse(Buffer.from(await this.fs.readFile('/etc/flow')).toString()) as any
      }
    })
    if (this.config === false) return
    else progress.style({ width: '40%' })
    await this.setTheme(this.config.THEME)
    document.addEventListener('theme_update', () => {
      if (this.config === false) return
      this.setTheme(this.config.THEME).catch(e => console.error(e))
    })
    const tmp = await handle('mount', 'Temporary Directory (/tmp)', {
      init: async () => {
        if (this.fs === false) return false
        if (await this.fs.exists('/tmp')) {
          await this.fs.rmdir('/tmp')
        }
        return await this.fs.mkdir('/tmp')
      }
    })
    if (tmp === false) return
    else progress.style({ width: '60%' })
    const sw = await handle('service', 'Service Worker', {
      init: async () => {
        if (this.config === false) return false
        const registrations = await navigator.serviceWorker.getRegistrations()
        for (const registration of registrations) {
          await registration.unregister()
        }
        await navigator.serviceWorker.register(`/uv-sw.js?url=${encodeURIComponent(btoa(this.config.SERVER))}&e=${uuid()}`, {
          scope: '/service/'
        })
      }
    })
    if (sw === false) return
    else progress.style({ width: '80%' })
    await handle('service', 'Desktop Environment', {
      init: () => {
        setTimeout(() => {
          import('./assets/style.less')
            .then(() => {
              boot.style({ display: 'none' })
              import('material-symbols')
                .then(async () => {
                  if (this.fs === false) return
                  console.log()
                  console.log('Welcome to FlowOS!')
                  console.log()
                  progress.style({ width: '100%' })
                  setTimeout(() => {
                    this.startExecutable('Desktop', Permission.SYSTEM).catch(e => console.error(e))
                  }, 750)
                })
                .catch(e => { throw e })
            })
            .catch(e => { throw e })
        }, 1000)
      }
    })
  }

  async startExecutable (url: string, permission = Permission.USER, data = {}): Promise<{ procLib: ProcessLib, executable: Process } | any> {
    let executable: Executable
    try {
      const comps = import.meta.glob('./system/**/*.ts')
      const module = comps[`./system/${url}.ts`]
      const importedExecutable = (await module()) as any
      executable = importedExecutable.default
    } catch {
      if (this.fs === false) throw new Error('Filesystem hasn\'t been initiated.')
      const dataURL = `data:text/javascript;base64,${Buffer.from(await this.fs.readFile(`/opt/${url}.js`)).toString('base64')}`
      const importedExecutable = await import(dataURL)
      executable = importedExecutable.default
    }

    if (semver.gt(executable.config.targetVer, this.version)) throw new Error(`Executable requires a newer version of FlowOS: ${executable.config.targetVer}`)
    if (executable === undefined) throw new Error(`No default export found for package: ${url}.`)

    if (this.packageList[executable.config.name] === undefined) this.packageList[executable.config.name] = { url, executable }
    else if (this.packageList[executable.config.name].url !== url) throw new Error(`Package name conflict: ${executable.config.name}`)

    return await new Promise((resolve, reject) => {
      if (executable.config.type === 'process') {
        const executableProcess = executable as Process
        console.group(`Starting ${url}`)
        const pid = ProcLib.findEmptyPID(this)
        const token = uuid()
        const procLib = new ProcessLib(url, pid, token, permission, data, executableProcess, this)
        this.processList.push({
          pid,
          token,
          name: executableProcess.config.name
        })
        document.dispatchEvent(new CustomEvent('update_process', {}))
        executableProcess.run(procLib).then((value: any) => {
          if (value !== undefined) procLib.kill().catch(e => console.error(e))
          document.dispatchEvent(new CustomEvent('update_process', {}))
          resolve({ procLib, value })
        }).catch(e => console.error(e))
        return
      }
      reject(new Error(`Unknown executable type: ${executable.config.type as string}`))
    })
  }

  async getExecutable (url: string): Promise<Executable> {
    let executable: Executable
    try {
      const comps = import.meta.glob('./system/**/*.ts')
      const module = comps[`./system/${url}.ts`]
      const importedExecutable = (await module()) as any
      executable = importedExecutable.default
    } catch {
      if (this.fs === false) throw new Error('Filesystem hasn\'t been initiated.')
      const dataURL = `data:text/javascript;base64,${Buffer.from(await this.fs.readFile(`/opt/${url}.js`)).toString('base64')}`
      const importedExecutable = await import(dataURL)
      executable = importedExecutable.default
    }

    if (semver.gt(executable.config.targetVer, this.version)) throw new Error(`Executable requires a newer version of FlowOS: ${executable.config.targetVer}`)
    if (executable === undefined) throw new Error(`No default export found for package: ${url}.`)

    if (this.packageList[executable.config.name] === undefined) this.packageList[executable.config.name] = { url, executable }
    else if (this.packageList[executable.config.name].url !== url) throw new Error(`Package name conflict: ${executable.config.name}`)

    return executable
  }
}
