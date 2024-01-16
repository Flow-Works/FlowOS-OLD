import Kernel from './kernel'
import FlowWindow from './structures/FlowWindow'
import LibraryLib from './structures/LibraryLib'
import ProcessLib from './structures/ProcessLib'

export interface AppClosedEvent extends CustomEvent {
  detail: {
    token: string
  }
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
