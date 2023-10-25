import { FlowWindow } from './wm'

export interface PackageJSON {
  version: string
}

export interface AppOpenedEvent extends CustomEvent {
  detail: {
    app: App
    win: FlowWindow
  }
}

export interface AppClosedEvent extends CustomEvent {
  detail: {
    win: FlowWindow
  }
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

export interface App {
  meta: {
    name: string
    description: string
    pkg: string
    version: string
    icon: string
  }

  open: (data: any) => Promise<FlowWindow>
}

export interface Plugin {
  meta: {
    name: string
    description: string
    pkg: string
    version: string
    icon?: string
  }

  run: (element: HTMLDivElement) => void | Promise<void>
}

export interface Apps {
  [key: string]: App
}

export interface Plugins {
  [key: string]: Plugin
}

export interface LoadedApp extends App {
  builtin: boolean
}

export interface LoadedPlugin extends Plugin {
  builtin: boolean
}
