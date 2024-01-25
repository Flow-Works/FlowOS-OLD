import HTML from './HTML'
import Kernel from './kernel'
import FlowWindow from './structures/FlowWindow'
import LibraryLib from './structures/LibraryLib'
import ProcessLib from './structures/ProcessLib'
import MIMETypes from './system/lib/MIMETypes'

export interface AppClosedEvent extends CustomEvent {
  detail: {
    token: string
  }
}

export enum Errors {
  ENOENT = 'ENOENT',
  EISDIR = 'EISDIR',
  EEXIST = 'EEXIST',
  EPERM = 'EPERM',
  ENOTDIR = 'ENOTDIR',
  EACCES = 'EACCES'
}

export enum Permission {
  USER,
  ELEVATED,
  SYSTEM
}

export interface Directory {
  type: 'directory'
  permission: Permission
  deleteable: boolean
  children: {
    [key: string]: Directory | File
  }
}

export interface File {
  type: 'file'
  permission: Permission
  deleteable: boolean
  content: Buffer
}

export interface FileSystemObject {
  root: Directory
}

export interface AppOpenedEvent extends CustomEvent {
  detail: {
    proc: Process
    token: string
    win: FlowWindow
  }
}

export interface Package {
  url: string
  executable: Executable
}

export interface Executable {
  config: {
    name: string
    type: 'process' | 'library'
    icon?: string
    targetVer: string
  }
}

export type LibraryData = any
export interface Library extends Executable {
  config: {
    name: string
    type: 'library'
    targetVer: string
  }

  init: (library: LibraryLib, kernel: Kernel, process: ProcessLib) => void
  data: LibraryData
}

export interface Process extends Executable {
  config: {
    name: string
    type: 'process'
    icon?: string
    targetVer: string
  }

  run: (process: ProcessLib) => Promise<any>
}

export interface RepoAppMeta {
  name: string
  icon?: string
  targetVer: string
  url: string
}

export interface FlowWindowConfig {
  title: string
  icon: string

  width?: number
  height?: number

  canResize?: boolean

  minWidth?: number
  minHeight?: number
}
export interface RepoData {
  name: string
  id: string
  apps: RepoAppMeta[]
}

export interface ProcessInfo {
  pid: number
  name: string
  token: string
}

export interface KernelConfig {
  SERVER: string
  [key: string]: any
}

export interface Stats {
  isDirectory: () => boolean
  isFile: () => boolean
}

export interface FileSystem {
  unlink: (path: string) => Promise<void>
  readFile: (path: string) => Promise<Buffer>
  writeFile: (path: string, content: string | Buffer) => Promise<void>
  mkdir: (path: string) => Promise<void>
  rmdir: (path: string) => Promise<void>
  readdir: (path: string) => Promise<string[]>
  stat: (path: string) => Promise<Stats>
  rename: (oldPath: string, newPath: string) => Promise<void>
  exists: (path: string) => Promise<boolean>
}

export interface ModalData {
  value: boolean
  win: FlowWindow
}
export interface WindowManager {
  windowArea: HTML
  windows: FlowWindow[]
  getHighestZIndex: () => number
  createWindow: (config: FlowWindowConfig, process: ProcessLib) => FlowWindow
  createModal: (type: 'allow' | 'ok', title: string, text: string, process: ProcessLib) => Promise<ModalData>
}

export interface Launcher {
  element: HTML
  toggle: () => void
}

export interface XOR {
  encode: (str: string) => string
  decode: (str: string) => string
}

export interface StatusBar {
  element: HTML
  updateBatteryIcon: (battery: any) => void
  updateIcon: (ms: number) => void
}

export interface IComponents {
  [key: string]: {
    new: (...args: any[]) => InstanceType<typeof HTML>
  }
}

export type LoadedLibrary<T> =
    T extends 'lib/WindowManager' ? WindowManager :
      T extends 'lib/HTML' ? typeof HTML :
        T extends 'lib/Launcher' ? Launcher :
          T extends 'lib/XOR' ? XOR :
            T extends 'lib/StatusBar' ? StatusBar :
              T extends 'lib/MIMETypes' ? typeof MIMETypes.data :
                T extends 'lib/Components' ? IComponents :
                  any

export type LibraryPath = 'lib/VirtualFS' | 'lib/WindowManager' | string
