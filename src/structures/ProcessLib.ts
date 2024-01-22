import semver from 'semver'
import Kernel from '../kernel'
import { Process, Executable, Package, Library, Permission, LoadedLibrary, LibraryPath, FileSystem } from '../types'
import FlowWindow from './FlowWindow'
import LibraryLib from './LibraryLib'
import ProcLib from './ProcLib'

export default class ProcessLib {
  readonly pid: number
  readonly token: string
  process: Process
  fs: FileSystem
  private readonly _kernel: Kernel
  readonly kernel: {
    getExecutable: (url: string) => Promise<Executable>
    processList: Array<{ pid: number, name: string, token: string }>
    packageList: {
      [key: string]: Package
    }
    config: any
    setConfig: (config: any) => any
  }

  readonly permission: Permission

  win: FlowWindow
  readonly data: any

  readonly sysInfo: {
    codename: string
    version: string
  }

  constructor (url: string, pid: number, token: string, permission = Permission.USER, data = {}, process: Process, kernel: Kernel) {
    if (kernel.fs === false) return
    this.fs = kernel.fs
    this.permission = permission
    this.pid = pid
    this.token = token
    this._kernel = kernel
    this.kernel = {
      getExecutable: kernel.getExecutable.bind(kernel),
      processList: kernel.processList,
      packageList: kernel.packageList,
      config: kernel.config,
      setConfig: (config) => {
        if (this.permission >= Permission.ELEVATED) kernel.config = config
      }
    }
    this.process = process
    this.data = data

    this.sysInfo = {
      codename: kernel.codename,
      version: kernel.version
    }

    document.addEventListener('config_update', (e: CustomEvent) => {
      this.kernel.config = e.detail.config
    })
  }

  async loadLibrary <T extends LibraryPath>(url: T): Promise<LoadedLibrary<T>> {
    let executable: Executable
    try {
      const comps = import.meta.glob('../system/**/*.ts')
      const module = comps[`../system/${url}.ts`]
      const importedExecutable = (await module()) as any
      executable = importedExecutable.default
    } catch {
      const dataURL = `data:text/javascript;base64,${Buffer.from(await this.fs.readFile(`/opt/${url}.js`)).toString('base64')}`
      const importedExecutable = await import(dataURL)
      executable = importedExecutable.default
    }

    if (semver.gt(executable.config.targetVer, this.sysInfo.version)) throw new Error(`Executable requires a newer version of FlowOS: ${executable.config.targetVer}`)
    if (executable === undefined) throw new Error(`No default export found for package: ${url}.`)

    if (this._kernel.packageList[executable.config.name] === undefined) this._kernel.packageList[executable.config.name] = { url, executable }
    else if (this._kernel.packageList[executable.config.name].url !== url) throw new Error(`Package name conflict: ${executable.config.name}`)

    if (executable.config.type !== 'library') throw new Error(`Executable is not a library: ${executable.config.name}`)
    const executableLibrary = executable as Library
    executableLibrary.init(new LibraryLib(), this._kernel, this)

    return executableLibrary.data
  }

  async launch (url: string, data = {}): Promise<{ procLib: ProcessLib, executable: Process } | null> {
    const executable = await this._kernel.getExecutable(url)
    if (this.permission === Permission.SYSTEM) {
      return await this._kernel.startExecutable(url, Permission.USER, data)
    } else {
      const uac = await this._kernel.startExecutable('UserAccessControl', Permission.SYSTEM, {
        type: 'launch',
        executable,
        process: this
      }) as { value: boolean, procLib: ProcessLib }
      if (uac.value) {
        return await this._kernel.startExecutable(url, Permission.USER, data)
      } else {
        return null
      }
    }
  }

  async killProcess (pid: number): Promise<void> {
    const process = this._kernel.processList.find((p) => p.pid === pid)
    if (process === undefined) throw new Error(`Process ${pid} not found.`)
    const uac = await this._kernel.startExecutable('UserAccessControl', Permission.SYSTEM, {
      type: 'kill',
      name: process.name,
      process: this
    }) as { value: boolean, procLib: ProcessLib }
    if (pid === 0) throw new Error('Cannot kill BootLoader process.')
    if (uac.value) {
      return ProcLib.cleanupProcess(this._kernel, pid)
    }
  }

  async kill (): Promise<void> {
    ProcLib.cleanupProcess(this._kernel, this.pid)
  }
}
