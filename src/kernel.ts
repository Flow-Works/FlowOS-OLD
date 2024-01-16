import './assets/style.less'
import { version } from '../package.json'
import { v4 as uuid } from 'uuid'
import { Permission } from './system/lib/VirtualFS'
import ProcessLib from './structures/ProcessLib'
import ProcLib from './structures/ProcLib'
import { Executable, Process, Package, ProcessInfo, KernelConfig } from './types'
import semver from 'semver'

declare global {
  interface Window {
    kernel: Kernel
  }
}

const params = new URLSearchParams(window.location.search)

async function enableDebug (): Promise<void> {
  const { default: eruda } = await import('eruda')
  eruda.init()
  return await Promise.resolve()
}

if (params.get('debug') !== null && params.get('debug') !== undefined) {
  enableDebug().catch(e => console.error(e))
}

export default class Kernel {
  readonly version: string
  readonly codename: string
  processList: ProcessInfo[] = []
  packageList: {
    [key: string]: Package
  } = {}

  fs: any

  config: KernelConfig
  lastPid: number = 0

  constructor (version: string) {
    this.codename = 'Mochi'
    this.version = version
  }

  setFS (fs: any, process: ProcessLib): void {
    if (process.permission === Permission.SYSTEM) {
      this.fs = fs
    }
  }

  setConfig (data: any, process: ProcessLib): void {
    if (process.permission === Permission.SYSTEM) {
      this.config = data
      document.dispatchEvent(new CustomEvent('config_update', {
        detail: {
          config: this.config
        }
      }))
    }
  }

  async startExecutable (url: string, permission = Permission.USER, data = {}): Promise<{ procLib: ProcessLib, executable: Process } | any> {
    let executable: Executable
    try {
      const comps = import.meta.glob('./system/**/*.ts')
      const module = comps[`./system/${url}.ts`]
      const importedExecutable = (await module()) as any
      executable = importedExecutable.default
    } catch {
      if (this.fs === undefined) throw new Error('Filesystem hasn\'t been initiated.')
      const dataURL = 'data:text/javascript;base64,' + Buffer.from(await this.fs.readFile('/opt/' + url + '.js')).toString('base64')
      const importedExecutable = await import(dataURL)
      executable = importedExecutable.default
    }

    if (semver.gt(executable.config.targetVer, this.version)) throw new Error(`Executable requires a newer version of FlowOS: ${executable.config.targetVer}`)
    if (executable === undefined) throw new Error(`No default export found for package: ${url}.`)

    if (this.packageList[executable.config.name] === undefined) this.packageList[executable.config.name] = { url, executable }
    else if (this.packageList[executable.config.name].url !== url) throw new Error(`Package name conflict: ${executable.config.name}`)

    return await new Promise((resolve, reject) => {
      switch (executable.config.type) {
        case 'process': {
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
          break
        }

        default: {
          reject(new Error(`Unknown executable type: ${executable.config.type as string}`))
          break
        }
      }
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
      if (this.fs === undefined) throw new Error('Filesystem hasn\'t been initiated.')
      const dataURL = 'data:text/javascript;base64,' + Buffer.from(await this.fs.readFile('/opt/' + url + '.js')).toString('base64')
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

document.addEventListener('DOMContentLoaded', () => {
  import('material-symbols')
  const kernel = new Kernel(version)
  kernel.startExecutable('BootLoader', Permission.SYSTEM).catch(e => console.error(e))
})
